"use client"

import { useEffect, useRef } from "react"
import styles from "./page.module.css"

const cellWidth = 6
const cellHeight = 10
const tileColumns = 240
const tileWidth = tileColumns * cellWidth
const fadeHeight = 80
const glyphs = ".,:-+*ox%#@"

type Cloud = [column: number, elevation: number, radius: number, depth: number]

type CloudGlyph = {
  x: number
  y: number
  baseIndex: number
  index: number
  color: string
  opacity: number
  tintOpacity: number
  nextChange: number
}

type CloudLayer = {
  image: HTMLCanvasElement
  height: number
  update?: (time: number) => void
}

type Star = {
  x: number
  y: number
  brightness: number
  radius: number
  glow: CanvasGradient
  frequency: number
  phase: number
}

const nearClouds: Cloud[] = [
  [28, 0.28, 32, 6.2],
  [102, 0.55, 32, 6.2],
  [182, 0.36, 31, 6.8],
]

const farClouds: Cloud[] = [
  [59, 0.56, 25, 3.2],
  [130, 0.23, 28, 3.8],
]

function random(x: number, y: number, seed: number) {
  let value = Math.imul(x + seed, 374761393) ^ Math.imul(y, 668265263)
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296
}

function smooth(value: number) {
  const clamped = Math.max(0, Math.min(1, value))
  return clamped * clamped * (3 - 2 * clamped)
}

// Wrap the horizontal lattice so the moving texture repeats without a seam.
function noise(
  x: number,
  y: number,
  spanX: number,
  spanY: number,
  seed: number
) {
  const left = Math.floor(x / spanX)
  const top = Math.floor(y / spanY)
  const period = tileColumns / spanX
  const column = ((left % period) + period) % period
  const nextColumn = (column + 1) % period
  const across = smooth(x / spanX - left)
  const down = smooth(y / spanY - top)
  const a =
    random(column, top, seed) * (1 - across) +
    random(nextColumn, top, seed) * across
  const b =
    random(column, top + 1, seed) * (1 - across) +
    random(nextColumn, top + 1, seed) * across
  return a * (1 - down) + b * down
}

function paintSky(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  scale: number,
  dark: boolean
) {
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const context = canvas.getContext("2d")
  if (!context) return

  context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0)
  context.font = "9px ui-monospace, monospace"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillStyle = dark ? "#719ac2" : "#34749f"

  const columns = Math.ceil(width / cellWidth)
  const rows = Math.ceil(height / cellHeight)
  const startColumn = Math.floor((tileColumns - columns) / 2)
  const skyGlyphs = ".,:-+=o"

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = startColumn + column
      const grain = random(x, row, 67)
      const field =
        0.68 * noise(x, row + x * 0.12, 60, 8, 67) +
        0.2 * noise(x, row, 24, 4, 71) +
        0.12 * grain
      if (grain > 0.7 + 0.3 * field) continue

      const density = smooth((field - 0.2) / 0.66)
      const glyph = skyGlyphs.charAt(
        Math.round(density * (skyGlyphs.length - 1))
      )
      context.globalAlpha = 0.24 + density * 0.38
      context.fillText(
        glyph,
        (column + 0.5) * cellWidth,
        (row + 0.5) * cellHeight
      )
    }
  }
}

function createStars(
  context: CanvasRenderingContext2D,
  width: number,
  skyHeight: number
) {
  const stars: Star[] = []
  const columns = Math.ceil(width / 64)
  const bands = 3
  const bandHeight = (skyHeight * 0.72) / bands

  for (let band = 0; band < bands; band++) {
    for (let column = 0; column < columns; column++) {
      const x =
        ((column + 0.08 + 0.84 * random(column, band, 101)) / columns) * width
      const y = (band + 0.15 + 0.7 * random(column, band, 107)) * bandHeight
      const brightness = random(column, band, 113)
      const radius = (brightness > 0.82 ? 10 : 3) + brightness * 3
      const glow = context.createRadialGradient(x, y, 0, x, y, radius)
      glow.addColorStop(0, "rgb(159 213 255 / 76%)")
      glow.addColorStop(0.4, "rgb(112 185 255 / 24%)")
      glow.addColorStop(1, "rgb(112 185 255 / 0%)")
      const period = 2300 + 3600 * random(column, band, 127)
      stars.push({
        x,
        y,
        brightness,
        radius,
        glow,
        frequency: (2 * Math.PI) / period,
        phase: 2 * Math.PI * random(column, band, 131),
      })
    }
  }
  return stars
}

function paintStars(
  context: CanvasRenderingContext2D,
  stars: Star[],
  time: number
) {
  context.save()
  // Paint behind the clouds after applying gusts to the cloud layer.
  context.globalCompositeOperation = "destination-over"
  context.font = "bold 13px ui-monospace, monospace"
  context.textAlign = "center"
  context.textBaseline = "middle"

  for (const { x, y, brightness, radius, glow, frequency, phase } of stars) {
    const pulse = (1 + Math.sin(time * frequency + phase)) / 2
    const bright = brightness > 0.82

    context.globalAlpha = (0.68 + brightness * 0.32) * (0.44 + pulse * 0.56)
    context.fillStyle = bright ? "#ffffff" : "#e3f3ff"
    if (bright) {
      context.fillText("+", x, y)
    } else {
      const size = 1 + brightness * 0.8
      context.fillRect(x - size / 2, y - size / 2, size, size)
    }

    context.globalAlpha =
      (bright ? 0.85 : 0.3 + brightness * 0.25) * (0.28 + pulse * 0.72)
    context.fillStyle = glow
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }

  context.restore()
}

function cloudTile(
  height: number,
  scale: number,
  dark: boolean,
  near: boolean,
  time: number
): CloudLayer {
  const tile = document.createElement("canvas")
  const rows = Math.ceil(height / cellHeight)
  const tileHeight = rows * cellHeight
  // Keep cell boundaries on whole backing pixels when replacing glyphs.
  const tileScale = Math.ceil(scale)
  tile.width = tileWidth * tileScale
  tile.height = tileHeight * tileScale
  const context = tile.getContext("2d")
  if (!context) return { image: tile, height: tileHeight }

  context.scale(tileScale, tileScale)
  context.font = "9px ui-monospace, monospace"
  context.textAlign = "center"
  context.textBaseline = "middle"

  const clouds = near ? nearClouds : farClouds
  const seed = near ? 17 : 43
  const skyRows = (height - fadeHeight) / cellHeight
  const verticalScale = Math.max(0.68, Math.min(1.1, skyRows / 30))
  const tint = dark ? "#a1c6e9" : "#ffffff"
  const light = dark ? "#cae4fb" : "#ffffff"
  const shade = dark ? "#7ca5cd" : "#edf8ff"
  const animatedGlyphs: CloudGlyph[] = []

  const paintGlyph = (
    index: number,
    x: number,
    y: number,
    color: string,
    opacity: number
  ) => {
    context.fillStyle = color
    context.globalAlpha = opacity
    context.fillText(
      glyphs.charAt(index),
      x + cellWidth / 2,
      y + cellHeight / 2
    )
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < tileColumns; column++) {
      let shape = 0
      let underside = 0
      for (const [origin, elevation, radius, depth] of clouds) {
        const offset = (column - origin + tileColumns * 1.5) % tileColumns
        const x = (offset - tileColumns / 2) / radius
        const y = (row - elevation * skyRows) / (depth * verticalScale)
        // Overlapping lobes give the bank a rounded top and a long underside.
        const mass = Math.max(
          1 - (x / 1.08) ** 2 - ((y - 0.31) / 0.53) ** 2,
          1 - ((x + 0.46) / 0.55) ** 2 - ((y + 0.02) / 0.57) ** 2,
          1 - ((x + 0.03) / 0.57) ** 2 - ((y + 0.28) / 0.83) ** 2,
          1 - ((x - 0.42) / 0.49) ** 2 - ((y + 0.02) / 0.61) ** 2
        )
        if (mass <= shape) continue
        shape = mass
        underside = y
      }
      if (shape === 0) continue

      const texture =
        0.65 * noise(column, row, 12, 4, seed) +
        0.35 * noise(column, row, 3, 2, seed + 1)
      const density = smooth((shape + (texture - 0.63) * 0.46) / 0.8)
      const grain = random(column, row, seed + 4)
      if (density < 0.035) continue

      const x = column * cellWidth
      const y = row * cellHeight
      const tintOpacity = density * (near ? 0.3 : 0.15)
      context.fillStyle = tint
      context.globalAlpha = tintOpacity
      context.fillRect(x, y, cellWidth, cellHeight)
      if (density < grain * 0.26) continue

      const detail = density * (0.55 + 0.45 * texture)
      const index = Math.floor(detail * (glyphs.length - 1))
      const color = underside > 0.24 + texture * 0.28 ? shade : light
      const opacity = (0.28 + 0.72 * density) * (near ? 1 : 0.7)
      paintGlyph(index, x, y, color, opacity)

      if (density > 0.22 && random(column, row, seed + 9) < 0.25) {
        animatedGlyphs.push({
          x,
          y,
          baseIndex: index,
          index,
          color,
          opacity,
          tintOpacity,
          nextChange: time + 240 + Math.random() * 1700,
        })
      }
    }
  }

  const update = (time: number) => {
    for (const cell of animatedGlyphs) {
      if (time < cell.nextChange) continue

      const first = Math.max(0, cell.baseIndex - 2)
      const last = Math.min(glyphs.length - 1, cell.baseIndex + 2)
      const candidate = first + Math.floor(Math.random() * (last - first))
      // Skip the current glyph while keeping the replacements near its density.
      cell.index = candidate >= cell.index ? candidate + 1 : candidate
      cell.nextChange = time + 650 + Math.random() * 1500

      context.clearRect(cell.x, cell.y, cellWidth, cellHeight)
      context.fillStyle = tint
      context.globalAlpha = cell.tintOpacity
      context.fillRect(cell.x, cell.y, cellWidth, cellHeight)
      paintGlyph(cell.index, cell.x, cell.y, cell.color, cell.opacity)
    }
  }

  return { image: tile, height: tileHeight, update }
}

type Gust = { x: number; y: number; start: number; burst: boolean }

export function HeroSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const skyCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const skyCanvas = skyCanvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const root = document.documentElement
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const gusts: Gust[] = []
    let width = 0
    let height = 0
    let dark = false
    let far: CloudLayer
    let near: CloudLayer
    let stars: Star[] = []
    let visible = true
    let frame = 0
    let previousFrame: number | undefined
    let time = 0

    const paint = () => {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)

      const drawTile = (tile: CloudLayer, offset: number) => {
        tile.update?.(time)
        const start = -(((offset % tileWidth) + tileWidth) % tileWidth)
        for (let x = start; x < width; x += tileWidth) {
          ctx.drawImage(tile.image, x, 0, tileWidth, tile.height)
        }
      }

      const center = (tileWidth - width) * 0.5
      drawTile(far, center - time * 0.0016)
      drawTile(near, center - 170 - time * 0.0055)

      ctx.globalCompositeOperation = "destination-out"
      for (let i = gusts.length - 1; i >= 0; i--) {
        const gust = gusts[i]!
        const progress = (time - gust.start) / (gust.burst ? 1200 : 680)
        if (progress >= 1) {
          gusts.splice(i, 1)
          continue
        }

        const radius = gust.burst ? 28 + 102 * progress : 24 + 27 * progress
        const x = gust.x + progress * (gust.burst ? 12 : 21)
        const y = gust.y - 13 * progress
        const clear = ctx.createRadialGradient(x, y, 0, x, y, radius)
        clear.addColorStop(
          0,
          `rgb(0 0 0 / ${(1 - progress) * (gust.burst ? 0.94 : 0.6)})`
        )
        clear.addColorStop(1, "transparent")
        ctx.fillStyle = clear
        ctx.fillRect(x - radius, y - radius, 2 * radius, 2 * radius)
      }
      ctx.globalCompositeOperation = "source-over"
      if (stars.length) paintStars(ctx, stars, time)
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      if (!width || !height) return

      const scale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * scale)
      canvas.height = Math.round(height * scale)
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0)
      dark = root.classList.contains("dark")
      if (skyCanvas) paintSky(skyCanvas, width, height, scale, dark)
      stars = dark ? createStars(ctx, width, height - fadeHeight) : []
      far = cloudTile(height, scale, dark, false, time)
      near = cloudTile(height, scale, dark, true, time)
      paint()
    }

    function animate(timestamp: number) {
      if (
        previousFrame === undefined ||
        timestamp - previousFrame >= 1000 / 24
      ) {
        time += Math.min(70, timestamp - (previousFrame ?? timestamp))
        previousFrame = timestamp
        paint()
      }
      frame = requestAnimationFrame(animate)
    }

    function syncAnimation() {
      cancelAnimationFrame(frame)
      previousFrame = undefined
      if (motion.matches || !visible || document.hidden) {
        gusts.length = 0
        if (visible && !document.hidden) paint()
        return
      }
      frame = requestAnimationFrame(animate)
    }

    const addGust = (event: PointerEvent, burst: boolean) => {
      if (motion.matches || !visible || document.hidden) return
      const bounds = canvas.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      if (x < 0 || y < 0 || x > width || y > height - fadeHeight) return

      const previous = gusts.at(-1)
      if (!burst && previous && Math.hypot(x - previous.x, y - previous.y) < 19)
        return
      if (gusts.length >= 18) gusts.shift()
      gusts.push({ x, y, start: time, burst })
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "touch") addGust(event, false)
    }

    function press(event: PointerEvent) {
      if (event.button !== 0) return
      if (
        event.target instanceof Element &&
        event.target.closest(
          "a, button, input, textarea, select, label, [role]"
        )
      )
        return
      addGust(event, true)
    }

    const sizing = new ResizeObserver(resize)
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      syncAnimation()
    })
    const theme = new MutationObserver(() => {
      if (dark !== root.classList.contains("dark")) resize()
    })

    sizing.observe(canvas)
    intersection.observe(canvas)
    theme.observe(root, { attributes: true, attributeFilter: ["class"] })
    motion.addEventListener("change", syncAnimation)
    document.addEventListener("visibilitychange", syncAnimation)
    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerdown", press, { passive: true })
    resize()
    syncAnimation()

    return () => {
      cancelAnimationFrame(frame)
      sizing.disconnect()
      intersection.disconnect()
      theme.disconnect()
      motion.removeEventListener("change", syncAnimation)
      document.removeEventListener("visibilitychange", syncAnimation)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerdown", press)
    }
  }, [])

  return (
    <div className={styles.heroSky} aria-hidden="true">
      <canvas ref={skyCanvasRef} />
      <canvas ref={canvasRef} />
    </div>
  )
}
