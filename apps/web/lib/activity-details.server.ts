import {
  activityDetailsSchema,
  type ActivityDetailsSnapshot,
} from "./activity-details"

export async function getActivityDetails(): Promise<ActivityDetailsSnapshot | null> {
  const source = process.env.ACTIVITY_DETAILS_URL
  if (!source) return null

  try {
    const response = await fetch(source, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return null
    return activityDetailsSchema.parse(await response.json())
  } catch {
    return null
  }
}
