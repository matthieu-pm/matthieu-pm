"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState, type ComponentProps } from "react"
import { createPortal } from "react-dom"
import styles from "./project-video-link.module.css"

type Preview = { left: number; top: number; reducedMotion: boolean }

export function ProjectVideoLink({
  videoSrc,
  children,
  ...props
}: ComponentProps<typeof Link> & { videoSrc: string }) {
  const id = useId()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)

  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const close = () => {
    keepOpen()
    setPreview(null)
  }
  const closeSoon = () => {
    keepOpen()
    closeTimer.current = setTimeout(() => setPreview(null), 150)
  }
  const open = (link: HTMLAnchorElement) => {
    keepOpen()
    const rect = link.getBoundingClientRect()
    const width = Math.min(300, window.innerWidth - 32)
    const height = ((width - 12) * 9) / 16 + 12
    const fitsRight = rect.right + 12 + width <= window.innerWidth - 16
    const fitsLeft = rect.left - 12 - width >= 16
    const beside = fitsRight || fitsLeft
    const left = fitsRight
      ? rect.right + 12
      : fitsLeft
        ? rect.left - width - 12
        : Math.max(
            16,
            Math.min(rect.right - width, window.innerWidth - width - 16)
          )
    const top = beside
      ? rect.top + (rect.height - height) / 2
      : rect.top >= height + 28
        ? rect.top - height - 12
        : rect.bottom + 12
    setPreview({
      left,
      top: Math.max(16, Math.min(top, window.innerHeight - height - 16)),
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
    })
  }

  const isOpen = preview !== null
  useEffect(() => {
    if (!isOpen) return
    const dismiss = () => setPreview(null)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    window.addEventListener("scroll", dismiss, true)
    window.addEventListener("resize", dismiss)
    window.addEventListener("keydown", onKeyDown)
    document.addEventListener("visibilitychange", dismiss)
    return () => {
      window.removeEventListener("scroll", dismiss, true)
      window.removeEventListener("resize", dismiss)
      window.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("visibilitychange", dismiss)
    }
  }, [isOpen])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    []
  )

  return (
    <>
      <Link
        {...props}
        aria-describedby={isOpen ? id : undefined}
        onPointerEnter={(event) => {
          if (
            event.pointerType !== "touch" &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches
          )
            open(event.currentTarget)
        }}
        onPointerLeave={closeSoon}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible"))
            open(event.currentTarget)
        }}
        onBlur={close}
        onClick={close}
      >
        {children}
      </Link>
      {preview &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            aria-label="Carbon product preview"
            className={styles.preview}
            style={{ left: preview.left, top: preview.top }}
            onPointerEnter={keepOpen}
            onPointerLeave={closeSoon}
          >
            <video
              className={styles.video}
              src={videoSrc}
              aria-label="Carbon product demo"
              autoPlay={!preview.reducedMotion}
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              onError={close}
            />
          </div>,
          document.body
        )}
    </>
  )
}
