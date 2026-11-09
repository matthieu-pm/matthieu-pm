import assert from "node:assert/strict"
import { test } from "node:test"

import {
  combineActivity,
  getCodingActivity,
  parseGitHubCalendar,
} from "./coding-activity.ts"

const githubHtml = `
  <td data-date="2026-01-05" id="day-b" data-level="4"></td>
  <td id="day-a" data-date="2026-01-04" data-level="0"></td>
  <tool-tip for="day-a">No contributions on January 4th.</tool-tip>
  <tool-tip for="day-b">1,234 contributions on January 5th.</tool-tip>`

test("matches GitHub counts by cell ID, including zeroes and thousands", () => {
  assert.deepEqual(parseGitHubCalendar(githubHtml), [
    { date: "2026-01-04", count: 0 },
    { date: "2026-01-05", count: 1234 },
  ])
})

test("rejects missing counts, invalid dates and changed calendar markup", () => {
  for (const html of [
    "<html>Rate limited</html>",
    githubHtml.replace('for="day-b"', 'for="missing"'),
    githubHtml.replace("2026-01-05", "2026-02-30"),
    githubHtml.replace("1,234 contributions", "unknown contributions"),
    githubHtml + '<td data-date="2026-01-05" id="day-b"></td>',
  ])
    assert.throws(() => parseGitHubCalendar(html))
})

test("combines both platforms into calendar weeks, preserving source counts", () => {
  const result = combineActivity(
    [
      { date: "2026-01-03", count: 2 },
      { date: "2026-01-04", count: 4 },
      { date: "2026-01-06", count: 99 },
    ],
    [
      { date: "2026-01-04", count: 7 },
      { date: "2026-01-05", count: 1 },
      { date: "2025-12-31", count: 50 },
    ],
    "2026-01-05"
  )
  assert.equal(result.weeks.length, 53)
  assert.equal(result.weeks[0].start, "2026-01-01")
  assert.equal(result.weeks[0].total, 2)
  assert.deepEqual(result.weeks[1], {
    start: "2026-01-04",
    end: "2026-01-10",
    github: 4,
    gitlab: 8,
    total: 12,
    activeDays: 2,
    current: true,
    future: false,
  })
  assert.equal(result.weeks[2].future, true)
  assert.equal(result.weeks[2].total, 0)
  assert.equal(result.weeks[52].end, "2026-12-31")
})

test("handles leap years, the final week and known zero activity", () => {
  const result = combineActivity(
    [],
    [
      { date: "2024-02-29", count: 3 },
      { date: "2024-12-31", count: 5 },
    ],
    "2024-12-31"
  )
  assert.equal(
    result.weeks.reduce((sum, week) => sum + week.total, 0),
    8
  )
  assert.equal(result.weeks.at(-1).current, true)
  assert.equal(
    result.weeks.some((week) => week.future),
    false
  )
  assert.equal(result.githubAvailable, true)
  assert.equal(result.weeks[0].github, 0)
})

test("unavailable sources remain unknown instead of reporting zero", () => {
  const result = combineActivity(
    null,
    [{ date: "2026-01-05", count: 5 }],
    "2026-01-05"
  )
  assert.equal(result.githubAvailable, false)
  assert.equal(result.gitlabAvailable, true)
  assert.equal(result.weeks[1].github, null)
  assert.equal(result.weeks[1].total, 5)
})

test("fetches the two public profiles with hourly caching and degrades independently", async () => {
  const originalFetch = globalThis.fetch
  let githubFails = false
  let gitlabFails = false
  const urls = []
  globalThis.fetch = async (url, options) => {
    urls.push(String(url))
    assert.equal(options.next.revalidate, 3600)
    assert.ok(options.signal instanceof AbortSignal)
    if (
      String(url).startsWith(
        "https://github.com/users/matthieu-pm/contributions?"
      )
    ) {
      if (githubFails) return new Response("Rate limited", { status: 429 })
      return new Response(githubHtml)
    }
    assert.equal(url, "https://gitlab.com/users/wondertale-dev/calendar.json")
    if (gitlabFails) throw new DOMException("Timed out", "TimeoutError")
    return Response.json({ "2026-01-05": 4 })
  }
  try {
    const complete = await getCodingActivity()
    assert.equal(complete.githubAvailable, true)
    assert.equal(complete.gitlabAvailable, true)
    assert.equal(urls.length, 2)
    githubFails = true
    const partial = await getCodingActivity()
    assert.equal(partial.githubAvailable, false)
    assert.equal(partial.gitlabAvailable, true)
    gitlabFails = true
    const unavailable = await getCodingActivity()
    assert.equal(unavailable.githubAvailable, false)
    assert.equal(unavailable.gitlabAvailable, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})
