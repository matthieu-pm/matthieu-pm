"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Bookmark02Icon,
  Folder01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import styles from "./showcase.module.css"

const variants = [false, true] as const

function Comparison({
  name,
  description,
  takeaway,
  children,
}: {
  name: string
  description: string
  takeaway: string
  children: (polished: boolean) => ReactNode
}) {
  const id = useId()
  return (
    <section className={styles.craftExample} aria-labelledby={id}>
      <div className={styles.craftHeading}>
        <h3 id={id}>{name}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.craftShell}>
        <div className={styles.craftGrid}>
          {variants.map((polished) => (
            <div
              key={String(polished)}
              className={`${styles.craftSide} ${polished ? styles.craftWith : styles.craftWithout}`}
              role="group"
              aria-label={`${name}: ${polished ? "With" : "Without"} skill`}
            >
              <div className={styles.craftLabel}>
                <span className={styles.craftDot} />
                {polished ? "With skill" : "Without skill"}
              </div>
              {children(polished)}
            </div>
          ))}
        </div>
      </div>
      <p className={styles.craftCaption}>{takeaway}</p>
    </section>
  )
}

function ReadingCard() {
  return (
    <>
      <div className={styles.readingStage}>
        <div className={styles.readingCard}>
          <div className={styles.readingArtwork} aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className={styles.readingContent}>
            <span className={styles.readingEyebrow}>Field notes · Design</span>
            <h4>Words that work.</h4>
            <p>Small details. Clearer interfaces.</p>
            <Link href="/writing/ux-writing" className={styles.readingLink}>
              Read article
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function SaveExample() {
  const [open, setOpen] = useState(false)
  const [collection, setCollection] = useState<string | null>(null)
  const [keyboard, setKeyboard] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", dismiss)
    return () => document.removeEventListener("pointerdown", dismiss)
  }, [open])

  function choose(value: string | null) {
    setCollection(value)
    setOpen(false)
    trigger.current?.focus()
  }

  return (
    <>
      <div className={styles.saveStage}>
        <span className={styles.saveTitle}>Words that work.</span>
        <span className={styles.saveSubtitle}>Keep it for later.</span>
        <div
          className={styles.saveControl}
          ref={root}
          data-keyboard={keyboard}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
          }}
          onKeyDown={(event) => {
            setKeyboard(true)
            if (event.key === "Escape" && open) {
              event.preventDefault()
              setOpen(false)
              trigger.current?.focus()
            }
          }}
          onPointerDown={() => setKeyboard(false)}
        >
          <button
            ref={trigger}
            type="button"
            className={styles.saveTrigger}
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
          >
            <span className={styles.saveIcon} aria-hidden="true">
              <span data-visible={!collection}><HugeiconsIcon icon={Bookmark02Icon} size={18} strokeWidth={2} /></span>
              <span data-visible={!!collection}><HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={2} /></span>
            </span>
            {collection ? "Saved" : "Save article"}
          </button>
          <div
            id={id}
            className={styles.collectionPicker}
            data-open={open}
            inert={!open}
            aria-hidden={!open}
          >
            <span>Save to collection</span>
            {["Reading list", "Design references"].map((name) => (
              <button type="button" key={name} onClick={() => choose(name)} aria-pressed={collection === name}>
                <HugeiconsIcon icon={Folder01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
                {name}
                {collection === name && <HugeiconsIcon icon={Tick02Icon} size={14} aria-hidden="true" />}
              </button>
            ))}
            {collection && <button type="button" className={styles.removeSaved} onClick={() => choose(null)}>Remove from saved</button>}
          </div>
        </div>
        <p className={styles.saveStatus} role="status">{collection ? `In ${collection.toLowerCase()}` : "Not saved yet"}</p>
      </div>
    </>
  )
}

const notes = [
  { title: "Words that work", category: "Writing", saved: true },
  { title: "A little less motion", category: "Interaction", saved: false },
  { title: "Details add up", category: "Craft", saved: true },
]

function FilterExample({ polished }: { polished: boolean }) {
  const [savedOnly, setSavedOnly] = useState(false)
  const [animate, setAnimate] = useState(false)
  const id = useId()
  const visible = notes.filter((note) => !savedOnly || note.saved)
  return (
    <>
      <div className={styles.filterStage}>
        <div className={styles.filterButtons} role="group" aria-label="Filter notes">
          {[false, true].map((saved) => (
            <button
              key={String(saved)}
              type="button"
              aria-pressed={savedOnly === saved}
              aria-controls={id}
              onClick={(event) => {
                setAnimate(event.detail > 0)
                setSavedOnly(saved)
              }}
            >{saved ? "Saved" : "All notes"}</button>
          ))}
        </div>
        <ul id={id} key={String(savedOnly)} className={styles.noteList} data-animate={!polished && animate}>
          {visible.map((note) => (
            <li key={note.title}>
              <span><strong>{note.title}</strong><small>{note.category}</small></span>
              {note.saved && <HugeiconsIcon icon={Bookmark02Icon} size={16} strokeWidth={1.5} aria-label="Saved" />}
            </li>
          ))}
        </ul>
        <span className={styles.filterCount} role="status">{visible.length} notes</span>
      </div>
    </>
  )
}

export function CraftExamples() {
  return (
    <div className={styles.craftExamples}>
      <Comparison name="Surfaces" description="The same reading card, with geometry and depth that feel related." takeaway="Concentric corners, balanced spacing, and layered shadows replace mismatched radii and hard outlines.">
        {() => <ReadingCard />}
      </Comparison>
      <Comparison name="Interaction" description="The same save action, with feedback that follows your intent." takeaway="Press feedback, smooth icon changes, and a picker anchored to its button make each action feel connected.">
        {() => <SaveExample />}
      </Comparison>
      <Comparison name="Restraint" description="The same filter, with the unnecessary motion taken away." takeaway="Removing the repeated entrance animation makes filtering immediate and keeps attention on the content.">
        {(polished) => <FilterExample polished={polished} />}
      </Comparison>
    </div>
  )
}
