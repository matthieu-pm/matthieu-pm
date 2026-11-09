"use client"

import { useEffect, useRef, useState } from "react"

import styles from "./page.module.css"

const emailAddress = "mattduchatellier@gmail.com"

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(emailAddress)
  } catch {
    const input = document.createElement("textarea")
    input.value = emailAddress
    input.style.position = "fixed"
    input.style.opacity = "0"
    document.body.append(input)
    input.select()
    document.execCommand("copy")
    input.remove()
  }
}

export function EmailCopy() {
  const [copied, setCopied] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const hideTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current)
    }
  }, [])

  async function handleCopy() {
    await copyEmail()

    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current)

    setCopied(true)
    setTooltipVisible(true)
    hideTimer.current = window.setTimeout(() => {
      setCopied(false)
      setTooltipVisible(false)
    }, 1800)
  }

  return (
    <span
      className={styles.emailTooltipRoot}
      onPointerEnter={() => setTooltipVisible(true)}
      onPointerLeave={() => setTooltipVisible(false)}
    >
      <button
        className={`${styles.socialLink} ${styles.emailButton}`}
        type="button"
        aria-label="Copy email address"
        aria-describedby="email-tooltip"
        onBlur={() => setTooltipVisible(false)}
        onClick={handleCopy}
        onFocus={() => setTooltipVisible(true)}
      >
        email
      </button>
      <span
        className={`${styles.emailTooltip} ${tooltipVisible ? styles.emailTooltipVisible : ""}`}
        id="email-tooltip"
        role="tooltip"
        aria-live="polite"
      >
        {copied ? "Copied!" : emailAddress}
      </span>
    </span>
  )
}
