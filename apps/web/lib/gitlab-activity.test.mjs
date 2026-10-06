import assert from "node:assert/strict"
import { test } from "node:test"

import { getGitLabActivity, parseGitLabCalendar } from "./gitlab-activity.ts"

test("normalizes the sparse calendar without inventing activity", () => {
  assert.deepEqual(parseGitLabCalendar({ "2026-10-06": 0, "2026-10-04": 12 }), [
    { date: "2026-10-04", count: 12 },
    { date: "2026-10-06", count: 0 },
  ])
  assert.deepEqual(parseGitLabCalendar({}), [])
})

test("rejects error payloads, invalid dates and invalid counts", () => {
  for (const payload of [
    null,
    [],
    "html",
    { message: "Rate limited" },
    { "2026-02-30": 2 },
    { "2026-10-06": -1 },
    { "2026-10-06": 1.5 },
    { "2026-10-06": "4" },
    { "2026-10-06": Infinity },
  ]) {
    assert.throws(() => parseGitLabCalendar(payload))
  }
})

test("fetches real data with hourly revalidation and an explicit end date", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://gitlab.com/users/wondertale-dev/calendar.json")
    assert.equal(options.next.revalidate, 3600)
    assert.ok(options.signal instanceof AbortSignal)
    return Response.json({ "2026-10-04": 12 })
  })
  const result = await getGitLabActivity()
  assert.deepEqual(result.days, [{ date: "2026-10-04", count: 12 }])
  assert.match(result.endDate, /^\d{4}-\d{2}-\d{2}$/)
})

test("returns an unavailable state for rate limits, invalid JSON and timeouts", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch")
  for (const response of [
    new Response("Rate limited", { status: 429 }),
    new Response("<html>Sign in</html>"),
    Response.json({ error: "Private profile" }),
  ]) {
    fetch.mock.mockImplementation(async () => response)
    assert.equal(await getGitLabActivity(), null)
  }
  fetch.mock.mockImplementation(async () => {
    throw new DOMException("Timed out", "TimeoutError")
  })
  assert.equal(await getGitLabActivity(), null)
})
