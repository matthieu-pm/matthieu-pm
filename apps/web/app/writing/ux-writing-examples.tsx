"use client"

import { useState } from "react"

import styles from "./article.module.css"

function Example({
  label,
  caption,
  children,
}: {
  label: string
  caption: string
  children: React.ReactNode
}) {
  return (
    <figure className={styles.copyExample}>
      <div className={styles.exampleSurface}>
        <span className={styles.exampleLabel}>{label}</span>
        {children}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export function SettingsExample() {
  const [name, setName] = useState("Alex Morgan")
  const [saved, setSaved] = useState(false)
  return (
    <Example
      label="Try it · Profile settings"
      caption="UX writing names the action: “Save changes.” Content design decides which fields belong together and where the confirmation appears."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSaved(true)
        }}
      >
        <label htmlFor="example-name">Display name</label>
        <p className={styles.exampleHint} id="example-name-hint">
          This is how your name appears on your profile.
        </p>
        <input
          id="example-name"
          aria-describedby="example-name-hint"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setSaved(false)
          }}
          required
          maxLength={60}
        />
        <div className={styles.exampleActions}>
          <button type="submit">Save changes</button>
          <span role="status">
            {saved ? "Changes saved in this example." : ""}
          </span>
        </div>
      </form>
    </Example>
  )
}

const rewrites = [
  {
    label: "Lead with the action",
    before: "To continue, you will need to verify your email.",
    title: "Verify your email to continue",
    body: "Open the verification link we sent to alex@example.com.",
    note: "The heading puts the next action first. The supporting line explains how to complete it.",
  },
  {
    label: "Use active voice",
    before: "An invitation will be sent by us.",
    title: "Invite a teammate",
    body: "We’ll send an invitation to their email address.",
    note: "“We’ll send” makes it clear who will act and what they will do.",
  },
  {
    label: "Use everyday words",
    before: "Initiate data export.",
    title: "Export your data",
    body: "Download your saved places as a CSV file.",
    note: "“Export your data” names the task. The next line explains what the download contains.",
  },
  {
    label: "Write for translation",
    before: "You’re good to go!",
    title: "Your account is ready",
    body: "You can now save places and plan your first trip.",
    note: "A specific result is easier to understand than an idiom. The next line explains what is now possible.",
  },
] as const

export function RewriteExamples() {
  const [selected, setSelected] = useState(0)
  const example = rewrites[selected] ?? rewrites[0]
  return (
    <div className={styles.exampleCollection}>
      <div
        className={styles.exampleChoices}
        role="group"
        aria-label="Choose a writing example"
      >
        {rewrites.map((item, index) => (
          <button
            type="button"
            key={item.label}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Example
        label="Example · Email and account messages"
        caption={example.note}
      >
        <div className={styles.exampleBefore}>
          <span>Before</span>
          <p>{example.before}</p>
        </div>
        <div className={styles.exampleAfter} aria-live="polite">
          <span className={styles.exampleLabel}>After</span>
          <h3>{example.title}</h3>
          <p>{example.body}</p>
        </div>
      </Example>
    </div>
  )
}

export function RecoveryExample() {
  const [step, setStep] = useState<"failed" | "ready" | "complete">("failed")
  return (
    <Example
      label="Try it · File upload"
      caption="Can you explain why the upload failed, predict the next action, and finish without help? The file name stays consistent throughout."
    >
      <div aria-live="polite">
        <h3>
          {step === "failed"
            ? "Your file is too large"
            : step === "ready"
              ? "Your file is ready to upload"
              : "File uploaded"}
        </h3>
        <p>
          {step === "failed"
            ? "trip-notes.pdf is 12 MB. Choose a file under 10 MB."
            : step === "ready"
              ? "trip-notes.pdf · 4 MB"
              : "trip-notes.pdf has been added to this example."}
        </p>
      </div>
      <div className={styles.exampleActions}>
        <button
          type="button"
          onClick={() =>
            setStep(
              step === "failed"
                ? "ready"
                : step === "ready"
                  ? "complete"
                  : "failed"
            )
          }
        >
          {step === "failed"
            ? "Use a smaller example file"
            : step === "ready"
              ? "Upload file"
              : "Try the example again"}
        </button>
      </div>
    </Example>
  )
}

export function ToneExamples() {
  return (
    <div className={styles.messageExamples}>
      <Example
        label="Routine confirmation"
        caption="Confirm the result. Keep it brief."
      >
        <p className={styles.exampleConfirmation}>
          <span aria-hidden="true">✓</span> Changes saved
        </p>
      </Example>
      <Example
        label="First use"
        caption="Explain what belongs here and how to start."
      >
        <h3>No saved places yet</h3>
        <p>Save a place to find it before your next trip.</p>
      </Example>
      <Example
        label="Something failed"
        caption="Name the problem and give a recovery step."
      >
        <h3>We couldn’t load your places</h3>
        <p>Check your connection, then try again.</p>
      </Example>
      <Example
        label="Permanent action"
        caption="State exactly what will be lost."
      >
        <h3>Delete “Weekend in Paris”?</h3>
        <p>This deletes the list and its saved places. You can’t undo this.</p>
      </Example>
    </div>
  )
}

export function ContentPatternExample() {
  return (
    <Example
      label="Example · A reusable content pattern"
      caption="Store the wording, its intended use, and its owner together. Review the pattern when the product behavior changes."
    >
      <h3>When someone saves a place</h3>
      <p>
        Use a short confirmation. Keep the feature name “Saved places” in
        navigation and help text.
      </p>
      <div className={styles.exampleConfirmation}>
        <span aria-hidden="true">✓</span> Added to your saved places
      </div>
      <p className={styles.exampleHint}>
        Use after saving succeeds. If saving fails, explain the problem and
        offer a retry. Avoid “Repository” and “Collection” for this feature.
      </p>
      <p className={styles.exampleOwner}>
        Owner: the team responsible for saved places.
      </p>
    </Example>
  )
}

export function AccessibleFormExample() {
  const [date, setDate] = useState("")
  const [dateError, setDateError] = useState("")
  const [saved, setSaved] = useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    if (date <= today) {
      setDateError("Choose a date in the future.")
      setSaved(false)
      event.currentTarget
        .querySelector<HTMLInputElement>("#example-delivery-date")
        ?.focus()
      return
    }
    setDateError("")
    setSaved(true)
  }

  return (
    <Example
      label="Try it · Delivery details"
      caption="The labels stay visible while you type. Required fields use text, the date error explains the fix, and the policy link names its destination. Nothing is sent or booked."
    >
      <h3>Choose your delivery date</h3>
      <ol className={styles.exampleInstructions}>
        <li>Enter an email address for delivery updates.</li>
        <li>Choose a future delivery date.</li>
      </ol>
      <form onSubmit={submit} onChange={() => setSaved(false)}>
        <label htmlFor="example-delivery-email">
          Email address <span>(Required)</span>
        </label>
        <input
          id="example-delivery-email"
          type="email"
          required
          placeholder="name@example.com"
          aria-describedby="example-delivery-email-hint"
        />
        <p className={styles.exampleHint} id="example-delivery-email-hint">
          Use a made-up address to try this example.
        </p>
        <label htmlFor="example-delivery-date">
          Delivery date <span>(Required)</span>
        </label>
        <input
          id="example-delivery-date"
          type="date"
          required
          value={date}
          onChange={(event) => {
            setDate(event.target.value)
            setDateError("")
          }}
          aria-invalid={!!dateError}
          aria-describedby={
            dateError
              ? "example-date-hint example-date-error"
              : "example-date-hint"
          }
        />
        <p className={styles.exampleHint} id="example-date-hint">
          Try a past date to see the error message.
        </p>
        {dateError && (
          <p
            className={styles.exampleError}
            id="example-date-error"
            role="alert"
          >
            {dateError}
          </p>
        )}
        <details className={styles.exampleDetails}>
          <summary>Read the delivery policy</summary>
          <p>
            For this example, any future date is available. In a real checkout,
            explain available days and delivery costs here.
          </p>
        </details>
        <div className={styles.exampleActions}>
          <button type="submit">Save delivery details</button>
        </div>
        <p className={styles.exampleStatus} role="status">
          {saved ? "Delivery details saved in this example." : ""}
        </p>
      </form>
    </Example>
  )
}
