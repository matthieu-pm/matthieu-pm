import { getGitLabActivity, parseGitLabCalendar } from "./gitlab-activity"

export const githubProfileUrl = "https://github.com/matthieu-pm"

type Day = { date: string; count: number }

export type ActivityWeek = {
  start: string
  end: string
  github: number | null
  gitlab: number | null
  total: number
  activeDays: number
  future: boolean
  current: boolean
}

export type CodingActivityData = {
  year: number
  asOf: string
  weeks: ActivityWeek[]
  githubAvailable: boolean
  gitlabAvailable: boolean
}

// GitHub's public profile fragment pairs calendar cells with count tooltips.
// Match them by ID, not their DOM order (the cells are grouped by weekday).
export function parseGitHubCalendar(html: string): Day[] {
  const counts = new Map<string, number>()
  for (const match of html.matchAll(
    /<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g
  )) {
    const id = match[1]!.match(/\bfor="([^"]+)"/)?.[1]
    const label = match[2]!.replace(/<[^>]*>/g, "").trim()
    const count = label.match(/^(No|[\d,]+) contributions? on\b/)
    if (id && count) {
      counts.set(
        id,
        count[1] === "No" ? 0 : Number(count[1]!.replaceAll(",", ""))
      )
    }
  }

  const calendar: Record<string, number> = {}
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = match[0].match(/\bdata-date="([^"]+)"/)?.[1]
    const id = match[0].match(/\bid="([^"]+)"/)?.[1]
    const count = id ? counts.get(id) : undefined
    if (!date || count === undefined || Object.hasOwn(calendar, date)) {
      throw new Error("Invalid GitHub contribution day")
    }
    calendar[date] = count
  }
  if (Object.keys(calendar).length === 0) {
    throw new Error("Missing GitHub contribution calendar")
  }
  return parseGitLabCalendar(calendar)
}

export function combineActivity(
  github: Day[] | null,
  gitlab: Day[] | null,
  asOf: string
): CodingActivityData {
  const year = Number(asOf.slice(0, 4))
  const dayMs = 86_400_000
  const yearStart = Date.UTC(year, 0, 1)
  const yearEnd = Date.UTC(year, 11, 31)
  const today = Date.parse(`${asOf}T00:00:00Z`)
  const firstSunday = yearStart - new Date(yearStart).getUTCDay() * dayMs
  const key = (ms: number) => new Date(ms).toISOString().slice(0, 10)
  const githubDays = new Map(github?.map((day) => [day.date, day.count]))
  const gitlabDays = new Map(gitlab?.map((day) => [day.date, day.count]))
  const weeks: ActivityWeek[] = []

  for (let start = firstSunday; start <= yearEnd; start += 7 * dayMs) {
    const end = Math.min(start + 6 * dayMs, yearEnd)
    let githubCount = 0
    let gitlabCount = 0
    let activeDays = 0
    for (
      let day = Math.max(start, yearStart);
      day <= Math.min(end, today);
      day += dayMs
    ) {
      const gh = githubDays.get(key(day)) ?? 0
      const gl = gitlabDays.get(key(day)) ?? 0
      githubCount += gh
      gitlabCount += gl
      if (gh + gl > 0) activeDays++
    }
    weeks.push({
      start: key(Math.max(start, yearStart)),
      end: key(end),
      github: github === null ? null : githubCount,
      gitlab: gitlab === null ? null : gitlabCount,
      total: githubCount + gitlabCount,
      activeDays,
      future: start > today,
      current: start <= today && end >= today,
    })
  }
  return {
    year,
    asOf,
    weeks,
    githubAvailable: github !== null,
    gitlabAvailable: gitlab !== null,
  }
}

export async function getCodingActivity(): Promise<CodingActivityData> {
  const asOf = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
  const year = asOf.slice(0, 4)
  const [github, gitlab] = await Promise.allSettled([
    fetch(
      `${githubProfileUrl.replace("github.com/", "github.com/users/")}/contributions?from=${year}-01-01&to=${asOf}`,
      {
        next: { revalidate: 3600 },
        headers: { Accept: "text/html" },
        signal: AbortSignal.timeout(8000),
      }
    ).then(async (response) => {
      if (!response.ok)
        throw new Error(`GitHub calendar returned ${response.status}`)
      return parseGitHubCalendar(await response.text())
    }),
    getGitLabActivity(),
  ])
  return combineActivity(
    github.status === "fulfilled" ? github.value : null,
    gitlab.status === "fulfilled" ? (gitlab.value?.days ?? null) : null,
    asOf
  )
}
