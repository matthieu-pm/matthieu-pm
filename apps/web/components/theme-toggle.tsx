"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"

import { useThemeChange } from "./theme-provider"
import styles from "./theme-toggle.module.css"

export function ThemeToggle() {
  const { toggleTheme } = useThemeChange()

  return (
    <button
      className={styles.toggle}
      data-theme-toggle
      type="button"
      onClick={toggleTheme}
    >
      <span className={styles.sun} aria-hidden="true">
        <HugeiconsIcon icon={Sun03Icon} size={19} strokeWidth={1.7} />
      </span>
      <span className={styles.moon} aria-hidden="true">
        <HugeiconsIcon icon={Moon02Icon} size={19} strokeWidth={1.7} />
      </span>
      <span className={styles.labelLight}>Switch to dark mode</span>
      <span className={styles.labelDark}>Switch to light mode</span>
    </button>
  )
}
