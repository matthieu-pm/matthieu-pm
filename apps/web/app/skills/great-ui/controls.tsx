"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { SlotText } from "slot-text/react"
import "slot-text/style.css"
import {
  ArrowTurnBackwardIcon,
  Copy01Icon,
  GithubIcon,
  Link01Icon,
  Message02Icon,
  Notification02Icon,
  PauseIcon,
  PlayIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import styles from "./showcase.module.css"

const command = "npx skills add matthieu-pm/great-ui"
const countStart = 1201
const countEnd = 1250
const countStepDuration = 120
type IconData = typeof Copy01Icon

function SwapIcon({
  active,
  activeIcon,
  idleIcon,
  size = 18,
}: {
  active: boolean
  activeIcon: IconData
  idleIcon: IconData
  size?: number
}) {
  return (
    <span className={styles.iconSwap} aria-hidden="true">
      <span
        className={`${styles.iconState} ${active ? styles.iconActive : ""}`}
      >
        <HugeiconsIcon icon={activeIcon} size={size} strokeWidth={2} />
      </span>
      <span
        className={`${styles.iconState} ${!active ? styles.iconActive : ""}`}
      >
        <HugeiconsIcon icon={idleIcon} size={size} strokeWidth={1.7} />
      </span>
    </span>
  )
}

function useTemporaryState(duration = 2200) {
  const [active, setActive] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  function trigger() {
    if (timer.current) clearTimeout(timer.current)
    setActive(true)
    timer.current = setTimeout(() => setActive(false), duration)
  }

  return [active, trigger] as const
}

export function HeaderControls({ pageUrl }: { pageUrl: string }) {
  const [copied, markCopied] = useTemporaryState()

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl)
    markCopied()
  }

  return (
    <nav className={styles.headerControls} aria-label="Page actions">
      <Link
        href="/"
        className={styles.headerButton}
        aria-label="Return to home"
      >
        <HugeiconsIcon
          icon={ArrowTurnBackwardIcon}
          size={20}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </Link>
      <button
        type="button"
        className={styles.headerButton}
        onClick={copyLink}
        aria-label={copied ? "Page link copied" : "Copy page link"}
      >
        <SwapIcon
          active={copied}
          activeIcon={Tick02Icon}
          idleIcon={Link01Icon}
          size={20}
        />
      </button>
      <span className={styles.srOnly} role="status">
        {copied ? "Page link copied" : ""}
      </span>
    </nav>
  )
}

export function InstallCommand() {
  const [copied, markCopied] = useTemporaryState()

  async function copyCommand() {
    await navigator.clipboard.writeText(command)
    markCopied()
  }

  return (
    <div className={styles.install}>
      <div className={styles.commandRow}>
        <code>
          <span>npx</span> skills add matthieu-pm/great-ui
        </code>
        <button
          type="button"
          onClick={copyCommand}
          aria-label={
            copied ? "Install command copied" : "Copy install command"
          }
        >
          <SwapIcon
            active={copied}
            activeIcon={Tick02Icon}
            idleIcon={Copy01Icon}
          />
        </button>
      </div>
      <nav className={styles.installLinks} aria-label="Install resources">
        <a
          href="https://skills.sh/matthieu-pm/great-ui/great-ui"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/logos/skills.png"
            width={18}
            height={18}
            alt=""
            aria-hidden="true"
          />
          Skills
        </a>
        <a
          href="https://github.com/matthieu-pm/great-ui"
          target="_blank"
          rel="noreferrer"
        >
          <HugeiconsIcon
            icon={GithubIcon}
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
          GitHub
        </a>
      </nav>
      <span className={styles.srOnly} role="status">
        {copied ? "Install command copied" : ""}
      </span>
    </div>
  )
}

export function InterfaceLab() {
  return (
    <div className={styles.demo}>
      <div className={styles.preview}>
        <div className={styles.comparisonGrid}>
          <DemoCanvas motion={false} />
          <DemoCanvas motion />
        </div>
      </div>
    </div>
  )
}

type DemoCanvasProps = {
  motion: boolean
}

function DemoCanvas({ motion }: DemoCanvasProps) {
  const [period, setPeriod] = useState("Day")
  const [playing, setPlaying] = useState(false)
  const [count, setCount] = useState(countStart)
  const [following, setFollowing] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [copied, markCopied] = useTemporaryState(1600)
  const formattedCount = count.toLocaleString("en-US")

  useEffect(() => {
    if (!playing) return

    const timer = window.setTimeout(() => {
      const nextCount = Math.min(count + 1, countEnd)
      setCount(nextCount)

      if (nextCount === countEnd) setPlaying(false)
    }, countStepDuration)

    return () => window.clearTimeout(timer)
  }, [count, playing])

  function toggleCount() {
    if (playing) {
      setPlaying(false)
      return
    }

    if (count === countEnd) setCount(countStart)
    setPlaying(true)
  }

  return (
    <div
      className={`${styles.demoCanvas} ${styles.polished} ${motion ? styles.motionPanel : styles.staticPanel}`}
    >
      <div className={styles.controlStack}>
        <div className={styles.profileRow}>
          <span className={styles.avatar} aria-hidden="true">
            M
          </span>
          <button type="button" className={styles.messageButton}>
            <HugeiconsIcon icon={Message02Icon} size={18} strokeWidth={2} />
            Message
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={
              notifications ? "Turn notifications off" : "Turn notifications on"
            }
            aria-pressed={notifications}
            onClick={() => setNotifications(!notifications)}
          >
            <HugeiconsIcon
              icon={Notification02Icon}
              size={18}
              strokeWidth={1.7}
            />
            {notifications && <span className={styles.notificationDot} />}
          </button>
        </div>

        <div
          className={styles.segmented}
          role="group"
          aria-label={`${motion ? "Motion" : "Static"} period`}
        >
          {["Day", "Week", "Month"].map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={period === item}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.actionGroup}>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={playing ? "Pause count" : "Play count"}
              aria-pressed={playing}
              onClick={toggleCount}
            >
              {motion ? (
                <SwapIcon
                  active={playing}
                  activeIcon={PauseIcon}
                  idleIcon={PlayIcon}
                />
              ) : (
                <HugeiconsIcon
                  icon={playing ? PauseIcon : PlayIcon}
                  size={18}
                  strokeWidth={1.4}
                />
              )}
            </button>
            <span className={styles.metric}>
              {motion && (
                <span className={styles.srOnly}>{formattedCount}</span>
              )}
              {motion ? (
                <SlotText
                  aria-hidden="true"
                  text={formattedCount}
                  options={{
                    direction: "up",
                    duration: countStepDuration,
                    stagger: 8,
                    exitOffset: 18,
                    easing: "cubic-bezier(0.2, 0, 0, 1)",
                    bounce: 0,
                  }}
                />
              ) : (
                formattedCount
              )}
            </span>
          </div>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={markCopied}
              aria-label={copied ? "Copied" : "Copy profile"}
            >
              {motion ? (
                <SwapIcon
                  active={copied}
                  activeIcon={Tick02Icon}
                  idleIcon={Copy01Icon}
                />
              ) : (
                <HugeiconsIcon
                  icon={copied ? Tick02Icon : Copy01Icon}
                  size={18}
                  strokeWidth={1.4}
                />
              )}
            </button>
            <button
              type="button"
              className={styles.followButton}
              aria-pressed={following}
              aria-label={following ? "Following" : "Follow"}
              onClick={() => setFollowing(!following)}
            >
              {motion ? (
                <StateText
                  active={following}
                  activeText="Following"
                  idleText="Follow"
                />
              ) : following ? (
                "Following"
              ) : (
                "Follow"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StateText({
  active,
  activeText,
  idleText,
}: {
  active: boolean
  activeText: string
  idleText: string
}) {
  return (
    <span className={styles.stateSwap} aria-hidden="true">
      <span
        className={`${styles.stateText} ${active ? styles.stateTextActive : ""}`}
      >
        {activeText}
      </span>
      <span
        className={`${styles.stateText} ${!active ? styles.stateTextActive : ""}`}
      >
        {idleText}
      </span>
    </span>
  )
}

export function RadiusLab() {
  const [padding, setPadding] = useState(10)
  const innerRadius = 10
  const outerRadius = innerRadius + padding
  const style = {
    "--lab-padding": `${padding}px`,
    "--inner-radius": `${innerRadius}px`,
    "--outer-radius": `${outerRadius}px`,
  } as CSSProperties

  return (
    <div className={styles.radiusLab} style={style}>
      <div className={styles.radiusPreview}>
        <div>
          <span>Inner radius</span>
          <strong>{innerRadius}px</strong>
        </div>
      </div>
      <div className={styles.radiusControls}>
        <dl className={styles.formula}>
          <div>
            <dt>Inner</dt>
            <dd>{innerRadius}px</dd>
          </div>
          <div>
            <dt>Inset</dt>
            <dd>{padding}px</dd>
          </div>
          <div>
            <dt>Outer</dt>
            <dd>{outerRadius}px</dd>
          </div>
        </dl>
        <label htmlFor="surface-inset">
          Surface inset
          <output htmlFor="surface-inset">{padding}px</output>
        </label>
        <input
          id="surface-inset"
          type="range"
          min="6"
          max="18"
          value={padding}
          onChange={(event) => setPadding(Number(event.target.value))}
        />
      </div>
    </div>
  )
}
