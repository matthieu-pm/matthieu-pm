import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import {
  aggregate,
  extractPatchCount,
  parseGitLog,
  readAIFile,
  weekKey,
} from "./activity-collector.mjs"

test("uses Paris calendar weeks, including Sunday night and year boundaries", () => {
  assert.equal(weekKey("2026-11-07T23:30:00Z"), "2026-11-08")
  assert.equal(weekKey("2025-12-31T23:30:00Z"), "2026-01-01")
})

test("extracts patch operations from syntax without executing recorded code", () => {
  const patch =
    "*** Begin Patch\n*** Update File: /private/project/a.ts\n@@\n-old\n+new\n*** Add File: /private/project/b.ts\n+new\n*** End Patch"
  assert.equal(extractPatchCount(patch, "apply_patch"), 2)
  assert.equal(
    extractPatchCount(
      `await tools.apply_patch(${JSON.stringify(patch)})`,
      "exec"
    ),
    2
  )
  assert.equal(
    extractPatchCount(
      `console.log(${JSON.stringify(`tools.apply_patch(${JSON.stringify(patch)})`)})`,
      "exec"
    ),
    0
  )
  assert.equal(
    extractPatchCount(
      `throw new Error('must not execute'); await tools.apply_patch(${JSON.stringify(patch)})`,
      "exec"
    ),
    2
  )
  assert.equal(
    extractPatchCount(`await tools.apply_patch(dynamicValue)`, "exec"),
    0
  )
})

test("counts authored commits and numeric line stats, excluding binary files", () => {
  const sha = "a".repeat(40)
  const other = "b".repeat(40)
  const commits = parseGitLog(
    `\x1e${sha}\x1f2026-11-09T12:00:00Z\x1fMatthieu\n5\t2\ta.ts\n-\t-\tphoto.png\n\x1e${other}\x1f2026-11-09T13:00:00Z\x1fSomebody Else\n50\t20\tb.ts\n`,
    "private-repo"
  )
  assert.equal(commits.length, 1)
  assert.deepEqual(commits[0], {
    sha,
    week: "2026-11-08",
    repository: "private-repo",
    added: 5,
    deleted: 2,
  })
})

test("deduplicates mirrored commits and copied agent events and exports aggregates only", () => {
  const commit = {
    sha: "a".repeat(40),
    week: "2026-11-08",
    repository: "/private/repo",
    added: 5,
    deleted: 2,
  }
  const ai = {
    first: "2026-11-08T12:00:00Z",
    diffs: [{ id: "private-call", week: "2026-11-08", count: 1 }],
    turns: [
      { id: "private-turn", week: "2026-11-08", model: "GPT-6.1 Sol High" },
    ],
  }
  const snapshot = aggregate(
    [commit, { ...commit, repository: "mirror" }],
    [ai, { ...ai, diffs: [{ ...ai.diffs[0], count: 2 }] }],
    new Date("2026-11-09T12:00:00Z")
  )
  assert.equal(Object.keys(snapshot.weeks).length, 46)
  assert.deepEqual(snapshot.weeks["2026-11-08"], {
    commits: 1,
    repositories: 1,
    linesAdded: 5,
    linesDeleted: 2,
    aiDiffs: 2,
    mostUsedModel: "GPT-6.1 Sol High",
  })
  assert.equal(snapshot.weeks["2026-01-01"].aiDiffs, null)
  const output = JSON.stringify(snapshot)
  for (const secret of [
    "private-call",
    "private-turn",
    "/private/repo",
    commit.sha,
    "mirror",
  ])
    assert.ok(!output.includes(secret))
})

test("counts only completed patch/edit tools and completed model turns", async () => {
  const directory = await mkdtemp(join(tmpdir(), "activity-collector-test-"))
  const path = join(directory, "events.jsonl")
  const at = "2026-11-09T12:00:00Z"
  const patch =
    "*** Begin Patch\n*** Update File: /private/a.ts\n@@\n-old\n+new\n*** End Patch"
  const event = (type, payload) => ({ timestamp: at, type, payload })
  const entries = [
    event("turn_context", {
      turn_id: "turn",
      model: "gpt-6.1-sol",
      effort: "high",
    }),
    event("response_item", {
      type: "custom_tool_call",
      call_id: "success",
      name: "exec",
      input: `await tools.apply_patch(${JSON.stringify(patch)})`,
    }),
    event("response_item", {
      type: "custom_tool_call_output",
      call_id: "success",
      output: [{ type: "text", text: "Script completed\n{}" }],
    }),
    event("response_item", {
      type: "custom_tool_call",
      call_id: "failure",
      name: "apply_patch",
      input: patch,
    }),
    event("response_item", {
      type: "custom_tool_call_output",
      call_id: "failure",
      output: "Script failed: Invalid patch",
    }),
    event("event_msg", { type: "task_complete", turn_id: "turn" }),
  ]
  try {
    await writeFile(
      path,
      entries.map((value) => JSON.stringify(value)).join("\n") + "\n{incomplete"
    )
    const result = await readAIFile(path, "codex")
    assert.equal(result.diffs.length, 1)
    assert.equal(result.diffs[0].id, "success")
    assert.equal(result.turns[0].model, "GPT-6.1 Sol High")
    const carbon = [
      {
        ts: at,
        turnId: "carbon-turn",
        payload: { type: "turn_started", model: "claude-opus-5-5" },
      },
      {
        ts: at,
        payload: {
          type: "tool_call_started",
          callId: "edit",
          toolType: "file_edit",
        },
      },
      {
        ts: at,
        payload: {
          type: "tool_call_completed",
          callId: "edit",
          result: { isError: false },
        },
      },
      {
        ts: at,
        turnId: "carbon-turn",
        payload: { type: "turn_completed", status: "success" },
      },
    ]
    await writeFile(
      path,
      carbon.map((value) => JSON.stringify(value)).join("\n")
    )
    const result2 = await readAIFile(path, "carbon")
    assert.equal(result2.diffs[0].count, 1)
    assert.equal(result2.turns.length, 1)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
