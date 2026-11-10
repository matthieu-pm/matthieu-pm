import { getActivityDetails } from "@/lib/activity-details.server"

export async function GET(request: Request) {
  const week = new URL(request.url).searchParams.get("week")
  if (!week || !/^\d{4}-\d{2}-\d{2}$/.test(week))
    return Response.json({ error: "Invalid week" }, { status: 400 })
  const snapshot = await getActivityDetails()
  if (!snapshot)
    return Response.json(
      { error: "Activity statistics unavailable" },
      { status: 503 }
    )
  return Response.json(
    {
      week,
      updatedAt: snapshot.updatedAt,
      details: snapshot.weeks[week] ?? null,
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
