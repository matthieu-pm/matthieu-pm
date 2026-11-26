"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { presets, type DitherOptions } from "../lib/dither"

const endpoint = "https://dither.matthieu.pm/mcp"
const config = JSON.stringify(
  { mcpServers: { dither: { url: endpoint } } },
  null,
  2
)
const controls: {
  key: keyof DitherOptions
  title: string
  min: number
  max: number
  step: number
  description: string
}[] = [
  {
    key: "pixel_size",
    title: "Pixel size",
    min: 1,
    max: 16,
    step: 1,
    description: "The size of each little square.",
  },
  {
    key: "color_levels",
    title: "Color levels",
    min: 2,
    max: 16,
    step: 1,
    description: "Fewer colors, more character.",
  },
  {
    key: "strength",
    title: "Strength",
    min: 0,
    max: 1,
    step: 0.05,
    description: "Blend the pattern into your image.",
  },
  {
    key: "grain",
    title: "Color grain",
    min: 0,
    max: 0.2,
    step: 0.005,
    description: "A little chromatic imperfection.",
  },
]

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={down ? "M8 2v9m-4-4 4 4 4-4M3 13h10" : "M3 8h10M9 4l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Studio() {
  const [options, setOptions] = useState<DitherOptions>({ ...presets.classic })
  const [preset, setPreset] = useState<string>("classic")
  const [filename, setFilename] = useState("earth-image.jpg")
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [maxWidth, setMaxWidth] = useState(2048)
  const [compare, setCompare] = useState(false)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const [copyState, setCopyState] = useState("")
  const [upload, setUpload] = useState<File | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const worker = useRef<Worker | null>(null)
  const source = useRef<ImageData | null>(null)
  const rendered = useRef<ImageData | null>(null)
  const renderId = useRef(0)
  const loadingId = useRef(0)
  const compareRef = useRef(false)

  const paint = useCallback((image: ImageData) => {
    const element = canvas.current
    if (!element) return
    if (element.width !== image.width || element.height !== image.height) {
      element.width = image.width
      element.height = image.height
    }
    element.getContext("2d")?.putImageData(image, 0, 0)
  }, [])

  useEffect(() => {
    const renderer = new Worker(
      new URL("./dither.worker.ts", import.meta.url),
      { type: "module" }
    )
    worker.current = renderer
    renderer.onmessage = (
      event: MessageEvent<{
        pixels: Uint8ClampedArray<ArrayBuffer>
        width: number
        height: number
        id: number
        error?: string
      }>
    ) => {
      if (event.data.id !== renderId.current) return
      if (event.data.error) {
        setError(event.data.error)
        setBusy(false)
        return
      }
      const image = new ImageData(
        event.data.pixels,
        event.data.width,
        event.data.height
      )
      rendered.current = image
      if (!compareRef.current) paint(image)
      setBusy(false)
    }
    renderer.onerror = () => {
      setError("The renderer could not start. Reload the page to try again.")
      setBusy(false)
    }
    return () => {
      renderer.terminate()
      worker.current = null
    }
  }, [paint])

  useEffect(() => {
    let cancelled = false
    const id = ++loadingId.current
    // Invalidate any render from the previous source before decoding a new one.
    ++renderId.current
    setBusy(true)
    setError("")
    const controller = new AbortController()
    async function load() {
      let bitmap: ImageBitmap | undefined
      try {
        const blob =
          upload ??
          (await fetch("/earth.jpg", { signal: controller.signal }).then(
            (response) => {
              if (!response.ok)
                throw new Error("Could not load the sample image")
              return response.blob()
            }
          ))
        if (!blob) throw new Error("The image file was empty")
        bitmap = await createImageBitmap(blob)
        if (bitmap.width * bitmap.height > 24_000_000)
          throw new Error("Choose an image under 24 megapixels")
        const scale = Math.min(
          1,
          maxWidth / Math.max(bitmap.width, bitmap.height)
        )
        const width = Math.max(1, Math.round(bitmap.width * scale))
        const height = Math.max(1, Math.round(bitmap.height * scale))
        const buffer = document.createElement("canvas")
        buffer.width = width
        buffer.height = height
        const context = buffer.getContext("2d", { willReadFrequently: true })!
        context.drawImage(bitmap, 0, 0, width, height)
        const pixels = context.getImageData(0, 0, width, height)
        if (cancelled || id !== loadingId.current) return
        source.current = pixels
        rendered.current = null
        setDimensions({ width, height })
        setCompare(false)
        compareRef.current = false
        worker.current?.postMessage({
          type: "source",
          pixels: pixels.data,
          width,
          height,
        })
        const next = ++renderId.current
        worker.current?.postMessage({
          type: "render",
          options: optionsRef.current,
          id: next,
        })
      } catch (e) {
        if (cancelled) return
        setError(
          e instanceof Error
            ? e.message
            : "Could not open this image. Try a PNG, JPEG, WebP or AVIF."
        )
        setBusy(false)
      } finally {
        bitmap?.close()
      }
    }
    void load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [upload, maxWidth])

  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
    if (!source.current) return
    const id = ++renderId.current
    setBusy(true)
    const timeout = setTimeout(
      () => worker.current?.postMessage({ type: "render", options, id }),
      40
    )
    return () => clearTimeout(timeout)
  }, [options])

  function openFile(file?: File) {
    if (!file) return
    if (
      !["image/png", "image/jpeg", "image/webp", "image/avif"].includes(
        file.type
      )
    ) {
      setError("Choose a PNG, JPEG, WebP or AVIF image.")
      return
    }
    if (file.size > 20_000_000) {
      setError("Choose an image smaller than 20 MB.")
      return
    }
    setFilename(file.name)
    setUpload(file)
  }

  function toggleCompare() {
    const next = !compare
    setCompare(next)
    compareRef.current = next
    const image = next ? source.current : rendered.current
    if (image) paint(image)
  }

  function download() {
    if (!rendered.current) return
    // Always export the dithered result, including while comparing the original.
    const buffer = document.createElement("canvas")
    buffer.width = rendered.current.width
    buffer.height = rendered.current.height
    buffer.getContext("2d")!.putImageData(rendered.current, 0, 0)
    buffer.toBlob((blob) => {
      if (!blob) {
        setError("Could not export the image")
        return
      }
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${filename.replace(/\.[^.]+$/, "")}-dither.png`
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    }, "image/png")
  }

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyState(label)
      setTimeout(() => setCopyState(""), 1800)
    } catch {
      setCopyState("Select and copy the text below")
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Dither home">
          <span className="dotmark" aria-hidden="true" />
          dither<span className="wordmark-period">.</span>
        </a>
        <div className="topbar-right">
          <span className="edition">AN IMAGE LABORATORY</span>
          <a className="text-link" href="#mcp">
            Use with an agent <Arrow />
          </a>
        </div>
      </header>
      <section className="intro">
        <div>
          <p className="eyebrow">SMALL PIXELS. A DIFFERENT PERSPECTIVE.</p>
          <h1>
            A little less smooth.
            <br />
            <span>A little more texture.</span>
          </h1>
        </div>
        <p className="intro-note">
          An image, a pattern, a few good colors.
          <br />
          Make something out of the in-between.
        </p>
      </section>
      <section className="studio" aria-label="Dithering studio">
        <aside className="settings">
          <div className="section-heading">
            <span>01 / THE RECIPE</span>
            <button
              className="reset"
              onClick={() => {
                setOptions({ ...presets.classic })
                setPreset("classic")
              }}
            >
              Reset
            </button>
          </div>
          <div className="preset-list" aria-label="Presets">
            {Object.keys(presets).map((name) => (
              <button
                key={name}
                aria-pressed={preset === name}
                onClick={() => {
                  setPreset(name)
                  setOptions({ ...presets[name as keyof typeof presets] })
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="sliders">
            {controls.map((control) => (
              <label key={control.key} className="control">
                <span className="control-top">
                  <span>{control.title}</span>
                  <output htmlFor={control.key}>
                    {control.key === "strength"
                      ? `${Math.round(options[control.key] * 100)}%`
                      : control.key === "grain"
                        ? options[control.key].toFixed(3)
                        : `${options[control.key]}${control.key === "pixel_size" ? " px" : ""}`}
                  </output>
                </span>
                <input
                  id={control.key}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={options[control.key]}
                  onChange={(event) => {
                    setPreset("custom")
                    setOptions((current) => ({
                      ...current,
                      [control.key]: Number(event.target.value),
                    }))
                  }}
                />
                <span className="control-description">
                  {control.description}
                </span>
              </label>
            ))}
          </div>
          <div className="output-control">
            <label htmlFor="output-size">Output size</label>
            <select
              id="output-size"
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
            >
              <option value={1024}>Up to 1024 px</option>
              <option value={2048}>Up to 2048 px</option>
              <option value={4096}>Up to 4096 px</option>
            </select>
          </div>
          <button
            className="export-button"
            disabled={busy || !dimensions.width || Boolean(error)}
            onClick={download}
          >
            Export PNG <Arrow down />
          </button>
          <p className="privacy-note">
            Your image stays in your browser.
            <br />
            No uploads. No account. Just pixels.
          </p>
        </aside>
        <div className="preview-panel">
          <div className="preview-toolbar">
            <span className="image-name" title={filename}>
              <span className="status-dot" />
              {filename}
            </span>
            <button
              className="compare-button"
              aria-pressed={compare}
              disabled={!dimensions.width}
              onClick={toggleCompare}
            >
              {compare ? "Show dithered" : "Compare original"}
              <span aria-hidden="true">◐</span>
            </button>
          </div>
          <div
            className={`canvas-area ${dragging ? "dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              openFile(event.dataTransfer.files[0])
            }}
          >
            <canvas
              ref={canvas}
              aria-label={compare ? "Original image" : "Dithered image preview"}
              role="img"
            />
            {dragging && (
              <div className="drop-overlay">Drop your image here</div>
            )}
            {busy && (
              <span className="render-status" role="status">
                Rendering<span className="loading-dots">…</span>
              </span>
            )}
          </div>
          <div className="preview-footer">
            <span>
              {dimensions.width
                ? `${dimensions.width} × ${dimensions.height}`
                : "LOADING"}
              <span className="footer-separator">/</span>BAYER 8 × 8
            </span>
            <button
              className="upload-button"
              onClick={() => fileInput.current?.click()}
            >
              Choose an image <span aria-hidden="true">+</span>
            </button>
            <input
              ref={fileInput}
              className="file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              aria-label="Upload an image"
              onChange={(event) => {
                openFile(event.target.files?.[0])
                event.target.value = ""
              }}
            />
          </div>
        </div>
      </section>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      <div className="below-studio">
        <span>Drop an image onto the preview to make it yours.</span>
        <span>PNG, JPEG, WebP, AVIF · up to 24 megapixels</span>
      </div>
      <section id="mcp" className="mcp-section">
        <div className="mcp-intro">
          <p className="eyebrow">02 / FOR YOUR AGENT</p>
          <h2>
            The same little tool.
            <br />
            <span>One conversation away.</span>
          </h2>
          <p>
            Connect Dither to an MCP-compatible agent.
            <br />
            Give it an image and ask for a dithered version.
          </p>
          <a className="text-link" href="/llms.txt">
            Read the tool guide <Arrow />
          </a>
        </div>
        <div className="connection">
          <div className="connection-heading">
            <span>
              <span className="status-dot" />
              STREAMABLE HTTP · NO AUTH
            </span>
            <button onClick={() => void copy(config, "Config copied")}>
              {copyState || "Copy config"}
            </button>
          </div>
          <div className="endpoint">
            <code>{endpoint}</code>
            <button
              aria-label="Copy MCP endpoint"
              onClick={() => void copy(endpoint, "URL copied")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                />
                <path
                  d="M10 3H4a1 1 0 0 0-1 1v6"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <pre>{config}</pre>
          <div className="tool-list">
            <span>dither_image</span>
            <span>get_dither_presets</span>
            <span>get_dither_shader</span>
          </div>
          <p>
            URL or base64 in. A PNG back. Images are processed in memory and are
            not stored. The public endpoint has input and output limits; see the
            guide.
          </p>
        </div>
      </section>
      <footer className="site-footer">
        <a href="https://matthieu.pm">
          A small experiment by Matthieu <span aria-hidden="true">↗</span>
        </a>
        <span>MADE OF TINY DECISIONS.</span>
      </footer>
    </main>
  )
}
