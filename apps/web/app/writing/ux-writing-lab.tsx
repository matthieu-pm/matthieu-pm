"use client"

import { useState } from "react"
import { Alert02Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import styles from "./article.module.css"

const microcopyItems = [
  ["error", "Error message", true],
  ["tooltip", "Tooltip", true],
  ["onboarding", "Onboarding step", true],
  ["cta", "Call to action", true],
  ["blog", "Blog post", false],
  ["ad", "Advertising slogan", false],
] as const

function Feedback({
  correct,
  children,
}: {
  correct: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`${styles.feedback} ${correct ? styles.feedbackGood : styles.feedbackTry}`}
      role="status"
    >
      <span className={styles.feedbackIcon} aria-hidden="true">
        <HugeiconsIcon
          icon={correct ? Tick02Icon : Alert02Icon}
          size={16}
          strokeWidth={2}
        />
      </span>
      <span>{children}</span>
    </div>
  )
}

function SelectionMark({ visible }: { visible: boolean }) {
  return (
    <span
      className={styles.selectionMark}
      data-visible={visible}
      aria-hidden="true"
    >
      <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2.2} />
    </span>
  )
}

function FeedbackSlot({
  visible,
  correct,
  children,
}: {
  visible: boolean
  correct: boolean
  children: React.ReactNode
}) {
  if (!visible) return null

  return (
    <div className={styles.feedbackSlot}>
      <Feedback correct={correct}>{children}</Feedback>
    </div>
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
      <div className={styles.labBody}>
        <p className={styles.prompt}>
          Which examples guide a product interaction? Select all that apply.
        </p>
        <div
          className={styles.selectGrid}
          aria-label="Choose the UX writing examples"
        >
          {microcopyItems.map(([id, label]) => (
            <button
              type="button"
              className={selected.includes(id) ? styles.selectedChoice : ""}
              aria-pressed={selected.includes(id)}
              onClick={() => toggle(id)}
              key={id}
            >
              <span aria-hidden="true">
                {selected.includes(id) ? "✓" : "+"}
              </span>
              {label}
            </button>
          ))}
        </div>
        <div className={styles.labActions}>
          <span>{selected.length} selected</span>
          <button type="button" onClick={() => setChecked(true)}>
            Check answer
          </button>
        </div>
        <FeedbackSlot visible={checked} correct={correct}>
          {correct
            ? "Yes. Errors, tooltips, onboarding, and calls to action help people use a product."
            : "Look for text that helps someone act inside a product. Include errors, tooltips, onboarding, and calls to action."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

export function GoodOrBad() {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === "good"

  return (
    <div className={styles.lab}>
      <div className={styles.labBody}>
        <p className={styles.prompt}>
          An upload paused when the internet connection dropped. The product can
          resume it. Which message helps someone continue?
        </p>
        <div className={styles.comparison}>
          <button
            className={`${styles.optionCard} ${choice === "bad" ? styles.optionSelected : ""}`}
            type="button"
            aria-pressed={choice === "bad"}
            onClick={() => setChoice("bad")}
          >
            <span>Option A</span>
            <SelectionMark visible={choice === "bad"} />
            <strong>Something went wrong.</strong>
            <small>Please try again later.</small>
          </button>
          <button
            className={`${styles.optionCard} ${choice === "good" ? styles.optionSelected : ""}`}
            type="button"
            aria-pressed={choice === "good"}
            onClick={() => setChoice("good")}
          >
            <span>Option B</span>
            <SelectionMark visible={choice === "good"} />
            <strong>Upload paused</strong>
            <small>
              Your connection dropped. Reconnect, then resume the upload.
            </small>
          </button>
        </div>
        <FeedbackSlot visible={choice !== null} correct={correct}>
          {correct
            ? "Yes. It explains why the upload paused and gives a recovery step the product supports."
            : "“Try again later” gives no reason to wait. Here, the person can reconnect and resume."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

export function RewriteReview() {
  const [value, setValue] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className={styles.lab}>
      <div className={styles.labBody}>
        <div className={styles.beforeCopy}>
          <span>Replace this</span>
          <p>Authentication was unsuccessful due to invalid credentials.</p>
        </div>
        <label className={styles.fieldLabel} htmlFor="rewrite">
          Your sign-in message
        </label>
        <p className={styles.fieldHint} id="rewrite-hint">
          The email and password don’t match. Help someone check their details
          and try again. Limit: 180 characters.
        </p>
        <textarea
          id="rewrite"
          aria-describedby="rewrite-hint rewrite-count"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setSubmitted(false)
          }}
          maxLength={180}
        />
        <div className={styles.labActions}>
          <span id="rewrite-count">{180 - value.length} characters left</span>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!value.trim()}
          >
            Compare with an example
          </button>
        </div>
        {submitted && (
          <div className={styles.rewriteReview} role="status">
            <strong>One possible rewrite</strong>
            <p>
              We couldn’t sign you in. Check your email and password, then try
              again.
            </p>
            <p>
              This names the task, uses familiar words, and gives a next step.
              Your version can be different. Check that it does those three
              things without blaming the person or guessing which detail is
              wrong.
            </p>
            <p>
              This is a self-review exercise. Your text is not automatically
              graded.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function MatchTheAction() {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === "checkout"

  return (
    <div className={styles.lab}>
      <div className={styles.labBody}>
        <div className={styles.miniDialog}>
          <span>Hotel search</span>
          <p>
            The button only checks whether rooms are available. It does not make
            a booking.
          </p>
        </div>
        <p className={styles.prompt}>What should the button say?</p>
        <div className={styles.choiceRow}>
          {(
            [
              ["book", "Book a room"],
              ["checkout", "Check availability"],
              ["continue", "Continue"],
            ] as const
          ).map(([id, label]) => (
            <button
              type="button"
              className={choice === id ? styles.choiceSelected : ""}
              aria-pressed={choice === id}
              onClick={() => setChoice(id)}
              key={id}
            >
              {label}
            </button>
          ))}
        </div>
        <FeedbackSlot visible={choice !== null} correct={correct}>
          {correct
            ? "Yes. “Check availability” describes the search without suggesting that it books a room."
            : choice === "book"
              ? "“Book a room” suggests a commitment. This button only checks availability."
              : "“Continue” hides the next step. “Check availability” tells someone what they will see."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

const toneSituations = [
  {
    id: "delay",
    label: "Payment delayed",
    prompt:
      "A bank transfer is taking longer than expected. The product will notify the sender when it completes.",
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
      "30 days in a row. You did it!",
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
      <div className={styles.labBody}>
        <div
          className={styles.situationTabs}
          role="group"
          aria-label="Choose a situation"
          data-selected-index={situationIndex}
        >
          <span className={styles.tabIndicator} aria-hidden="true" />
          <span className={styles.activeTabLabels} aria-hidden="true">
            {toneSituations.map((item) => (
              <span key={item.id}>{item.label}</span>
            ))}
          </span>
          {toneSituations.map((item, index) => (
            <button
              type="button"
              aria-pressed={situationIndex === index}
              aria-controls="tone-situation-panel"
              onClick={() => changeSituation(index)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className={styles.toneScene}
          id="tone-situation-panel"
          key={situation.id}
        >
          <p className={styles.situationPrompt}>{situation.prompt}</p>
          <div className={styles.toneChoices}>
            {situation.choices.map((option, index) => (
              <button
                type="button"
                className={choice === index ? styles.choiceSelected : ""}
                aria-pressed={choice === index}
                onClick={() => setChoice(index)}
                key={option}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <span className={styles.toneChoiceLabel}>{option}</span>
                <SelectionMark visible={choice === index} />
              </button>
            ))}
          </div>
        </div>
        <FeedbackSlot visible={choice !== null} correct={correct}>
          {correct
            ? situation.id === "delay"
              ? "Yes. It explains the current state and the promised update without making light of someone’s money."
              : "Yes. It names the achievement and celebrates it without adding a long message."
            : situation.id === "delay"
              ? "Someone waiting for money needs a clear status and next step. Jokes or abrupt commands do not help."
              : "Name the achievement. A 30-day streak deserves more recognition than a generic system confirmation."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

const errorParts = [
  ["state", "What happened", true],
  ["recovery", "How to recover", true],
  ["preserve", "What was saved", true],
  ["code", "The internal error code", false],
  ["blame", "Who caused the problem", false],
] as const

export function BuildAnErrorMessage() {
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const correct = errorParts.every(([id, , needed]) =>
    needed ? selected.includes(id) : !selected.includes(id)
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
      <div className={styles.labBody}>
        <div className={styles.miniDialog}>
          <span>Card payment failed</span>
          <p>
            The order is still in the basket and nothing has been charged. The
            person can try another payment method. The cause is unknown.
          </p>
        </div>
        <p className={styles.prompt}>
          Which details belong in the error message? Select all that apply.
        </p>
        <div
          className={styles.selectGrid}
          aria-label="Choose the useful parts of the error message"
        >
          {errorParts.map(([id, label]) => (
            <button
              type="button"
              className={selected.includes(id) ? styles.selectedChoice : ""}
              aria-pressed={selected.includes(id)}
              onClick={() => toggle(id)}
              key={id}
            >
              <span aria-hidden="true">
                {selected.includes(id) ? "✓" : "+"}
              </span>
              {label}
            </button>
          ))}
        </div>
        <div className={styles.labActions}>
          <span>{selected.length} selected</span>
          <button type="button" onClick={() => setChecked(true)}>
            Check answer
          </button>
        </div>
        <FeedbackSlot visible={checked} correct={correct}>
          {correct
            ? "For example: “Payment failed. You haven’t been charged, and your order is still in your basket. Try another payment method.”"
            : "Include what failed, what was saved, and how to recover. The cause is unknown, so don’t guess or assign blame."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

export function ConsistencyCheck() {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === "workspace"

  return (
    <div className={styles.lab}>
      <div className={styles.labBody}>
        <div
          className={styles.termPreview}
          aria-label="Three labels for the same product concept"
        >
          <p>
            <span>Navigation</span>
            <strong>Workspace</strong>
          </p>
          <p>
            <span>Page title</span>
            <strong>Your project</strong>
          </p>
          <p>
            <span>Confirmation</span>
            <strong>Space created</strong>
          </p>
        </div>
        <p className={styles.prompt}>
          All three labels describe the same thing. What should the team do?
        </p>
        <div className={styles.choiceRow}>
          <button
            type="button"
            className={choice === "workspace" ? styles.choiceSelected : ""}
            aria-pressed={choice === "workspace"}
            onClick={() => setChoice("workspace")}
          >
            Choose one term
          </button>
          <button
            type="button"
            className={choice === "variety" ? styles.choiceSelected : ""}
            aria-pressed={choice === "variety"}
            onClick={() => setChoice("variety")}
          >
            Keep the variety
          </button>
          <button
            type="button"
            className={choice === "explain" ? styles.choiceSelected : ""}
            aria-pressed={choice === "explain"}
            onClick={() => setChoice("explain")}
          >
            Add tooltips
          </button>
        </div>
        <FeedbackSlot visible={choice !== null} correct={correct}>
          {correct
            ? "Correct. Pick the clearest term, document it in the glossary, and reuse it everywhere."
            : "Extra words cannot repair inconsistent naming. One concept needs one stable name."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

const auditIssues = [
  ["vague", "Vague button label", true],
  ["jargon", "Internal jargon", true],
  ["missing", "No next step", true],
  ["length", "Long page title", false],
] as const

export function AuditTheFlow() {
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const correct = auditIssues.every(([id, , isIssue]) =>
    isIssue ? selected.includes(id) : !selected.includes(id)
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
      <div className={styles.labBody}>
        <div className={styles.auditPreview}>
          <span>Profile transfer</span>
          <strong>Migration unsuccessful</strong>
          <p>A synchronization exception occurred.</p>
          <span className={styles.auditButton}>Continue</span>
        </div>
        <p className={styles.prompt}>
          Which problems affect this screen? Select all that apply.
        </p>
        <div
          className={styles.selectGrid}
          aria-label="Choose the copy problems"
        >
          {auditIssues.map(([id, label]) => (
            <button
              type="button"
              className={selected.includes(id) ? styles.selectedChoice : ""}
              aria-pressed={selected.includes(id)}
              onClick={() => toggle(id)}
              key={id}
            >
              <span aria-hidden="true">
                {selected.includes(id) ? "✓" : "+"}
              </span>
              {label}
            </button>
          ))}
        </div>
        <div className={styles.labActions}>
          <span>{selected.length} selected</span>
          <button type="button" onClick={() => setChecked(true)}>
            Check audit
          </button>
        </div>
        <FeedbackSlot visible={checked} correct={correct}>
          {correct
            ? "Yes. “Synchronization exception” is jargon, and “Continue” hides the recovery step. Confirm what the product can do before rewriting."
            : "Look at the jargon, vague button, and missing recovery step. The title’s length is not the problem."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

export function FindUserLanguage() {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === "saved"

  return (
    <div className={styles.lab}>
      <div className={styles.labBody}>
        <div
          className={styles.quoteStack}
          aria-label="Fictional user research excerpts"
        >
          <p>“I want to find the places I saved for later.”</p>
          <p>“Where did my saved places go?”</p>
          <p>“I save restaurants before a trip.”</p>
        </div>
        <p className={styles.prompt}>What should the navigation label say?</p>
        <div className={styles.choiceRow}>
          <button
            type="button"
            className={choice === "repository" ? styles.choiceSelected : ""}
            aria-pressed={choice === "repository"}
            onClick={() => setChoice("repository")}
          >
            Repository
          </button>
          <button
            type="button"
            className={choice === "saved" ? styles.choiceSelected : ""}
            aria-pressed={choice === "saved"}
            onClick={() => setChoice("saved")}
          >
            Saved places
          </button>
          <button
            type="button"
            className={choice === "collection" ? styles.choiceSelected : ""}
            aria-pressed={choice === "collection"}
            onClick={() => setChoice("collection")}
          >
            My collection
          </button>
        </div>
        <FeedbackSlot visible={choice !== null} correct={correct}>
          {correct
            ? "“Saved places” matches these excerpts. It is a good candidate to test in navigation, not proof that everyone will understand it."
            : "These people describe saving places. “Saved places” reflects that language more directly."}
        </FeedbackSlot>
      </div>
    </div>
  )
}

export function AccessibilityPass() {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === "accessible"

  return (
    <div className={styles.lab}>
      <div className={styles.labBody}>
        <p className={styles.prompt}>
          A form has three required fields. Which instruction removes the most
          barriers?
        </p>
        <div className={styles.comparison}>
          <button
            type="button"
            className={`${styles.optionCard} ${choice === "visual" ? styles.optionSelected : ""}`}
            aria-pressed={choice === "visual"}
            onClick={() => setChoice("visual")}
          >
            <span>Option A</span>
            <SelectionMark visible={choice === "visual"} />
            <strong>Complete the fields in red.</strong>
            <small>Required information is communicated through color.</small>
          </button>
          <button
            type="button"
            className={`${styles.optionCard} ${choice === "accessible" ? styles.optionSelected : ""}`}
            aria-pressed={choice === "accessible"}
            onClick={() => setChoice("accessible")}
          >
            <span>Option B</span>
            <SelectionMark visible={choice === "accessible"} />
            <strong>Complete all fields marked “Required”.</strong>
            <small>Each field also includes a visible text label.</small>
          </button>
        </div>
        <FeedbackSlot visible={choice !== null} correct={correct}>
          {correct
            ? "Right. The instruction does not depend on color, position, or assumed knowledge."
            : "Color alone cannot carry meaning. Name the state in text and label every field."}
        </FeedbackSlot>
      </div>
    </div>
  )
}
