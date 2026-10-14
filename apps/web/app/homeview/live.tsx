"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import styles from "./homeview.module.css"

const scenes = ["Home", "Music", "Clock"] as const
type Scene = (typeof scenes)[number]
const finishes = [
  { name: "Silver", color: "#dadcdd" },
  { name: "Starlight", color: "#ded4c3" },
  { name: "Rose", color: "#dec7c5" },
  { name: "Midnight", color: "#53565c" },
]

function LightIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M6.5 8.5a3.5 3.5 0 1 1 7 0c0 2-2 2.5-2 4.5h-3c0-2-2-2.5-2-4.5ZM8.5 15h3M9 17h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {on && (
        <path
          d="M10 1V0M3.5 4 2 3M16.5 4 18 3M2 9H0M18 9h2"
          stroke="currentColor"
          strokeWidth="1"
        />
      )}
    </svg>
  )
}

export function HomeViewLive({
  hardware,
  screenMatrix,
}: {
  hardware: ReactNode
  screenMatrix: string
}) {
  const [scene, setScene] = useState<Scene>("Home")
  const [instantScene, setInstantScene] = useState(false)
  const [finish, setFinish] = useState("Silver")
  const [lights, setLights] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState("09:41")
  const [inView, setInView] = useState(false)
  const [still, setStill] = useState(true)
  const [temperature, setTemperature] = useState(21)
  const root = useRef<HTMLElement>(null)
  const sheen = useRef<SVGRectElement>(null)
  const target = useRef(0)
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setStill(media.matches)
    update()
    media.addEventListener("change", update)
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.1 }
    )
    if (root.current) observer.observe(root.current)
    return () => {
      media.removeEventListener("change", update)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      )
    update()
    const timer = window.setInterval(update, 10000)
    return () => window.clearInterval(timer)
  }, [inView])

  useEffect(() => {
    if (!inView || still) return
    const surface = sheen.current
    let frame = 0,
      current = 0,
      previous = 0
    const tick = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0
      previous = now
      current += (target.current - current) * (1 - Math.exp(-8 * dt))
      surface?.setAttribute("transform", `translate(${current} 0)`)
      frame =
        Math.abs(target.current - current) > 0.01
          ? requestAnimationFrame(tick)
          : 0
    }
    wake.current = () => {
      if (!frame) {
        previous = 0
        frame = requestAnimationFrame(tick)
      }
    }
    return () => {
      cancelAnimationFrame(frame)
      wake.current = () => {}
      surface?.removeAttribute("transform")
    }
  }, [inView, still])

  return (
    <section
      ref={root}
      className={styles.section}
      aria-labelledby="homeview-title"
    >
      <div className={styles.heading}>
        <h2 id="homeview-title">HomeView</h2>
      </div>
      <figure
        className={`${styles.figure} iso`}
        data-finish={finish}
        data-scene={scene}
        data-instant-scene={instantScene}
        style={{ "--scene-index": scenes.indexOf(scene) } as CSSProperties}
        data-active={inView && !still ? "true" : "false"}
      >
        <div className={`${styles.plate} iso-plate`}>
          <div className={styles.topline}>
            <span>
              Apple HomeView <span className={styles.concept}>/ Concept</span>
            </span>
          </div>
          <div
            className={styles.stage}
            onPointerMove={(event) => {
              if (event.pointerType === "touch") return
              const box = event.currentTarget.getBoundingClientRect()
              target.current =
                ((event.clientX - box.left) / box.width - 0.5) * 35
              wake.current()
            }}
            onPointerLeave={() => {
              target.current = 0
              wake.current()
            }}
          >
            <svg
              viewBox="-36 -22.5 712 445"
              className={`${styles.device} iso-svg`}
              aria-label="Apple-inspired HomeView concept with a square display, aluminum enclosure, and perforated speaker base"
            >
              <defs>
                <filter id="hv-shadow">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <linearGradient id="hv-metal" x1="0" y1="0" x2="1" y2=".65">
                  <stop stopColor="var(--hv-bright)" />
                  <stop offset=".4" stopColor="var(--hv-mid)" />
                  <stop offset="1" stopColor="var(--hv-dark)" />
                </linearGradient>
                <radialGradient id="hv-dome" cx=".28" cy=".12" r=".9">
                  <stop stopColor="var(--hv-bright)" />
                  <stop offset=".5" stopColor="var(--hv-mid)" />
                  <stop offset="1" stopColor="var(--hv-dark)" />
                </radialGradient>
                <linearGradient id="hv-sheen" x1="0" x2="1">
                  <stop stopColor="#fff" stopOpacity="0" />
                  <stop offset=".5" stopColor="#fff" stopOpacity=".09" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <clipPath id="hv-screen">
                  <rect width="130" height="130" rx="17" />
                </clipPath>
              </defs>
              {hardware}
              <g transform={screenMatrix}>
                <g clipPath="url(#hv-screen)">
                  <foreignObject width="130" height="130">
                    <div
                      className={styles.screen}
                      data-lights={lights ? "on" : "off"}
                    >
                      <div className={styles.screenTrack}>
                        <div
                          className={styles.homeScreen}
                          role="tabpanel"
                          id="hv-panel-Home"
                          aria-labelledby="hv-tab-Home"
                          aria-hidden={scene !== "Home"}
                          inert={scene !== "Home"}
                        >
                          <div className={styles.screenHeader}>
                            <span>My Home</span>
                            <span className={styles.wifi}>◔</span>
                          </div>
                          <div className={styles.roomLabel}>Living room</div>
                          <div className={styles.climate}>
                            <span>{temperature}°</span>
                            <div>
                              <span>Feels just right</span>
                              <div className={styles.temperatureButtons}>
                                <button
                                  aria-label="Decrease temperature"
                                  disabled={temperature <= 16}
                                  onClick={() =>
                                    setTemperature((t) => Math.max(16, t - 1))
                                  }
                                >
                                  −
                                </button>
                                <button
                                  aria-label="Increase temperature"
                                  disabled={temperature >= 28}
                                  onClick={() =>
                                    setTemperature((t) => Math.min(28, t + 1))
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className={styles.tiles}>
                            <button
                              className={styles.lightTile}
                              aria-pressed={lights}
                              onClick={() => setLights((value) => !value)}
                            >
                              <LightIcon on={lights} />
                              <strong>Lights</strong>
                              <span>{lights ? "3 lights on" : "All off"}</span>
                            </button>
                            <button
                              className={styles.musicTile}
                              onClick={() => {
                                setInstantScene(false)
                                setScene("Music")
                                root.current
                                  ?.querySelector<HTMLButtonElement>(
                                    "#hv-tab-Music"
                                  )
                                  ?.focus({ preventScroll: true })
                              }}
                            >
                              <span className={styles.musicIcon}>♫</span>
                              <strong>Music</strong>
                              <span>A moment of calm</span>
                            </button>
                          </div>
                          <div className={styles.homeIndicator} />
                        </div>
                        <div
                          className={styles.musicScreen}
                          role="tabpanel"
                          id="hv-panel-Music"
                          aria-labelledby="hv-tab-Music"
                          aria-hidden={scene !== "Music"}
                          inert={scene !== "Music"}
                        >
                          <div className={styles.screenHeader}>
                            <span>Now playing</span>
                            <span>♫</span>
                          </div>
                          <div className={styles.album}>
                            <div />
                            <span>
                              slow
                              <br />
                              mornings.
                            </span>
                          </div>
                          <div className={styles.trackTitle}>
                            A little room to breathe
                          </div>
                          <div className={styles.artist}>HomeView sessions</div>
                          <div className={styles.player}>
                            <div
                              className={styles.bars}
                              data-playing={playing && scene === "Music"}
                            >
                              {[8, 15, 10, 19, 12].map((h, i) => (
                                <span
                                  key={i}
                                  style={
                                    {
                                      "--bar-height": `${h}px`,
                                      "--bar-delay": `${i * -160}ms`,
                                    } as CSSProperties
                                  }
                                />
                              ))}
                            </div>
                            <button
                              aria-label={
                                playing
                                  ? "Pause music animation"
                                  : "Play music animation"
                              }
                              aria-pressed={playing}
                              onClick={() => setPlaying((p) => !p)}
                            >
                              {playing ? "Ⅱ" : "▶"}
                            </button>
                          </div>
                          <div className={styles.homeIndicator} />
                        </div>
                        <div
                          className={styles.clockScreen}
                          role="tabpanel"
                          id="hv-panel-Clock"
                          aria-labelledby="hv-tab-Clock"
                          aria-hidden={scene !== "Clock"}
                          inert={scene !== "Clock"}
                        >
                          <div className={styles.screenHeader}>
                            <span>A moment at home</span>
                            <span>◷</span>
                          </div>
                          <div className={styles.clockFace}>
                            {Array.from({ length: 12 }, (_, i) => (
                              <i
                                key={i}
                                style={{ transform: `rotate(${i * 30}deg)` }}
                              />
                            ))}
                            <span
                              className={styles.hourHand}
                              style={{
                                transform: `rotate(${(Number(time.slice(0, 2)) % 12) * 30 + Number(time.slice(3)) * 0.5}deg)`,
                              }}
                            />
                            <span
                              className={styles.minuteHand}
                              style={{
                                transform: `rotate(${Number(time.slice(3)) * 6}deg)`,
                              }}
                            />
                            <b />
                          </div>
                          <div className={styles.digitalTime}>{time}</div>
                          <span className={styles.clockNote}>
                            Make yourself at home.
                          </span>
                          <div className={styles.homeIndicator} />
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                  <rect
                    ref={sheen}
                    x="20"
                    width="80"
                    height="130"
                    fill="url(#hv-sheen)"
                    pointerEvents="none"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <figcaption className={styles.controls}>
          <div
            className={styles.scenePicker}
            role="tablist"
            aria-label="Display screen"
          >
            <span className={styles.selectorHighlight} aria-hidden="true" />
            {scenes.map((mode) => (
              <button
                key={mode}
                role="tab"
                id={`hv-tab-${mode}`}
                aria-controls={`hv-panel-${mode}`}
                aria-selected={scene === mode}
                tabIndex={scene === mode ? 0 : -1}
                onClick={(event) => {
                  setInstantScene(event.detail === 0)
                  setScene(mode)
                }}
                onKeyDown={(event) => {
                  const index = scenes.indexOf(mode)
                  const next =
                    event.key === "ArrowRight"
                      ? scenes[(index + 1) % scenes.length]
                      : event.key === "ArrowLeft"
                        ? scenes[(index + scenes.length - 1) % scenes.length]
                        : event.key === "Home"
                          ? scenes[0]
                          : event.key === "End"
                            ? scenes[scenes.length - 1]
                            : undefined
                  if (!next) return
                  event.preventDefault()
                  setInstantScene(true)
                  setScene(next)
                  root.current
                    ?.querySelector<HTMLButtonElement>(`#hv-tab-${next}`)
                    ?.focus({ preventScroll: true })
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className={styles.finishPicker} aria-label="Device finish">
            {finishes.map((item) => (
              <button
                key={item.name}
                aria-label={`${item.name} finish`}
                title={item.name}
                aria-pressed={finish === item.name}
                onClick={() => setFinish(item.name)}
              >
                <span style={{ background: item.color }} />
              </button>
            ))}
            <span className={styles.finishName} aria-live="polite">
              {finish}
            </span>
          </div>
        </figcaption>
      </figure>
    </section>
  )
}
