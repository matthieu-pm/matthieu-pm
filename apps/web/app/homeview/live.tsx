"use client"

import Image from "next/image"
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import styles from "./homeview.module.css"
import { useScreenSwipe } from "./use-screen-swipe"

const scenes = ["Home", "Music", "Clock"] as const
type Scene = (typeof scenes)[number]
// Matches --hv-w / --hv-h in homeview.module.css. WebKit paints layered HTML
// inside a foreignObject at the SVG origin, so the screen is HTML over the
// device and both are zoomed from this user space.
const VIEWBOX = { x: -36, y: -22.5, width: 712, height: 445 }

function screenPlaneTransform(screenMatrix: string) {
  const match = screenMatrix.match(
    /matrix\(\s*([-\d.eE+]+)[\s,]+([-\d.eE+]+)[\s,]+([-\d.eE+]+)[\s,]+([-\d.eE+]+)[\s,]+([-\d.eE+]+)[\s,]+([-\d.eE+]+)\s*\)/
  )
  if (!match) return undefined
  const [, a, b, c, d, e, f] = match
  return `matrix(${a}, ${b}, ${c}, ${d}, ${Number(e) - VIEWBOX.x}, ${Number(f) - VIEWBOX.y})`
}

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
      <path
        className={styles.lightRays}
        d="M10 1V0M3.5 4 2 3M16.5 4 18 3M2 9H0M18 9h2"
        stroke="currentColor"
        strokeWidth="1"
        opacity={on ? 1 : 0}
      />
    </svg>
  )
}

export function HomeViewLive({
  hardware,
  screenMatrix,
  title,
}: {
  hardware: ReactNode
  screenMatrix: string
  title: string
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
  const sheen = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const wake = useRef<() => void>(() => {})
  const {
    figureRef,
    planeRef,
    trackRef,
    handlers: screenSwipeHandlers,
  } = useScreenSwipe(scenes.indexOf(scene), (index) => {
    const next = scenes[index]
    if (!next) return
    const moveFocus =
      next !== scene &&
      root.current
        ?.querySelector("[data-lights]")
        ?.contains(document.activeElement)
    setInstantScene(false)
    setScene(next)
    if (moveFocus)
      root.current
        ?.querySelector<HTMLDivElement>("[data-lights]")
        ?.focus({ preventScroll: true })
  })

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
      surface?.style.setProperty("transform", `translate(${current}px, 0px)`)
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
      surface?.style.removeProperty("transform")
    }
  }, [inView, still])

  return (
    <section
      ref={root}
      className={styles.section}
      aria-labelledby="homeview-title"
    >
      <div className={styles.heading}>
        <h2 id="homeview-title">{title}</h2>
      </div>
      <figure
        ref={figureRef}
        className={`${styles.figure} iso`}
        data-finish={finish}
        data-scene={scene}
        data-instant-scene={instantScene}
        style={{ "--scene-index": scenes.indexOf(scene) } as CSSProperties}
        data-active={inView && !still ? "true" : "false"}
      >
        <div className={`${styles.plate} iso-plate`}>
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
            <div className={styles.deviceFrame}>
              <div className={styles.scaler}>
                <svg
                  viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
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
                  </defs>
                  {hardware}
                  <g ref={planeRef} transform={screenMatrix}>
                    <rect
                      width="130"
                      height="130"
                      fill="transparent"
                      pointerEvents="none"
                    />
                  </g>
                </svg>
                <div
                  className={styles.screen}
                  style={{ transform: screenPlaneTransform(screenMatrix) }}
                  data-lights={lights ? "on" : "off"}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label={`HomeView display, ${scene} screen`}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return
                    const index = scenes.indexOf(scene)
                    const next =
                      event.key === "ArrowRight"
                        ? scenes[Math.min(index + 1, scenes.length - 1)]
                        : event.key === "ArrowLeft"
                          ? scenes[Math.max(index - 1, 0)]
                          : event.key === "Home"
                            ? scenes[0]
                            : event.key === "End"
                              ? scenes[scenes.length - 1]
                              : undefined
                    if (!next) return
                    event.preventDefault()
                    setInstantScene(true)
                    setScene(next)
                  }}
                  {...screenSwipeHandlers}
                >
                  <div ref={trackRef} className={styles.screenTrack}>
                    <div
                      className={styles.homeScreen}
                      role="group"
                      id="hv-panel-Home"
                      aria-label="Home screen"
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
                          aria-label="Show Music screen"
                          onClick={() => {
                            setInstantScene(false)
                            setScene("Music")
                            root.current
                              ?.querySelector<HTMLDivElement>("[data-lights]")
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
                      role="group"
                      id="hv-panel-Music"
                      aria-label="Music screen"
                      aria-hidden={scene !== "Music"}
                      inert={scene !== "Music"}
                    >
                      <div className={styles.screenHeader}>
                        <span>Now playing</span>
                        <span>♫</span>
                      </div>
                      <div className={styles.album}>
                        <Image
                          src="https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/93/14/66/9314660a-8ec2-2e26-652b-62c82b14fb80/823375358930_Cover.jpg/100x100bb.jpg"
                          alt="FIRESTARTER cover"
                          width={100}
                          height={100}
                          unoptimized
                        />
                      </div>
                      <div className={styles.trackTitle}>FIRESTARTER</div>
                      <div className={styles.artist}>K/DA</div>
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
                      role="group"
                      id="hv-panel-Clock"
                      aria-label="Clock screen"
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
                  <div ref={sheen} className={styles.sheen} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.controls}>
          <div
            className={styles.finishPicker}
            role="group"
            aria-label="Device finish"
          >
            {finishes.map((item) => (
              <button
                key={item.name}
                aria-label={`${item.name} finish`}
                aria-pressed={finish === item.name}
                onClick={() => setFinish(item.name)}
              >
                <span style={{ background: item.color }} />
              </button>
            ))}
          </div>
        </div>
      </figure>
    </section>
  )
}
