"use client"

import { useEffect, type RefObject } from "react"

// One lazy context lets a navigation click finish as the next category mounts.
let context: AudioContext | undefined
let lastHover = -Infinity
let hoverBuffer: AudioBuffer | undefined
let mouseClickBuffer: AudioBuffer | undefined
let mouseClickLoading: Promise<void> | undefined

function preloadMouseClick() {
  mouseClickLoading ??= fetch("/inspirations/sounds/mouse-click-audley.mp3")
    .then((response) => {
      if (!response.ok) throw new Error("Mouse click audio unavailable")
      return response.arrayBuffer()
    })
    .then((data) => {
      // Decode ahead of interaction without opening an audible audio context.
      const decoder = new OfflineAudioContext(1, 1, 44100)
      return decoder.decodeAudioData(data)
    })
    .then((buffer) => {
      mouseClickBuffer = buffer
    })
    .catch(() => {
      mouseClickLoading = undefined
    })
  return mouseClickLoading
}

function createHoverBuffer(audio: AudioContext) {
  if (hoverBuffer) return hoverBuffer
  const duration = 0.025
  const buffer = audio.createBuffer(
    1,
    Math.ceil(audio.sampleRate * duration),
    audio.sampleRate
  )
  const samples = buffer.getChannelData(0)
  const filter = 1 - Math.exp((-2 * Math.PI * 1800) / audio.sampleRate)
  let seed = 137
  let body = 0
  let peak = 0

  // Keep the existing short, filtered tick for hovering between items.
  for (let index = 0; index < samples.length; index++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const noise = (seed / 0xffffffff) * 2 - 1
    const time = index / audio.sampleRate
    body += filter * (noise - body)
    const attack = Math.min(1, time / 0.0003)
    const impact = Math.exp(-time / 0.003)
    const tail = Math.max(0, 1 - time / duration)
    samples[index] = (body * 0.8 + noise * 0.2) * attack * impact * tail
    peak = Math.max(peak, Math.abs(samples[index]!))
  }
  // Consistent level across sample rates; keep headroom for rapid item changes.
  for (let index = 0; index < samples.length; index++) {
    samples[index] = samples[index]! / Math.max(peak, 0.001)
  }
  hoverBuffer = buffer
  return buffer
}

function unlockAudio() {
  if (typeof AudioContext === "undefined") return
  try {
    context ??= new AudioContext({ latencyHint: "interactive" })
    if (context.state === "suspended") void context.resume().catch(() => {})
  } catch {
    // Sound is optional; navigation must still work if audio is unavailable.
  }
}

function playSound(kind: "hover" | "click") {
  const audio = context
  if (!audio || audio.state !== "running" || document.hidden) return
  const now = audio.currentTime
  if (kind === "hover" && now - lastHover < 0.045) return
  const buffer = kind === "click" ? mouseClickBuffer : createHoverBuffer(audio)
  if (!buffer) return
  lastHover = now

  const source = audio.createBufferSource()
  const gain = audio.createGain()
  source.buffer = buffer
  gain.gain.setValueAtTime(kind === "click" ? 0.4 : 0.03, now)
  source.connect(gain)
  gain.connect(audio.destination)
  source.start(now)
  source.onended = () => {
    source.disconnect()
    gain.disconnect()
  }
}

export function useItemSounds(
  root: RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    const page = root.current
    if (!page || !enabled) return
    void preloadMouseClick()
    const itemFor = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null
      const item = target.closest("a[href], button:not(:disabled)")
      return item &&
        page.contains(item) &&
        !item.closest('[data-sound="off"], [aria-disabled="true"]')
        ? item
        : null
    }
    const unlock = (event: Event) => {
      if (event.isTrusted) unlockAudio()
    }
    const hover = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !event.isTrusted) return
      const item = itemFor(event.target)
      // Descendants of one link are still the same item, so text/icons don't retrigger it.
      if (item && item !== itemFor(event.relatedTarget)) playSound("hover")
    }
    const focus = (event: FocusEvent) => {
      const item = itemFor(event.target)
      if (item?.matches(":focus-visible")) playSound("hover")
    }
    const click = (event: MouseEvent) => {
      const item = itemFor(event.target)
      if (
        !event.isTrusted ||
        event.button !== 0 ||
        !item ||
        item.closest('[data-click-sound="off"]')
      )
        return
      unlockAudio()
      if (context?.state === "suspended") {
        void context
          .resume()
          .then(() => {
            if (page.isConnected) playSound("click")
          })
          .catch(() => {})
      } else {
        playSound("click")
      }
    }
    page.addEventListener("pointerdown", unlock, true)
    page.addEventListener("keydown", unlock, true)
    page.addEventListener("pointerover", hover)
    page.addEventListener("focusin", focus)
    page.addEventListener("click", click, true)
    return () => {
      page.removeEventListener("pointerdown", unlock, true)
      page.removeEventListener("keydown", unlock, true)
      page.removeEventListener("pointerover", hover)
      page.removeEventListener("focusin", focus)
      page.removeEventListener("click", click, true)
    }
  }, [root, enabled])
}
