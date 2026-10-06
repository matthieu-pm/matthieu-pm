import type { ContributionDay } from "@/components/ui/contribution-skyline"

export const gitlabProfileUrl = "https://gitlab.com/wondertale-dev"

// GitLab's own profile calendar returns daily contribution events, not commit counts.
// Keep this request on the server: no credentials or cross-origin browser request.
export async function getGitLabActivity(): Promise<{
  days: ContributionDay[]
  endDate: string
} | null> {
  try {
    const response = await fetch(
      "https://gitlab.com/users/wondertale-dev/calendar.json",
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!response.ok)
      throw new Error(`GitLab calendar returned ${response.status}`)
    const calendar: unknown = await response.json()
    const days = parseGitLabCalendar(calendar)
    const endDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date())
    return { days, endDate }
  } catch {
    return null
  }
}

export function parseGitLabCalendar(calendar: unknown): ContributionDay[] {
  if (!calendar || typeof calendar !== "object" || Array.isArray(calendar)) {
    throw new Error("Invalid GitLab calendar")
  }

  return Object.entries(calendar)
    .map(([date, count]) => {
      const ms = Date.parse(`${date}T00:00:00Z`)
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(ms) ||
        new Date(ms).toISOString().slice(0, 10) !== date ||
        typeof count !== "number" ||
        !Number.isSafeInteger(count) ||
        count < 0
      ) {
        throw new Error("Invalid GitLab contribution day")
      }
      return { date, count }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}
