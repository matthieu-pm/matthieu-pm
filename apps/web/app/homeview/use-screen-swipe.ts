"use client"

import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react"

const PAGE_WIDTH = 130
const LAST_PAGE = 2
const clamp = (value: number) => Math.max(0, Math.min(LAST_PAGE, value))

type Gesture = {
  pointerId: number
  element: HTMLDivElement
  clientX: number
  clientY: number
  localX: number
  lastX: number
  lastTime: number
  velocity: number
  anchor: number
  base: number
  progress: number
  dragging: boolean
}

export function useScreenSwipe(index: number, select: (index: number) => void) {
  const figureRef = useRef<HTMLElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const suppressClickUntil = useRef(0)

  function localX(event: PointerEvent<HTMLDivElement>) {
    const matrix = planeRef.current?.getScreenCTM()
    return matrix
      ? new DOMPoint(event.clientX, event.clientY).matrixTransform(
          matrix.inverse()
        ).x
      : event.clientX
  }

  function currentProgress() {
    const transform = trackRef.current
      ? getComputedStyle(trackRef.current).getPropertyValue("transform")
      : "none"
    return -new DOMMatrix(transform).m41 / PAGE_WIDTH
  }

  function finish(commit: boolean) {
    const drag = gesture.current
    if (!drag) return
    gesture.current = null
    if (drag.dragging) {
      suppressClickUntil.current = performance.now() + 400
      const displacement = drag.progress - drag.anchor
      const flick =
        performance.now() - drag.lastTime < 100 &&
        Math.abs(drag.velocity) > 0.35 &&
        Math.abs(displacement) > 0.06
      let next = index
      if (commit && (Math.abs(displacement) > 0.22 || flick)) {
        next = Math.round(clamp(drag.progress))
        if (next === drag.base)
          next = clamp(drag.base + Math.sign(displacement))
      }
      // Restore the CSS transition before settling from the live drag position.
      figureRef.current?.removeAttribute("data-dragging")
      figureRef.current?.setAttribute("data-instant-scene", "false")
      if (trackRef.current)
        getComputedStyle(trackRef.current).getPropertyValue("transform")
      figureRef.current?.style.setProperty("--scene-index", String(next))
      select(next)
    }
    if (drag.element.hasPointerCapture(drag.pointerId))
      drag.element.releasePointerCapture(drag.pointerId)
  }

  useEffect(() => {
    const cancel = () => finish(false)
    window.addEventListener("blur", cancel)
    return () => window.removeEventListener("blur", cancel)
  })

  return {
    figureRef,
    planeRef,
    trackRef,
    handlers: {
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        if (!event.isPrimary || event.button !== 0 || gesture.current) return
        suppressClickUntil.current = 0
        const x = localX(event)
        const progress = currentProgress()
        gesture.current = {
          pointerId: event.pointerId,
          element: event.currentTarget,
          clientX: event.clientX,
          clientY: event.clientY,
          localX: x,
          lastX: x,
          lastTime: performance.now(),
          velocity: 0,
          anchor: progress,
          base: Math.round(clamp(progress)),
          progress,
          dragging: false,
        }
      },
      onPointerMove(event: PointerEvent<HTMLDivElement>) {
        const drag = gesture.current
        if (!drag || drag.pointerId !== event.pointerId) return
        const dx = event.clientX - drag.clientX
        const dy = event.clientY - drag.clientY
        const x = localX(event)
        const now = performance.now()
        if (!drag.dragging) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return
          if (Math.abs(dy) > Math.abs(dx)) {
            gesture.current = null
            return
          }
          drag.dragging = true
          drag.anchor = currentProgress()
          drag.base = Math.round(clamp(drag.anchor))
          drag.localX = x
          drag.lastX = x
          drag.lastTime = now
          event.currentTarget.setPointerCapture(event.pointerId)
          figureRef.current?.setAttribute("data-dragging", "true")
          figureRef.current?.setAttribute("data-instant-scene", "false")
        }
        event.preventDefault()
        const elapsed = now - drag.lastTime
        if (elapsed > 0) drag.velocity = (x - drag.lastX) / elapsed
        drag.lastX = x
        drag.lastTime = now
        let progress = drag.anchor - (x - drag.localX) / PAGE_WIDTH
        // A little resistance at the first and last screen; never wrap around.
        if (progress < 0) progress = -Math.min(0.12, -progress * 0.22)
        if (progress > LAST_PAGE)
          progress = LAST_PAGE + Math.min(0.12, (progress - LAST_PAGE) * 0.22)
        drag.progress = progress
        figureRef.current?.style.setProperty("--scene-index", String(progress))
      },
      onPointerUp(event: PointerEvent<HTMLDivElement>) {
        if (gesture.current?.pointerId === event.pointerId) finish(true)
      },
      onPointerCancel(event: PointerEvent<HTMLDivElement>) {
        if (gesture.current?.pointerId === event.pointerId) finish(false)
      },
      onLostPointerCapture(event: PointerEvent<HTMLDivElement>) {
        // Touch starts with implicit capture on the child that was pressed.
        // Transferring it to the screen also bubbles a loss event from that child.
        if (
          gesture.current?.pointerId === event.pointerId &&
          event.target === event.currentTarget &&
          !event.currentTarget.hasPointerCapture(event.pointerId)
        )
          finish(false)
      },
      onClickCapture(event: MouseEvent<HTMLDivElement>) {
        if (
          event.detail !== 0 &&
          performance.now() < suppressClickUntil.current
        ) {
          event.preventDefault()
          event.stopPropagation()
        }
      },
    },
  }
}
