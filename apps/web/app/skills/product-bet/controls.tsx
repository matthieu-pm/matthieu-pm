"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Tick02Icon,
  GithubIcon,
  ArrowTurnBackwardIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import styles from "./showcase.module.css"

const command = "npx skills add matthieu-pm/product-bet"

export function HeaderControls({ pageUrl }: { pageUrl: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  async function copyLink() {
    if (timer.current) clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(pageUrl)
      setStatus("copied")
      timer.current = setTimeout(() => setStatus("idle"), 2500)
    } catch {
      setStatus("error")
    }
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
        <span
          className={`${styles.headerTooltip} ${styles.headerTooltipStart}`}
          aria-hidden="true"
        >
          Return to home
        </span>
      </Link>
      <button
        type="button"
        className={styles.headerButton}
        onClick={copyLink}
        aria-label="Copy page link"
      >
        <HugeiconsIcon
          icon={status === "copied" ? Tick02Icon : Link01Icon}
          size={20}
          strokeWidth={1.7}
          aria-hidden="true"
        />
        <span
          className={`${styles.headerTooltip} ${styles.headerTooltipEnd}`}
          aria-hidden="true"
        >
          {status === "copied" ? "Link copied" : "Copy page link"}
        </span>
      </button>
      <span className={styles.headerStatus} role="status">
        {status === "copied" ? (
          "Link copied"
        ) : status === "error" ? (
          <>
            Couldn’t copy. <a href={pageUrl}>Select and copy this link.</a>
          </>
        ) : (
          ""
        )}
      </span>
    </nav>
  )
}

export function InstallCommand() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  async function copy() {
    if (timer.current) clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(command)
      setStatus("copied")
      timer.current = setTimeout(() => setStatus("idle"), 2500)
    } catch {
      setStatus("error")
    }
  }

  return (
    <div>
      <div className={styles.install}>
        <div className={styles.commandRow}>
          <code>
            <span>npx</span> skills add matthieu-pm/product-bet
          </code>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy install command"
          >
            <HugeiconsIcon
              icon={status === "copied" ? Tick02Icon : Copy01Icon}
              size={18}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>
        </div>
        <nav className={styles.installLinks} aria-label="Install resources">
          <a
            href="https://skills.sh/matthieu-pm/product-bet"
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
            href="https://github.com/matthieu-pm/product-bet"
            target="_blank"
            rel="noreferrer"
          >
            <HugeiconsIcon icon={GithubIcon} size={18} aria-hidden="true" />
            GitHub
          </a>
        </nav>
      </div>
      <span className={styles.copyStatus} role="status">
        {status === "error"
          ? "Couldn’t copy. Select the command to copy it manually."
          : status === "copied"
            ? "Install command copied."
            : ""}
      </span>
    </div>
  )
}

export function BetDemo({
  raw,
  shaped,
}: {
  raw: ReactNode
  shaped: ReactNode
}) {
  const [isShaped, setIsShaped] = useState(false)

  return (
    <div className={styles.demo}>
      <div id="bet-preview" className={styles.preview} aria-live="polite">
        <div key={String(isShaped)} className={styles.previewContent}>
          {isShaped ? shaped : raw}
        </div>
      </div>
      <div className={styles.demoToolbar}>
        <div className={styles.toggle} role="group" aria-label="Example view">
          <button
            type="button"
            aria-pressed={!isShaped}
            aria-controls="bet-preview"
            onClick={() => setIsShaped(false)}
          >
            Before
          </button>
          <button
            type="button"
            aria-pressed={isShaped}
            aria-controls="bet-preview"
            onClick={() => setIsShaped(true)}
          >
            After
          </button>
        </div>
      </div>
      <div className={styles.demoCaption}>Illustrative example · No research supplied</div>
    </div>
  )
}
