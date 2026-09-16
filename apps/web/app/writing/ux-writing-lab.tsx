"use client"

import { useMemo, useState } from "react"

import styles from "./article.module.css"

const microcopyItems = [
  ["error", "Error message", true],
  ["tooltip", "Tooltip", true],
  ["onboarding", "Onboarding step", true],
  ["cta", "Call to action", true],
  ["blog", "SEO blog post", false],
  ["ad", "Advertising slogan", false],
] as const

function Feedback({ correct, children }: { correct: boolean; children: React.ReactNode }) {
  return (
    <p
      className={`${styles.feedback} ${correct ? styles.feedbackGood : styles.feedbackTry}`}
      role="status"
    >
      {children}
    </p>
  )
}

export function MicrocopyMap() {
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const correct = microcopyItems.every(([id, , isUxWriting]) =>
    isUxWriting ? selected.includes(id) : !selected.includes(id)
  )

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
    setChecked(false)
  }

  return (
    <div className={styles.lab}>
      <p className={styles.prompt}>Select everything a UX writer would shape inside a product.</p>
      <div className={styles.selectGrid} aria-label="Choose the UX writing examples">
        {microcopyItems.map(([id, label]) => (
          <button
            type="button"
            className={selected.includes(id) ? styles.selectedChoice : ""}
            aria-pressed={selected.includes(id)}
            onClick={() => toggle(id)}
            key={id}
          >
            <span aria-hidden="true">{selected.includes(id) ? "✓" : "+"}</span>
            {label}
          </button>
        ))}
      </div>
      <div className={styles.labActions}>
        <span>{selected.length} selected</span>
        <button type="button" onClick={() => setChecked(true)}>Check answer</button>
      </div>
      {checked && (
        <Feedback correct={correct}>
          {correct
            ? "Exactly. UX writing lives in the interface and supports a user action."
            : "Look for words that guide an interaction. Blog posts and ad slogans have different jobs."}
        </Feedback>
      )}
    </div>
  )
}

export function GoodOrBad() {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === "good"

  return (
    <div className={styles.lab}>
      <p className={styles.prompt}>A file upload stopped at 92%. Which message helps the user recover?</p>
      <div className={styles.comparison}>
        <button type="button" onClick={() => setChoice("bad")}>
          <span>Option A</span>
          <strong>Something went wrong.</strong>
          <small>Please try again later.</small>
        </button>
        <button type="button" onClick={() => setChoice("good")}>
          <span>Option B</span>
          <strong>Upload paused</strong>
          <small>Reconnect to the internet, then resume your upload.</small>
        </button>
      </div>
      {choice && (
        <Feedback correct={correct}>
          {correct
            ? "Right. It names the state, the cause, and the next step."
            : "Option A is vague: it hides both the cause and the way forward."}
        </Feedback>
      )}
    </div>
  )
}

function scoreRewrite(value: string) {
  const copy = value.trim()
  if (!copy) return 0

  let score = 20
  if (copy.length <= 72) score += 20
  if (/sign.?in|account|email|password/i.test(copy)) score += 20
  if (/check|try again|reset|use another/i.test(copy)) score += 25
  if (!/authentication|credentials|unsuccessful|error occurred/i.test(copy)) score += 10
  if (copy.split(/[.!?]+/).filter(Boolean).length <= 2) score += 5
  return Math.min(score, 100)
}

export function RewriteScore() {
  const [value, setValue] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const score = useMemo(() => scoreRewrite(value), [value])

  return (
    <div className={styles.lab}>
      <div className={styles.beforeCopy}>
        <span>Replace this</span>
        <p>Authentication was unsuccessful due to invalid credentials.</p>
      </div>
      <label className={styles.fieldLabel} htmlFor="rewrite">Your version</label>
      <textarea
        id="rewrite"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setSubmitted(false)
        }}
        placeholder="Write a shorter, more useful message…"
        maxLength={180}
      />
      <div className={styles.labActions}>
        <span>{value.length}/180</span>
        <button type="button" onClick={() => setSubmitted(true)} disabled={!value.trim()}>
          Score my copy
        </button>
      </div>
      {submitted && (
        <div className={styles.scoreResult} role="status">
          <strong>{score}<span>/100</span></strong>
          <p>
            {score >= 85
              ? "Clear, concise, and actionable."
              : "Replace technical terms, name the problem, and give one next step."}
          </p>
        </div>
      )}
    </div>
  )
}

export function MatchTheAction() {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === "checkout"

  return (
    <div className={styles.lab}>
      <div className={styles.miniDialog}>
        <span>Hotel search</span>
        <p>The button only checks whether rooms are available. It does not make a booking.</p>
      </div>
      <p className={styles.prompt}>What should the button say?</p>
      <div className={styles.choiceRow}>
        <button type="button" onClick={() => setChoice("book")}>Book a room</button>
        <button type="button" onClick={() => setChoice("checkout")}>Check availability</button>
        <button type="button" onClick={() => setChoice("continue")}>Continue</button>
      </div>
      {choice && (
        <Feedback correct={correct}>
          {correct
            ? "Correct. The label lowers pressure and describes what actually happens."
            : "The label should predict the button’s actual behavior."}
        </Feedback>
      )}
    </div>
  )
}

const toneSituations = [
  {
    id: "delay",
    label: "Payment delayed",
    prompt: "A bank transfer is taking longer than expected.",
    choices: [
      "Woohoo! Your payment is taking a little adventure.",
      "Your transfer is still processing. We’ll let you know when it’s complete.",
      "Transfer pending. Wait.",
    ],
    answer: 1,
  },
  {
    id: "success",
    label: "Goal reached",
    prompt: "The user has completed a 30-day learning streak.",
    choices: [
      "Your activity was recorded successfully.",
      "Something happened.",
      "30 days in a row—you did it!",
    ],
    answer: 2,
  },
] as const

export function ToneInContext() {
  const [situationIndex, setSituationIndex] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const situation = toneSituations[situationIndex] ?? toneSituations[0]
  const correct = choice === situation.answer

  function changeSituation(index: number) {
    setSituationIndex(index)
    setChoice(null)
  }

  return (
    <div className={styles.lab}>
      <div className={styles.situationTabs} role="tablist" aria-label="Choose a situation">
        {toneSituations.map((item, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={situationIndex === index}
            className={situationIndex === index ? styles.activeTab : ""}
            onClick={() => changeSituation(index)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className={styles.situationPrompt}>{situation.prompt}</p>
      <div className={styles.toneChoices}>
        {situation.choices.map((option, index) => (
          <button type="button" onClick={() => setChoice(index)} key={option}>
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </button>
        ))}
      </div>
      {choice !== null && (
        <Feedback correct={correct}>
          {correct
            ? "That tone fits the user’s emotional state while keeping the brand clear and human."
            : "Keep the brand voice, but adjust the energy to fit the moment."}
        </Feedback>
      )}
    </div>
  )
}
