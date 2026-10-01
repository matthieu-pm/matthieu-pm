"use client"

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { ReferenceIcon, type IconName } from "./reference-icons"

type Theme = "light" | "dark" | "system"
const themeKey = "matthieu-oklch-theme"
const themeEvent = "oklch-theme-change"
let fallbackTheme: Theme = "system"
function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(themeKey)
    return stored === "light" || stored === "dark" ? stored : fallbackTheme
  } catch {
    return fallbackTheme
  }
}
function snapshot() {
  const theme = getTheme()
  return `${theme}:${theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"}`
}
function subscribe(callback: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)")
  window.addEventListener(themeEvent, callback)
  window.addEventListener("storage", callback)
  media.addEventListener("change", callback)
  return () => {
    window.removeEventListener(themeEvent, callback)
    window.removeEventListener("storage", callback)
    media.removeEventListener("change", callback)
  }
}
const serverSnapshot = () => "system:light"
function useTheme() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
function setTheme(theme: Theme) {
  fallbackTheme = theme
  try {
    localStorage.setItem(themeKey, theme)
  } catch {
    /* Continue with the session preference. */
  }
  window.dispatchEvent(new Event(themeEvent))
}

export function PageShell({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  const theme = useTheme().split(":")[1]
  return (
    <div
      className={`oklch-page ${className} ${theme === "dark" ? "dark" : ""}`}
    >
      {children}
    </div>
  )
}

export function ThemePicker() {
  const selected = useTheme().split(":")[0]
  return (
    <div className="oklch-theme-picker" role="group" aria-label="Color theme">
      {(["light", "dark", "system"] as const).map((theme) => {
        const label =
          `${theme[0]?.toUpperCase()}${theme.slice(1)} theme` as IconName
        return (
          <button
            key={theme}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={selected === theme}
            onClick={() => setTheme(theme)}
          >
            <ReferenceIcon name={label} />
          </button>
        )
      })}
    </div>
  )
}

export function Feedback() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const popover = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!popover.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", escape)
    }
  }, [open])
  return (
    <div className="oklch-feedback" ref={popover}>
      <button
        ref={trigger}
        className="oklch-feedback-trigger"
        aria-expanded={open}
        aria-controls="oklch-feedback-form"
        onClick={() => setOpen(!open)}
      >
        Feedback
      </button>
      {open && (
        <form
          id="oklch-feedback-form"
          className="oklch-feedback-form"
          onSubmit={(event) => {
            event.preventDefault()
            window.location.href = `mailto:jakub@kbo.sk?subject=${encodeURIComponent("OKLCH feedback")}&body=${encodeURIComponent(message.trim())}`
            setOpen(false)
          }}
        >
          <textarea
            autoFocus
            aria-label="Feedback message"
            placeholder="Ideas, suggestions, or issues"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          <button type="submit" disabled={!message.trim()}>
            Send Feedback
          </button>
        </form>
      )}
    </div>
  )
}

const navigation: { name: IconName; href: string }[] = [
  { name: "Home", href: "/oklch" },
  { name: "Skill", href: "https://oklch.fyi/skill" },
  { name: "Create", href: "https://oklch.fyi/create" },
  { name: "Convert", href: "https://oklch.fyi/convert" },
  { name: "Color Palettes", href: "https://oklch.fyi/color-palettes" },
  { name: "Gradients", href: "https://oklch.fyi/gradients" },
  { name: "Gamut Visualizer", href: "https://oklch.fyi/gamut" },
  { name: "Bulk Convert", href: "https://oklch.fyi/bulk-convert" },
  { name: "Saved", href: "https://oklch.fyi/saved" },
]
const social: { name: IconName; href: string }[] = [
  { name: "Buy me a coffee", href: "https://ko-fi.com/jakubkrehel" },
  { name: "Contact", href: "mailto:jakub@kbo.sk" },
  { name: "X (Twitter)", href: "https://x.com/jakubkrehel" },
]

export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])
  function close() {
    dialog.current?.close()
    setOpen(false)
  }
  return (
    <>
      <button
        className="oklch-menu-toggle"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => {
          dialog.current?.showModal()
          setOpen(true)
        }}
      >
        <span />
        <span />
      </button>
      <dialog
        className="oklch-mobile-menu"
        ref={dialog}
        aria-label="Site navigation"
        onClose={() => setOpen(false)}
      >
        <div className="oklch-mobile-header">
          <a href="/oklch" aria-label="Home" onClick={close}>
            <ReferenceIcon name="Logo" />
          </a>
          <button
            className="oklch-menu-toggle is-close"
            aria-label="Close menu"
            onClick={close}
          >
            <span />
            <span />
          </button>
        </div>
        <nav aria-label="Site navigation">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} onClick={close}>
              <ReferenceIcon name={item.name} />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="oklch-mobile-social">
          {social.map((item) => (
            <a key={item.name} href={item.href}>
              <ReferenceIcon name={item.name} />
              {item.name}
            </a>
          ))}
          <a href="https://oklch.fyi/sign-in">
            <ReferenceIcon name="Sign in" />
            Sign in
          </a>
        </div>
        <ThemePicker />
      </dialog>
    </>
  )
}
