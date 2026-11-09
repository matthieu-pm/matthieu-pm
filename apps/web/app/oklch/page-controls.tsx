"use client"

import Image from "next/image"
import { useThemeChange, useThemePreference } from "@/components/theme-provider"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ReferenceIcon, type IconName } from "./reference-icons"

export function PageShell({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  return <div className={`oklch-page ${className}`}>{children}</div>
}

export function ThemePicker() {
  const selected = useThemePreference()
  const { changeTheme: setTheme } = useThemeChange()
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
          toolname="draft_oklch_feedback"
          tooldescription="Prepare feedback about the OKLCH reference demo. Submitting opens the user's email app with a draft addressed to jakub@kbo.sk; it does not send an email."
          className="oklch-feedback-form"
          onSubmit={(event) => {
            event.preventDefault()
            window.location.href = `mailto:jakub@kbo.sk?subject=${encodeURIComponent("OKLCH feedback")}&body=${encodeURIComponent(message.trim())}`
            setOpen(false)
          }}
        >
          <textarea
            name="message"
            toolparamdescription="Feedback message to include in the email draft."
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
            <Image
              className="oklch-logo"
              src="/logos/oklch-icon.webp"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
            />
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
