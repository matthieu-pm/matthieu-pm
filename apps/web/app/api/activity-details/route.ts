import { activityDetailsSchema } from "@/lib/activity-details"

export async function GET(request: Request) {
  const week = new URL(request.url).searchParams.get("week")
  if (!week || !/^\d{4}-\d{2}-\d{2}$/.test(week))
    return Response.json({ error: "Invalid week" }, { status: 400 })
  const source = process.env.ACTIVITY_DETAILS_URL
  if (!source)
    return Response.json(
      { error: "Activity statistics unavailable" },
      { status: 503 }
    )
  try {
    const response = await fetch(source, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error("Activity export unavailable")
    const snapshot = activityDetailsSchema.parse(await response.json())
    return Response.json(
      {
        week,
        updatedAt: snapshot.updatedAt,
        details: snapshot.weeks[week] ?? null,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    return Response.json(
      { error: "Activity statistics unavailable" },
      { status: 503 }
    )
  }
}
