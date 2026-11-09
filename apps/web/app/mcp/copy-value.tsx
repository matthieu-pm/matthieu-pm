"use client"

import { useState } from "react"
import styles from "./mcp.module.css"

export function CopyValue({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState("")

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setStatus("Copied")
    } catch {
      setStatus("Select and copy the text manually.")
    }
  }

  return (
    <div>
      <div className={styles.copyField}>
        <code>{value}</code>
        <button
          type="button"
          onClick={copy}
          aria-label={status === "Copied" ? `${label} copied` : `Copy ${label}`}
        >
          {status === "Copied" ? "Copied" : "Copy"}
        </button>
      </div>
      <span className={styles.srOnly} role="status">
        {status}
      </span>
    </div>
  )
}
