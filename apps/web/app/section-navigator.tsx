"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { CSSProperties, MouseEvent } from "react"

import styles from "./section-navigator.module.css"

type Section = { id: string; title: string }

export function SectionNavigator() {
  const navigation = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const [sections, setSections] = useState<Section[]>([])
  const [activeId, setActiveId] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [labelsHidden, setLabelsHidden] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  useEffect(() => {
    const content = navigation.current?.closest("main")
    if (!content) return

    const headings = Array.from(
      content.querySelectorAll<HTMLElement>("h1, h2, [data-section-nav-label]")
    )
    const generatedIds = new Set<HTMLElement>()
    const generatedTabIndexes = new Set<HTMLElement>()
    const entries = headings.map((heading, index) => {
      const title =
        heading.dataset.sectionNavLabel ?? heading.textContent?.trim() ?? ""
      if (!heading.id) {
        const base = `section-${
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || index
        }`
        let id = base
        let suffix = 2
        while (document.getElementById(id)) id = `${base}-${suffix++}`
        heading.id = id
        generatedIds.add(heading)
      }
      if (!heading.hasAttribute("tabindex")) {
        heading.tabIndex = -1
        generatedTabIndexes.add(heading)
      }
      heading.dataset.sectionNavTarget = ""
      return { id: heading.id, title }
    })

    let frame = 0
    function updateActiveSection() {
      frame = 0
      let current = headings[0]
      const readingLine = Math.min(window.innerHeight * 0.25, 180)
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= readingLine)
          current = heading
        else break
      }
      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
      ) {
        current = headings.at(-1)
      }
      if (current) setActiveId(current.id)
    }
    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateActiveSection)
    }

    const initialFrame = requestAnimationFrame(() => {
      setSections(entries)
      const hash = window.location.hash.slice(1)
      const target = headings.find((heading) => heading.id === hash)
      target?.scrollIntoView({ behavior: "auto", block: "start" })
      scheduleUpdate()
    })
    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(content)
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      cancelAnimationFrame(initialFrame)
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      headings.forEach((heading) => {
        delete heading.dataset.sectionNavTarget
        if (generatedIds.has(heading)) heading.removeAttribute("id")
        if (generatedTabIndexes.has(heading))
          heading.removeAttribute("tabindex")
      })
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const frame = requestAnimationFrame(() => {
      navigation.current
        ?.querySelector<HTMLAnchorElement>("[aria-current]")
        ?.scrollIntoView({ block: "nearest", behavior: "auto" })
    })
    function closeOutside(event: PointerEvent) {
      if (!navigation.current?.contains(event.target as Node))
        setMenuOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("pointerdown", closeOutside)
    }
  }, [menuOpen])

  function jumpToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (window.location.hash !== `#${id}`)
      window.history.pushState(window.history.state, "", `#${id}`)
    target.focus({ preventScroll: true })
    target.scrollIntoView({
      behavior: event.detail === 0 || reducedMotion ? "auto" : "smooth",
      block: "start",
    })
    setMenuOpen(false)
  }

  const activeIndex = sections.findIndex((section) => section.id === activeId)
  const highlightedIndex = hoveredIndex ?? focusedIndex ?? activeIndex

  return (
    <nav
      ref={navigation}
      className={styles.navigation}
      aria-label="On this page"
      hidden={sections.length < 2}
      style={{ "--section-count": sections.length || 1 } as CSSProperties}
      data-open={menuOpen || undefined}
      data-labels-hidden={labelsHidden || undefined}
      data-keyboard-focus={
        (hoveredIndex === null && focusedIndex !== null) || undefined
      }
      onFocus={() => setLabelsHidden(false)}
      onPointerEnter={() => setLabelsHidden(false)}
      onPointerLeave={() => setHoveredIndex(null)}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return
        setLabelsHidden(true)
        if (menuOpen) {
          setMenuOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <button
        ref={menuButton}
        type="button"
        className={styles.menuButton}
        aria-expanded={menuOpen}
        aria-controls={panelId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        On this page <span aria-hidden="true">{sections.length}</span>
      </button>
      <ol className={styles.list} id={panelId}>
        {sections.map((section, index) => {
          const distance = Math.abs(index - highlightedIndex)
          const width =
            distance === 0
              ? 28
              : distance === 1
                ? 20
                : distance === 2
                  ? 14
                  : distance === 3
                    ? 10
                    : 6
          return (
            <li key={section.id}>
              <a
                className={styles.link}
                href={`#${section.id}`}
                aria-label={section.title}
                aria-current={section.id === activeId ? "location" : undefined}
                onPointerEnter={(event) => {
                  if (
                    event.pointerType !== "touch" &&
                    window.matchMedia("(hover: hover)").matches
                  ) {
                    setHoveredIndex(index)
                    setLabelsHidden(false)
                  }
                }}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onClick={(event) => jumpToSection(event, section.id)}
              >
                <span
                  className={styles.tick}
                  aria-hidden="true"
                  style={{ "--tick-scale": width / 6 } as CSSProperties}
                />
                <span className={styles.label} aria-hidden="true">
                  {section.title}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
