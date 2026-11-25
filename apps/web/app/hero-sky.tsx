"use client"

import { useThemePreference } from "@/components/theme-provider"
import { AsciiSky } from "@/lib/vendor/ascii-sky/react.js"
import styles from "./page.module.css"

export function HeroSky() {
  const preference = useThemePreference()
  const theme =
    preference === "light" || preference === "dark" ? preference : "auto"

  return (
    <div className={styles.heroSky}>
      <AsciiSky theme={theme} faintFrom={400} />
    </div>
  )
}
