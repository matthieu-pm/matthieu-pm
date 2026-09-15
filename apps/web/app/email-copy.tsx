"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import styles from "./page.module.css"

const emailAddress = "matthieu.duchatellier@gmail.com"

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

  useEffect(() => {
    if (!copied) return

    const resetTimer = window.setTimeout(() => setCopied(false), 1800)

    return () => window.clearTimeout(resetTimer)
  }, [copied])

  async function handleCopy() {
    await copyEmail()
    setCopied(true)
  }

  return (
    <span className={styles.emailTooltipRoot}>
      <button
        className={`${styles.socialLink} ${styles.emailButton}`}
        type="button"
        aria-label="Copy email address"
        aria-describedby="email-tooltip"
        onClick={handleCopy}
      >
        <Image
          className={styles.socialIcon}
          src="/logos/gmail.webp"
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
        />
        email
      </button>
      <span
        className={styles.emailTooltip}
        id="email-tooltip"
        role="tooltip"
        aria-live="polite"
      >
        {copied ? "Copied!" : emailAddress}
      </span>
    </span>
  )
}
