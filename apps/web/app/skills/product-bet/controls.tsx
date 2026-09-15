"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import styles from "./showcase.module.css"

const command = "npx skills add matthieu-pm/product-bet"

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
        <code>{command}</code>
        <button type="button" onClick={copy} aria-label="Copy install command">
          {status === "copied" ? "Copied" : "Copy"}
        </button>
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
      <div className={styles.demoToolbar}>
        <span className={styles.eyebrow}>Illustrative example</span>
        <div className={styles.toggle} role="group" aria-label="Example view">
          <button
            type="button"
            aria-pressed={!isShaped}
            aria-controls="bet-preview"
            onClick={() => setIsShaped(false)}
          >
            Raw idea
          </button>
          <button
            type="button"
            aria-pressed={isShaped}
            aria-controls="bet-preview"
            onClick={() => setIsShaped(true)}
          >
            Shaped bet
          </button>
        </div>
      </div>
      <div id="bet-preview" className={styles.preview} aria-live="polite">
        <div key={String(isShaped)} className={styles.previewContent}>
          {isShaped ? shaped : raw}
        </div>
      </div>
      <div className={styles.demoCaption}>Same idea. A clearer decision.</div>
    </div>
  )
}
