import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { createReadStream } from "node:fs"
import {
  mkdir,
  open,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"
import process from "node:process"
import { createInterface } from "node:readline"
import { DatabaseSync } from "node:sqlite"
import { fileURLToPath } from "node:url"
import { parseEnv, promisify } from "node:util"
import ts from "typescript"
import { activityDetailsSchema } from "../lib/activity-details.ts"

const run = promisify(execFile)

export async function uploadEnvironment(envFile, env = process.env) {
  let token = env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    try {
      token = parseEnv(await readFile(envFile, "utf8")).BLOB_READ_WRITE_TOKEN
    } catch (error) {
      if (error.code !== "ENOENT") throw error
    }
  }
  if (!token)
    throw new Error(
      "Activity uploads require BLOB_READ_WRITE_TOKEN in the environment or project .env.local"
    )
  // A process-level RW token prevents the CLI from selecting expired .env.local OIDC credentials.
  return {
    ...env,
    BLOB_READ_WRITE_TOKEN: token,
    VERCEL_OIDC_TOKEN: "",
    BLOB_STORE_ID: "",
  }
}

const home = homedir()
const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const projectRoot = resolve(webRoot, "../..")
const stateRoot =
  process.env.ACTIVITY_STATE_DIR || join(home, ".local/share/matthieu-activity")
const ignored = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "target",
  "dist",
  "build",
  "output",
  "outputs",
  "tmp",
  ".venv",
  "vendor",
  ".wrangler",
  ".cache",
])
const authorNames = new Set([
  "matthieu",
  "matthieu duchatellier",
  "matthieu-pm",
  "孟德",
])
const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export function weekKey(timestamp) {
  const day = formatter.format(new Date(timestamp))
  const midnight = new Date(`${day}T00:00:00Z`)
  midnight.setUTCDate(midnight.getUTCDate() - midnight.getUTCDay())
  const sunday = midnight.toISOString().slice(0, 10)
  return sunday < `${day.slice(0, 4)}-01-01`
    ? `${day.slice(0, 4)}-01-01`
    : sunday
}

export function patchFileCount(patch) {
  return [...patch.matchAll(/^\*\*\* (?:Add|Update|Delete) File: /gm)].length
}

export function extractPatchCount(input, name) {
  if (name === "apply_patch") return patchFileCount(input)
  if (name !== "exec" || !input.includes("apply_patch")) return 0
  let count = 0
  const ast = ts.createSourceFile(
    "recorded-tool.js",
    input,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "apply_patch" &&
      node.expression.expression.getText(ast) === "tools"
    ) {
      const patch = node.arguments[0]
      if (
        patch &&
        (ts.isStringLiteral(patch) || ts.isNoSubstitutionTemplateLiteral(patch))
      )
        count += patchFileCount(patch.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
  return count
}

function toolOutputText(output) {
  if (typeof output === "string") return output
  if (Array.isArray(output)) return output.map(toolOutputText).join("\n")
  if (output && typeof output === "object")
    return toolOutputText(output.text ?? output.content ?? "")
  return ""
}

function modelLabel(model, effort) {
  const words = String(model)
    .replace(/^gpt-/, "GPT-")
    .replace(/-/g, " ")
    .replace(/^GPT (\d)/, "GPT-$1")
    .replace(
      /\b(sol|astra|terra|codex|claude|opus|sonnet|haiku)\b/gi,
      (value) => value[0].toUpperCase() + value.slice(1)
    )
  return `${words}${effort && effort !== "none" ? ` ${effort[0].toUpperCase()}${effort.slice(1)}` : ""}`
}

export async function readAIFile(path, source) {
  const pending = new Map()
  const contexts = new Map()
  const diffs = new Map()
  const turns = new Map()
  let first = null
  const lines = createInterface({
    input: createReadStream(path),
    crlfDelay: Infinity,
  })
  for await (const line of lines) {
    let event
    try {
      event = JSON.parse(line)
    } catch {
      continue
    }
    const payload = event.payload
    if (!payload || typeof payload !== "object") continue
    let timestamp = event.timestamp ?? event.ts
    if (typeof timestamp === "number" && timestamp < 1e12) timestamp *= 1000
    if (!timestamp || !Number.isFinite(new Date(timestamp).getTime())) continue
    if (first === null || new Date(timestamp) < new Date(first))
      first = timestamp
    const key = weekKey(timestamp)
    if (source === "codex") {
      if (event.type === "turn_context" && payload.model) {
        contexts.set(
          payload.turn_id ?? payload.root_turn_id,
          modelLabel(payload.model, payload.effort)
        )
      }
      if (event.type === "event_msg" && payload.type === "task_complete") {
        const id = payload.turn_id ?? payload.root_turn_id
        const model = contexts.get(id)
        if (id && model) turns.set(id, { id, week: key, model })
      }
      if (
        event.type === "response_item" &&
        ["function_call", "custom_tool_call"].includes(payload.type)
      ) {
        const count = extractPatchCount(
          payload.input ?? payload.arguments ?? "",
          payload.name
        )
        if (count && payload.call_id)
          pending.set(payload.call_id, { count, week: key })
      }
      if (
        event.type === "response_item" &&
        ["function_call_output", "custom_tool_call_output"].includes(
          payload.type
        )
      ) {
        const edit = pending.get(payload.call_id)
        if (edit) {
          const output = toolOutputText(payload.output)
          if (
            /Script completed|Success\. Updated/.test(output) &&
            !/Script failed|Invalid patch|Failed to find expected|"status"\s*:\s*"rejected"/.test(
              output
            )
          ) {
            diffs.set(payload.call_id, { id: payload.call_id, ...edit })
          }
          pending.delete(payload.call_id)
        }
      }
      if (
        event.type === "event_msg" &&
        payload.type === "patch_apply_end" &&
        payload.success &&
        payload.call_id
      ) {
        diffs.set(payload.call_id, {
          id: payload.call_id,
          week: key,
          count: Object.keys(payload.changes ?? {}).length,
        })
      }
    } else {
      if (payload.type === "turn_started" && payload.model) {
        contexts.set(
          event.turnId,
          modelLabel(payload.model, payload.settings?.reasoningEffort)
        )
      }
      if (
        payload.type === "turn_completed" &&
        payload.status === "success" &&
        contexts.has(event.turnId)
      ) {
        turns.set(event.turnId, {
          id: event.turnId,
          week: key,
          model: contexts.get(event.turnId),
        })
      }
      if (
        payload.type === "tool_call_started" &&
        payload.toolType === "file_edit"
      )
        pending.set(payload.callId, { count: 1, week: key })
      if (payload.type === "tool_call_completed") {
        const edit = pending.get(payload.callId)
        if (
          edit &&
          payload.result &&
          !payload.result.isError &&
          (payload.result.exitCode == null || payload.result.exitCode === 0)
        ) {
          diffs.set(payload.callId, { id: payload.callId, ...edit })
        }
        pending.delete(payload.callId)
      }
      if (payload.type === "file_edits" && payload.callId) {
        const count = payload.edits?.length ?? 0
        diffs.set(payload.callId, {
          id: payload.callId,
          week: key,
          count: Math.max(count, diffs.get(payload.callId)?.count ?? 0),
        })
      }
    }
  }
  return { first, diffs: [...diffs.values()], turns: [...turns.values()] }
}

async function git(root, args) {
  return (
    await run("git", ["-C", root, ...args], {
      maxBuffer: 64 * 1024 * 1024,
      timeout: 60000,
    })
  ).stdout
}

async function repositories(root) {
  const found = new Map()
  async function visit(path) {
    let entries
    try {
      entries = await readdir(path, { withFileTypes: true })
    } catch {
      return
    }
    if (entries.some((entry) => entry.name === ".git")) {
      const remotes = (
        await git(path, ["remote", "-v"]).catch((error) => {
          if (/not a git repository/.test(error.stderr ?? "")) return ""
          throw error
        })
      )
        .split("\n")
        .filter((line) => /(?:github|gitlab)\.com[:/]/.test(line))
      if (remotes.length) {
        const common = (
          await git(path, [
            "rev-parse",
            "--path-format=absolute",
            "--git-common-dir",
          ])
        ).trim()
        const remoteNames = [
          ...new Set(remotes.map((line) => line.split(/\s+/)[0])),
        ]
        if (!found.has(common))
          found.set(common, {
            root: path,
            remotes: remoteNames,
            identity: remotes
              .map((line) => line.split(/\s+/)[1].replace(/\.git$/, ""))
              .sort()[0],
          })
      }
    }
    for (const entry of entries)
      if (entry.isDirectory() && !ignored.has(entry.name))
        await visit(join(path, entry.name))
  }
  await visit(root)
  return [...found.values()]
}

export function parseGitLog(log, repository) {
  const commits = []
  for (const section of log.split("\x1e").slice(1)) {
    const [header, ...lines] = section.split("\n")
    const [sha, timestamp, author] = header.split("\x1f")
    if (
      !authorNames.has(author?.trim().toLowerCase()) ||
      !/^[a-f0-9]{40,64}$/.test(sha) ||
      !Number.isFinite(new Date(timestamp).getTime())
    )
      continue
    let added = 0
    let deleted = 0
    for (const line of lines) {
      const numbers = line.match(/^(\d+)\t(\d+)\t/)
      if (numbers) {
        added += Number(numbers[1])
        deleted += Number(numbers[2])
      }
    }
    commits.push({ sha, week: weekKey(timestamp), repository, added, deleted })
  }
  return commits
}

async function aiFiles() {
  const files = new Map()
  for (const dbPath of [
    join(home, ".codex/state_5.sqlite"),
    join(home, ".codex/sqlite/state_5.sqlite"),
  ]) {
    try {
      const db = new DatabaseSync(dbPath, { readOnly: true })
      try {
        for (const row of db
          .prepare("SELECT rollout_path FROM threads")
          .all()) {
          try {
            files.set(await realpath(row.rollout_path), "codex")
          } catch {
            /* Not every synced thread has a local log. */
          }
        }
      } finally {
        db.close()
      }
    } catch (error) {
      if (error.code !== "ERR_SQLITE_ERROR" && error.code !== "ENOENT")
        throw error
    }
  }
  for (const root of [
    join(home, ".codex/sessions"),
    join(home, ".codex/archived_sessions"),
    join(home, ".carbon/sessions"),
  ]) {
    try {
      for (const name of await readdir(root, { recursive: true }))
        if (name.endsWith(".jsonl"))
          files.set(
            await realpath(join(root, name)),
            root.includes(".carbon") ? "carbon" : "codex"
          )
    } catch (error) {
      if (error.code !== "ENOENT") throw error
    }
  }
  return files
}

export function aggregate(commits, ai, now = new Date()) {
  const year = formatter.format(now).slice(0, 4)
  const weeks = {}
  const repoSets = new Map()
  const modelCounts = new Map()
  const firstAI = ai
    .map((file) => file.first)
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b))[0]
  const firstAIWeek = firstAI ? weekKey(firstAI) : null
  function week(key) {
    if (!weeks[key])
      weeks[key] = {
        commits: 0,
        repositories: 0,
        linesAdded: 0,
        linesDeleted: 0,
        aiDiffs: firstAIWeek && key >= firstAIWeek ? 0 : null,
        mostUsedModel: null,
      }
    return weeks[key]
  }
  const today = formatter.format(now)
  const cursor = new Date(`${year}-01-01T00:00:00Z`)
  cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay())
  while (cursor.toISOString().slice(0, 10) <= today) {
    const key = cursor.toISOString().slice(0, 10)
    week(key < `${year}-01-01` ? `${year}-01-01` : key)
    cursor.setUTCDate(cursor.getUTCDate() + 7)
  }
  const seenCommits = new Set()
  for (const commit of commits) {
    if (!commit.week.startsWith(year) || seenCommits.has(commit.sha)) continue
    seenCommits.add(commit.sha)
    const value = week(commit.week)
    value.commits++
    value.linesAdded += commit.added
    value.linesDeleted += commit.deleted
    if (!repoSets.has(commit.week)) repoSets.set(commit.week, new Set())
    repoSets.get(commit.week).add(commit.repository)
    value.repositories = repoSets.get(commit.week).size
  }
  const seenDiffs = new Map()
  const seenTurns = new Set()
  for (const file of ai) {
    for (const edit of file.diffs) {
      if (!edit.week.startsWith(year)) continue
      const previousCount = seenDiffs.get(edit.id) ?? 0
      if (previousCount >= edit.count) continue
      seenDiffs.set(edit.id, edit.count)
      const value = week(edit.week)
      value.aiDiffs = (value.aiDiffs ?? 0) + edit.count - previousCount
    }
    for (const turn of file.turns) {
      if (!turn.week.startsWith(year) || seenTurns.has(turn.id)) continue
      seenTurns.add(turn.id)
      week(turn.week)
      if (!modelCounts.has(turn.week)) modelCounts.set(turn.week, new Map())
      const counts = modelCounts.get(turn.week)
      counts.set(turn.model, (counts.get(turn.model) ?? 0) + 1)
    }
  }
  for (const [key, counts] of modelCounts)
    week(key).mostUsedModel = [...counts].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )[0][0]
  return {
    version: 1,
    updatedAt: now.toISOString(),
    weeks: Object.fromEntries(
      Object.entries(weeks).sort(([a], [b]) => a.localeCompare(b))
    ),
  }
}

async function main() {
  await mkdir(stateRoot, { recursive: true, mode: 0o700 })
  const lockPath = join(stateRoot, "sync.lock")
  let lock
  try {
    lock = await open(lockPath, "wx", 0o600)
  } catch (error) {
    if (error.code !== "EEXIST") throw error
    const pid = Number(await readFile(lockPath, "utf8"))
    try {
      process.kill(pid, 0)
      console.log("Activity sync already running.")
      return
    } catch {
      await rm(lockPath, { force: true })
      return main()
    }
  }
  await lock.writeFile(String(process.pid))
  try {
    let cache = { version: 1, files: {}, uploadedHash: null }
    try {
      const saved = JSON.parse(
        await readFile(join(stateRoot, "cache.json"), "utf8")
      )
      if (saved.version === 1 && saved.files && typeof saved.files === "object")
        cache = saved
    } catch {
      /* First run. */
    }
    const year = formatter.format(new Date()).slice(0, 4)
    const repos = await repositories(
      process.env.ACTIVITY_PROJECTS_ROOT || join(home, "Projects")
    )
    if (!repos.length) throw new Error("No GitHub/GitLab repositories found")
    const commits = []
    for (const repo of repos) {
      const log = await git(repo.root, [
        "log",
        ...repo.remotes.map((name) => `--remotes=${name}`),
        `--since=${year}-01-01T00:00:00+01:00`,
        "--extended-regexp",
        "--regexp-ignore-case",
        "--author=^(Matthieu|Matthieu Duchatellier|matthieu-pm|孟德) <",
        "--numstat",
        "--find-renames",
        "--no-ext-diff",
        "--no-textconv",
        "--format=%x1e%H%x1f%aI%x1f%aN",
      ])
      commits.push(...parseGitLog(log, repo.identity))
    }
    const ai = []
    const nextFiles = {}
    for (const [path, source] of await aiFiles()) {
      const meta = await stat(path)
      const previous = cache.files[path]
      const result =
        previous &&
        previous.size === meta.size &&
        previous.modified === meta.mtimeMs
          ? previous.result
          : await readAIFile(path, source)
      nextFiles[path] = { size: meta.size, modified: meta.mtimeMs, result }
      ai.push(result)
    }
    const snapshot = activityDetailsSchema.parse(aggregate(commits, ai))
    const hash = createHash("sha256")
      .update(JSON.stringify(snapshot.weeks))
      .digest("hex")
    const outputPath = join(stateRoot, "activity-details.json")
    await writeFile(outputPath, JSON.stringify(snapshot) + "\n", {
      mode: 0o600,
    })
    if (process.argv.includes("--publish") && hash !== cache.uploadedHash) {
      await run(
        process.env.ACTIVITY_VERCEL_BIN || join(home, ".bun/bin/vercel"),
        [
          "blob",
          "put",
          outputPath,
          "--access",
          "public",
          "--pathname",
          "activity/details.json",
          "--force",
          "--cache-control-max-age",
          "60",
          "--content-type",
          "application/json",
          "--scope",
          "matthieu-pm",
        ],
        {
          cwd: projectRoot,
          env: await uploadEnvironment(join(projectRoot, ".env.local")),
          timeout: 60000,
          maxBuffer: 1024 * 1024,
        }
      )
      cache.uploadedHash = hash
      console.log("Published weekly activity totals.")
    }
    await writeFile(
      join(stateRoot, "cache.next.json"),
      JSON.stringify({
        version: 1,
        files: nextFiles,
        uploadedHash: cache.uploadedHash,
      }),
      { mode: 0o600 }
    )
    await rename(
      join(stateRoot, "cache.next.json"),
      join(stateRoot, "cache.json")
    )
    console.log(
      `Collected ${snapshot.weeks ? Object.keys(snapshot.weeks).length : 0} weeks from ${repos.length} repositories and ${ai.length} AI logs.`
    )
  } finally {
    await lock.close()
    await rm(lockPath, { force: true })
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(`Activity sync failed: ${error.message.slice(0, 500)}`)
    process.exitCode = 1
  })
}
