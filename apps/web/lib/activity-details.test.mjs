import assert from "node:assert/strict"
import process from "node:process"
import { test } from "node:test"
import { activityDetailsSchema } from "./activity-details.ts"
import { GET } from "../app/api/activity-details/route.ts"

const snapshot = {
  version: 1,
  updatedAt: "2026-11-09T12:00:00Z",
  weeks: {
    "2026-11-08": {
      commits: 12,
      repositories: 3,
      linesAdded: 100,
      linesDeleted: 20,
      aiDiffs: 4,
      mostUsedModel: "GPT-6.1 Sol High",
    },
  },
}

test("accepts aggregate totals and rejects extra fields and invalid counts", () => {
  assert.ok(activityDetailsSchema.safeParse(snapshot).success)
  for (const invalid of [
    { ...snapshot, prompts: ["private"] },
    { ...snapshot, weeks: { "2026-02-30": snapshot.weeks["2026-11-08"] } },
    {
      ...snapshot,
      weeks: {
        "2026-11-08": { ...snapshot.weeks["2026-11-08"], paths: ["private"] },
      },
    },
    {
      ...snapshot,
      weeks: { "2026-11-08": { ...snapshot.weeks["2026-11-08"], aiDiffs: -1 } },
    },
  ])
    assert.equal(activityDetailsSchema.safeParse(invalid).success, false)
})

test("serves a validated week without caching and handles missing or malformed exports", async () => {
  const previousFetch = globalThis.fetch
  const previousUrl = process.env.ACTIVITY_DETAILS_URL
  process.env.ACTIVITY_DETAILS_URL =
    "https://test.public.blob.vercel-storage.com/activity/details.json"
  try {
    globalThis.fetch = async (_url, options) => {
      assert.equal(options.cache, "no-store")
      return Response.json(snapshot)
    }
    const response = await GET(
      new Request("http://localhost/api/activity-details?week=2026-11-08")
    )
    assert.equal(response.status, 200)
    assert.equal(response.headers.get("Cache-Control"), "no-store")
    assert.deepEqual(
      (await response.json()).details,
      snapshot.weeks["2026-11-08"]
    )
    assert.equal(
      (await GET(new Request("http://localhost/api/activity-details?week=bad")))
        .status,
      400
    )
    assert.equal(
      (await GET(new Request("http://localhost/api/activity-details"))).status,
      400
    )
    globalThis.fetch = async () =>
      Response.json({ ...snapshot, private: "data" })
    assert.equal(
      (
        await GET(
          new Request("http://localhost/api/activity-details?week=2026-11-08")
        )
      ).status,
      503
    )
    globalThis.fetch = async () => {
      throw new Error("Offline")
    }
    assert.equal(
      (
        await GET(
          new Request("http://localhost/api/activity-details?week=2026-11-08")
        )
      ).status,
      503
    )
  } finally {
    globalThis.fetch = previousFetch
    if (previousUrl === undefined) delete process.env.ACTIVITY_DETAILS_URL
    else process.env.ACTIVITY_DETAILS_URL = previousUrl
  }
})
