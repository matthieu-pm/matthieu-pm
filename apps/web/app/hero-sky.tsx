"use client"

import { useSyncExternalStore } from "react"
import { useThemePreference } from "@/components/theme-provider"
import { AsciiSky } from "@/lib/vendor/ascii-sky/react.js"
import styles from "./page.module.css"

const sunsetStart = 16
const sunsetEnd = 20

function isSunsetHour(hour: number) {
  return hour >= sunsetStart && hour < sunsetEnd
}

function subscribeToSunset(onChange: () => void) {
  let timer: number

  function schedule() {
    const now = new Date()
    const hour = now.getHours()
    const next = new Date(now)
    if (hour >= sunsetEnd) next.setDate(next.getDate() + 1)
    next.setHours(isSunsetHour(hour) ? sunsetEnd : sunsetStart, 0, 0, 0)
    timer = window.setTimeout(refresh, next.getTime() - now.getTime())
  }

  function refresh() {
    window.clearTimeout(timer)
    onChange()
    schedule()
  }

  schedule()
  window.addEventListener("focus", refresh)
  document.addEventListener("visibilitychange", refresh)
  return () => {
    window.clearTimeout(timer)
    window.removeEventListener("focus", refresh)
    document.removeEventListener("visibilitychange", refresh)
  }
}

const readSunset = () => isSunsetHour(new Date().getHours())
const readServerSunset = () => false

export function HeroSky() {
  const preference = useThemePreference()
  const sunset = useSyncExternalStore(
    subscribeToSunset,
    readSunset,
    readServerSunset
  )
  const theme =
    preference === "light" || preference === "dark" ? preference : "auto"

  return (
    <div className={styles.heroSky}>
      <AsciiSky theme={sunset ? "sunset" : theme} faintFrom={400} />
    </div>
  )
}
