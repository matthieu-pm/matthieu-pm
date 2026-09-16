"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowTurnBackwardIcon,
  Link01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import styles from "./article.module.css"

export function ArticleControls({ pageUrl }: { pageUrl: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <nav className={styles.headerControls} aria-label="Article actions">
      <Link href="/" className={styles.headerButton} aria-label="Return home">
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
        aria-label={copied ? "Article link copied" : "Copy article link"}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Link01Icon}
          size={20}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </button>
      <span className={styles.srOnly} role="status">
        {copied ? "Article link copied" : ""}
      </span>
    </nav>
  )
}
