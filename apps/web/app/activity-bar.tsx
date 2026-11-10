"use client"

import {
  useId,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ActivityWeek, CodingActivityData } from "@/lib/coding-activity"
import type {
  ActivityDetails,
  ActivityDetailsSnapshot,
} from "@/lib/activity-details"
import styles from "./activity-bar.module.css"

const number = new Intl.NumberFormat("en-US")
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})
const fullDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})
const date = (value: string, year = false) =>
  (year ? fullDate : shortDate).format(new Date(`${value}T00:00:00Z`))
const range = (week: ActivityWeek, year = false) =>
  `${date(week.start, year)} – ${date(week.end, year)}`
const count = (value: number) =>
  `${number.format(value)} contribution${value === 1 ? "" : "s"}`

export function ActivityBar({
  data,
  initialDetails,
}: {
  data: CodingActivityData
  initialDetails: ActivityDetailsSnapshot | null
}) {
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const [hovered, setHovered] = useState<number | null>(null)
  const [focused, setFocused] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const currentIndex = data.weeks.findIndex((week) => week.current)
  const [tabIndex, setTabIndex] = useState(currentIndex < 0 ? 0 : currentIndex)
  const previewIndex = selected === null ? (hovered ?? focused) : null
  const preview = previewIndex === null ? null : data.weeks[previewIndex]
  const selection = selected === null ? null : data.weeks[selected]
  const max = Math.max(1, ...data.weeks.map((week) => week.total))
  const partial = !data.githubAvailable || !data.gitlabAvailable
  const selectedWeek = selection?.start
  const [detailedWeeks, setDetailedWeeks] = useState<
    Record<
      string,
      {
        details: ActivityDetails | null
        updatedAt?: string
      }
    >
  >(() =>
    Object.fromEntries(
      data.weeks.map((week) => [
        week.start,
        {
          details: initialDetails?.weeks[week.start] ?? null,
          updatedAt: initialDetails?.updatedAt,
        },
      ])
    )
  )
  const detailed = selectedWeek ? detailedWeeks[selectedWeek] : undefined

  useEffect(() => {
    if (!selectedWeek) return
    const week = selectedWeek
    let stopped = false
    let controller: AbortController | null = null
    async function refresh() {
      controller?.abort()
      const requestController = new AbortController()
      controller = requestController
      try {
        const response = await fetch(
          `/api/activity-details?week=${encodeURIComponent(week)}`,
          { cache: "no-store", signal: requestController.signal }
        )
        if (!response.ok) throw new Error("Activity details unavailable")
        const payload: {
          week: string
          updatedAt: string
          details: ActivityDetails | null
        } = await response.json()
        if (payload.week !== week) throw new Error("Unexpected activity week")
        if (!stopped)
          setDetailedWeeks((previous) => ({
            ...previous,
            [week]: {
              details: payload.details,
              updatedAt: payload.updatedAt,
            },
          }))
      } catch {
        if (!stopped && !requestController.signal.aborted)
          setDetailedWeeks((previous) => ({
            ...previous,
            [week]: {
              ...previous[week],
              details: previous[week]?.details ?? null,
            },
          }))
      }
    }
    void refresh()
    const timer = window.setInterval(refresh, 60_000)
    return () => {
      stopped = true
      controller?.abort()
      window.clearInterval(timer)
    }
  }, [selectedWeek])

  function close() {
    if (selected !== null) buttons.current[selected]?.focus()
    setSelected(null)
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const firstFuture = data.weeks.findIndex((week) => week.future)
    const last = firstFuture < 0 ? data.weeks.length - 1 : firstFuture - 1
    const next = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    const target = Math.max(0, Math.min(last, next))
    setTabIndex(target)
    buttons.current[target]?.focus()
  }

  if (!data.githubAvailable && !data.gitlabAvailable) {
    return (
      <div className={styles.unavailable}>
        Activity is temporarily unavailable. Explore my work on{" "}
        <a
          href="https://github.com/matthieu-pm"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        and{" "}
        <a
          href="https://gitlab.com/wondertale-dev"
          target="_blank"
          rel="noreferrer"
        >
          GitLab
        </a>
        .
      </div>
    )
  }

  return (
    <div
      className={styles.activity}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (selected !== null) close()
          setHovered(null)
          setFocused(null)
        }
      }}
    >
      <div
        className={styles.track}
        role="group"
        aria-label={`Weekly GitHub and GitLab activity in ${data.year}. Use arrow keys to explore and Enter to view a week.`}
        onPointerLeave={() => setHovered(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(null)
        }}
      >
        {data.weeks.map((week, index) => (
          <button
            className={styles.week}
            key={week.start}
            ref={(element) => {
              buttons.current[index] = element
            }}
            type="button"
            disabled={week.future}
            tabIndex={index === tabIndex ? 0 : -1}
            aria-label={`${range(week, true)}: ${week.future ? "upcoming week" : count(week.total)}${week.current ? " so far" : ""}${partial ? ", partial data" : ""}`}
            aria-expanded={selected === index}
            aria-controls={`${id}-details`}
            aria-describedby={
              previewIndex === index ? `${id}-tooltip` : undefined
            }
            data-future={week.future || undefined}
            data-empty={week.total === 0 || undefined}
            data-muted={(selected !== null && selected !== index) || undefined}
            data-selected={selected === index || undefined}
            style={
              {
                "--intensity": `${Math.round(35 + 65 * Math.sqrt(week.total / max))}%`,
                "--tilt": `${[0, 5, 0, -4, 0, 4, 0][index % 7]}deg`,
              } as CSSProperties
            }
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && !week.future)
                setHovered(index)
            }}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible"))
                setFocused(index)
              setTabIndex(index)
            }}
            onClick={() => {
              setSelected(selected === index ? null : index)
              setHovered(null)
            }}
            onKeyDown={(event) => navigate(event, index)}
          >
            <span className={styles.tick} aria-hidden="true" />
          </button>
        ))}
        {preview && previewIndex !== null && (
          <div
            className={styles.tooltip}
            role="tooltip"
            id={`${id}-tooltip`}
            style={
              {
                "--position": `${((previewIndex + 0.5) / data.weeks.length) * 100}%`,
              } as CSSProperties
            }
          >
            <span className={styles.tooltipDate}>{range(preview)}</span>
            <span>
              {count(preview.total)}
              {preview.current ? " so far" : ""}
            </span>
            <span className={styles.breakdown}>
              GitHub{" "}
              {preview.github === null
                ? "unavailable"
                : number.format(preview.github)}{" "}
              · GitLab{" "}
              {preview.gitlab === null
                ? "unavailable"
                : number.format(preview.gitlab)}
            </span>
            <span className={styles.tooltipAction}>
              View week <span aria-hidden="true">↗</span>
            </span>
          </div>
        )}
      </div>
      {partial && (
        <div className={styles.notice}>
          {data.githubAvailable ? "GitLab" : "GitHub"} activity is temporarily
          unavailable. Showing {data.githubAvailable ? "GitHub" : "GitLab"}{" "}
          activity.
        </div>
      )}
      {selection && (
        <div
          className={styles.details}
          id={`${id}-details`}
          role="region"
          aria-label={`Activity for ${range(selection, true)}`}
        >
          <div className={styles.detailsHeader}>
            <span>
              {range(selection, true)}
              {selection.current ? " · so far" : ""}
            </span>
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Close activity details"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          </div>
          <div className={styles.columns}>
            <div>
              <h3>Code activity</h3>
              {detailed?.details ? (
                <div
                  title={
                    detailed.updatedAt
                      ? `Updated ${new Date(detailed.updatedAt).toLocaleString("en-US")}`
                      : undefined
                  }
                >
                  <div>
                    {number.format(detailed.details.commits)} commit
                    {detailed.details.commits === 1 ? "" : "s"} across{" "}
                    {number.format(detailed.details.repositories)} repo
                    {detailed.details.repositories === 1 ? "" : "s"}
                  </div>
                  <div>
                    {number.format(detailed.details.linesAdded)} lines added
                  </div>
                  <div>
                    {number.format(detailed.details.linesDeleted)} lines deleted
                  </div>
                  {detailed.details.aiDiffs !== null && (
                    <div title="File edits recorded by successful Codex/Carbon patch and edit tools">
                      {number.format(detailed.details.aiDiffs)} AI diffs
                    </div>
                  )}
                  {detailed.details.mostUsedModel && (
                    <div title="Most completed Codex/Carbon turns this week">
                      Used {detailed.details.mostUsedModel} most
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>{count(selection.total)}</div>
                  <div>
                    {selection.activeDays} active day
                    {selection.activeDays === 1 ? "" : "s"}
                  </div>
                  <div className={styles.statsStatus}>
                    Detailed statistics unavailable
                  </div>
                </>
              )}
            </div>
            <div>
              <h3>Across both profiles</h3>
              <a
                href={`https://github.com/matthieu-pm?from=${selection.start}&to=${selection.end}`}
                target="_blank"
                rel="noreferrer"
              >
                GitHub{" "}
                <span>
                  {selection.github === null
                    ? "Unavailable"
                    : number.format(selection.github)}
                </span>{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://gitlab.com/wondertale-dev"
                target="_blank"
                rel="noreferrer"
              >
                GitLab{" "}
                <span>
                  {selection.gitlab === null
                    ? "Unavailable"
                    : number.format(selection.gitlab)}
                </span>{" "}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ActivityBarSkeleton() {
  return (
    <div
      className={styles.skeleton}
      role="status"
      aria-label="Loading coding activity"
    >
      {Array.from({ length: 53 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}
