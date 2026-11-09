import { execFileSync } from "node:child_process"
import { access, mkdir, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const label = "pm.matthieu.activity-sync"
const domain = `gui/${process.getuid()}`
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..")
const state = join(homedir(), ".local/share/matthieu-activity")
const agent = join(homedir(), "Library/LaunchAgents", `${label}.plist`)
const xml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
const command = process.argv[2] ?? "status"

if (process.platform !== "darwin")
  throw new Error("The background sync service requires macOS")

if (command === "install") {
  let node = "/opt/homebrew/bin/node"
  try {
    await access(node)
  } catch {
    node = process.execPath
  }
  const script = join(root, "apps/web/scripts/activity-collector.mjs")
  await mkdir(dirname(agent), { recursive: true })
  await mkdir(state, { recursive: true, mode: 0o700 })
  const args = [node, script, "--publish"]
    .map((value) => `<string>${xml(value)}</string>`)
    .join("")
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>${label}</string>
<key>ProgramArguments</key><array>${args}</array>
<key>WorkingDirectory</key><string>${xml(root)}</string>
<key>EnvironmentVariables</key><dict><key>PATH</key><string>${xml(`${dirname(node)}:${homedir()}/.bun/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin`)}</string></dict>
<key>StartInterval</key><integer>300</integer>
<key>RunAtLoad</key><true/>
<key>ProcessType</key><string>Background</string>
<key>LowPriorityIO</key><true/>
<key>StandardOutPath</key><string>${xml(join(state, "sync.log"))}</string>
<key>StandardErrorPath</key><string>${xml(join(state, "sync-error.log"))}</string>
</dict></plist>\n`
  try {
    execFileSync("launchctl", ["bootout", `${domain}/${label}`], {
      stdio: "ignore",
    })
  } catch {
    /* First installation. */
  }
  await writeFile(agent, plist, { mode: 0o600 })
  execFileSync("launchctl", ["bootstrap", domain, agent], { stdio: "inherit" })
  console.log("Installed activity sync: every five minutes, and at login.")
} else if (command === "status") {
  execFileSync("launchctl", ["print", `${domain}/${label}`], {
    stdio: "inherit",
  })
} else if (command === "stop") {
  execFileSync("launchctl", ["bootout", `${domain}/${label}`], {
    stdio: "inherit",
  })
  console.log("Activity sync stopped. Run activity:install to enable it again.")
} else {
  throw new Error("Use install, status, or stop")
}
