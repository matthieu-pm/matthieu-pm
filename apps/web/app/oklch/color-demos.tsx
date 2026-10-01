"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { linearRgb, maximumChroma, rgbByte } from "./color-math"

const hues = [30, 150, 250, 320]
export function BrightnessDemo() {
  const [lightness, setLightness] = useState(50)
  return (
    <div className="oklch-brightness shadow-custom">
      <div className="oklch-brightness-swatches">
        {(["oklch", "hsl"] as const).flatMap((model) =>
          hues.map((hue) => (
            <div
              className="oklch-color-pill shadow-custom"
              key={`${model}-${hue}`}
            >
              <div
                style={{
                  background:
                    model === "oklch"
                      ? `oklch(${lightness / 100} 0.16 ${hue})`
                      : `hsl(${hue} 100% ${lightness}%)`,
                }}
              >
                {model}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="oklch-color-values">
        <div>
          {hues.map((hue) => (
            <div key={hue}>
              oklch({(lightness / 100).toFixed(2)} 0.16 {hue})
            </div>
          ))}
        </div>
        <div>
          {hues.map((hue) => (
            <div key={hue}>
              hsl({hue} 100% {lightness}%)
            </div>
          ))}
        </div>
      </div>
      <div className="oklch-brightness-control">
        <label htmlFor="oklch-brightness">
          Lightness <output>{lightness}%</output>
        </label>
        <input
          id="oklch-brightness"
          type="range"
          min="0"
          max="100"
          step="1"
          value={lightness}
          style={{ "--progress": `${lightness}%` } as CSSProperties}
          onChange={(event) => setLightness(Number(event.target.value))}
        />
      </div>
    </div>
  )
}

export function ChromaDemo() {
  const [lightness, setLightness] = useState(65)
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const target = canvas.current
    if (!target) return
    const draw = () => {
      const context = target.getContext("2d")
      if (!context) return
      const width = target.clientWidth,
        height = target.clientHeight
      const scale = window.devicePixelRatio || 1
      target.width = Math.round(width * scale)
      target.height = Math.round(height * scale)
      context.setTransform(
        (width / 1000) * scale,
        0,
        0,
        (height / 500) * scale,
        0,
        0
      )
      const field = document.createElement("canvas")
      field.width = 51
      field.height = 51
      const pixels = new Uint8ClampedArray(51 * 51 * 4)
      for (let y = 0; y < 51; y++)
        for (let x = 0; x < 51; x++) {
          const rgb = linearRgb(
            lightness / 100,
            (1 - y / 50) * 0.4,
            (x / 50) * 360
          )
          const index = (y * 51 + x) * 4
          pixels[index] = rgbByte(rgb[0])
          pixels[index + 1] = rgbByte(rgb[1])
          pixels[index + 2] = rgbByte(rgb[2])
          pixels[index + 3] = 255
        }
      field.getContext("2d")?.putImageData(new ImageData(pixels, 51, 51), 0, 0)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = "high"
      context.drawImage(
        field,
        2 - 996 / 100,
        2 - 496 / 100,
        996 * 1.02,
        496 * 1.02
      )
    }
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(target)
    return () => observer.disconnect()
  }, [lightness])
  function outline(gamut: "srgb" | "p3") {
    return Array.from(
      { length: 101 },
      (_, i) =>
        `${i === 0 ? "M" : "L"} ${(2 + (i / 100) * 996).toFixed(2)} ${(2 + (1 - maximumChroma(lightness / 100, (i / 100) * 360, gamut) / 0.4) * 496).toFixed(2)}`
    ).join(" ")
  }
  return (
    <div className="oklch-chroma shadow-custom">
      <div
        className="oklch-chroma-chart outline-subtle"
        role="img"
        aria-label={`Chroma by hue at ${lightness}% lightness. Solid: sRGB. Dashed: Display P3.`}
      >
        <canvas ref={canvas} />
        <svg
          viewBox="0 0 1000 500"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          {(["p3", "srgb"] as const).map((gamut) => (
            <path
              key={gamut}
              d={outline(gamut)}
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray={gamut === "p3" ? "6 4" : undefined}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="oklch-chroma-control">
        <div className="oklch-chroma-track shadow-custom">
          <input
            type="range"
            aria-label="Chroma chart lightness"
            min="0"
            max="100"
            step="1"
            value={lightness}
            onChange={(event) => setLightness(Number(event.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
