"use client"

import { useEffect, useId, useRef, useState } from "react"
import { createGlassTriangle } from "./glass-triangle/renderer"
import styles from "./glass-triangle/glass-triangle.module.css"

export function InspirationsOrb({
  size = 96,
  className,
  interactive = true,
}: {
  size?: number
  className?: string
  interactive?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const gradient = useId()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let dispose: (() => void) | null = null
    const start = () => {
      dispose?.()
      try {
        dispose = createGlassTriangle(canvas)
        setReady(Boolean(dispose))
      } catch {
        setReady(false)
      }
    }
    const lost = (event: Event) => {
      event.preventDefault()
      setReady(false)
    }
    start()
    canvas.addEventListener("webglcontextlost", lost)
    canvas.addEventListener("webglcontextrestored", start)
    return () => {
      dispose?.()
      canvas.removeEventListener("webglcontextlost", lost)
      canvas.removeEventListener("webglcontextrestored", start)
    }
  }, [])

  return (
    <span
      className={`${styles.triangle} ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        pointerEvents: interactive ? undefined : "none",
      }}
      data-ready={ready}
    >
      <svg className={styles.fallback} viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id={gradient} x2="1" y2="1">
            <stop stopColor="#eef5fc" />
            <stop offset=".45" stopColor="#8393a4" />
            <stop offset=".75" stopColor="#f4f7fb" />
            <stop offset="1" stopColor="#93a6bd" />
          </linearGradient>
        </defs>
        <path d="M47 10 88 76 17 81Z" fill={`url(#${gradient})`} />
        <path
          d="M47 10 52 19 88 76M52 19 25 76 17 81M25 76 88 76"
          fill="none"
          stroke="#b8c4d2"
          strokeWidth=".7"
        />
      </svg>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        tabIndex={interactive && size > 24 ? 0 : -1}
        role="img"
        aria-label={
          interactive
            ? "Glass triangular prism. Drag to rotate in any direction. Arrow keys rotate; Shift and arrows roll; Home resets."
            : "Glass triangular prism"
        }
      />
    </span>
  )
}
