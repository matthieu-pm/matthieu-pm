"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowTurnBackwardIcon,
  Copy01Icon,
  Link01Icon,
  Message02Icon,
  Notification02Icon,
  PauseIcon,
  PlayIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import styles from "./showcase.module.css"

const command = "npx skills add matthieu-pm/great-ui"
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
      <div className={styles.installCaption}>
        <span>Faithful two-skill merge</span>
        <span>1,721 lines of source guidance</span>
      </div>
      <span className={styles.srOnly} role="status">
        {copied ? "Install command copied" : ""}
      </span>
    </div>
  )
}

export function InterfaceLab() {
  const [polished, setPolished] = useState(false)
  const [period, setPeriod] = useState("Day")
  const [playing, setPlaying] = useState(false)
  const [following, setFollowing] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [copied, markCopied] = useTemporaryState(1600)

  const sharedProps = {
    period,
    setPeriod,
    playing,
    setPlaying,
    following,
    setFollowing,
    notifications,
    setNotifications,
    copied,
    copy: markCopied,
  }

  return (
    <div className={styles.demo}>
      <div className={styles.preview} aria-live="polite">
        <div className={styles.previewStage}>
          <DemoCanvas polished={false} hidden={polished} {...sharedProps} />
          <DemoCanvas polished hidden={!polished} {...sharedProps} />
        </div>
      </div>
      <div className={styles.demoToolbar}>
        <div
          className={styles.toggle}
          role="group"
          aria-label="Interface state"
        >
          <button
            type="button"
            aria-pressed={!polished}
            onClick={() => setPolished(false)}
          >
            Before
          </button>
          <button
            type="button"
            aria-pressed={polished}
            onClick={() => setPolished(true)}
          >
            After
          </button>
        </div>
      </div>
    </div>
  )
}

type DemoCanvasProps = {
  polished: boolean
  hidden: boolean
  period: string
  setPeriod: (value: string) => void
  playing: boolean
  setPlaying: (value: boolean) => void
  following: boolean
  setFollowing: (value: boolean) => void
  notifications: boolean
  setNotifications: (value: boolean) => void
  copied: boolean
  copy: () => void
}

function DemoCanvas(props: DemoCanvasProps) {
  const {
    polished,
    hidden,
    period,
    setPeriod,
    playing,
    setPlaying,
    following,
    setFollowing,
    notifications,
    setNotifications,
    copied,
    copy,
  } = props

  return (
    <div
      className={`${styles.demoCanvas} ${polished ? styles.polished : styles.before} ${hidden ? "" : styles.demoCanvasActive}`}
      aria-hidden={hidden}
    >
      <div className={styles.demoLabel}>
        <span>{polished ? "Crafted system" : "Working interface"}</span>
        <span>{polished ? "Details aligned" : "Details unresolved"}</span>
      </div>
      <div className={styles.controlStack}>
        <div className={styles.profileRow}>
          <span className={styles.avatar} aria-hidden="true">
            M
          </span>
          <button
            type="button"
            className={styles.messageButton}
            tabIndex={hidden ? -1 : 0}
          >
            <HugeiconsIcon
              icon={Message02Icon}
              size={18}
              strokeWidth={polished ? 2 : 1.3}
            />
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
            tabIndex={hidden ? -1 : 0}
          >
            <HugeiconsIcon
              icon={Notification02Icon}
              size={18}
              strokeWidth={polished ? 1.7 : 1.3}
            />
            {notifications && <span className={styles.notificationDot} />}
          </button>
        </div>

        <div
          className={styles.segmented}
          role="group"
          aria-label={`${polished ? "Crafted" : "Basic"} period`}
        >
          {["Day", "Week", "Month"].map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={period === item}
              onClick={() => setPeriod(item)}
              tabIndex={hidden ? -1 : 0}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={playing ? "Pause count" : "Play count"}
            aria-pressed={playing}
            onClick={() => setPlaying(!playing)}
            tabIndex={hidden ? -1 : 0}
          >
            {polished ? (
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
          <span className={styles.metric}>{playing ? "1,251" : "1,250"}</span>
          <button
            type="button"
            className={styles.iconButton}
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy profile"}
            tabIndex={hidden ? -1 : 0}
          >
            {polished ? (
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
            onClick={() => setFollowing(!following)}
            tabIndex={hidden ? -1 : 0}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
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
