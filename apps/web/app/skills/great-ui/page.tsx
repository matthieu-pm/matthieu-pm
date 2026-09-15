import type { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "../../site-config"
import {
  HeaderControls,
  InstallCommand,
  InterfaceLab,
  RadiusLab,
} from "./controls"
import styles from "./showcase.module.css"

const path = "/skills/great-ui"
const title = "Great UI — Matthieu Duchatellier"
const description =
  "A single design-engineering skill for interfaces that feel right, merging Better UI's precision with Emil Kowalski's interaction craft."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    title,
    description,
    url: path,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.socialPreview.path,
        width: siteConfig.socialPreview.width,
        height: siteConfig.socialPreview.height,
        alt: siteConfig.socialPreview.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.socialPreview.path],
  },
}

const craftDetails = [
  [
    "Surfaces",
    "Concentric radii, optical alignment, layered shadows, and neutral image outlines.",
  ],
  [
    "Interaction",
    "Responsive press states, contextual icon swaps, origin-aware overlays, and interruptible motion.",
  ],
  [
    "Restraint",
    "No ornamental delay. Motion appears only when it explains, confirms, or preserves context.",
  ],
] as const

export default function GreatUiPage() {
  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <HeaderControls pageUrl={`${siteConfig.url}${path}`} />

        <header className={styles.hero}>
          <h1>/great-ui</h1>
          <p className={styles.lead}>
            Build interfaces where every small detail sings in tune.
          </p>
          <p>
            A faithful merge of Jakub Krehel&apos;s interface precision and Emil
            Kowalski&apos;s design-engineering philosophy—for surfaces, icons,
            motion, and the invisible details that make software feel right.
          </p>
          <InstallCommand />
          <nav className={styles.links} aria-label="Page sections">
            <a href="#example">
              Try the playground <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </header>

        <section
          id="example"
          className={styles.example}
          aria-labelledby="example-title"
        >
          <div className={styles.exampleIntro}>
            <span className={styles.kicker}>Interactive example</span>
            <h2 id="example-title">
              Correct is the start. Crafted is the goal.
            </h2>
            <p>
              Switch between states, then use the controls. The behavior stays
              familiar while the details become more coherent.
            </p>
          </div>
          <InterfaceLab />
        </section>

        <section className={styles.section} aria-labelledby="geometry-title">
          <h2 id="geometry-title">Make the geometry feel inevitable.</h2>
          <p>
            Nested surfaces feel related when their radii share the same center.
            Adjust the inset to see the outer radius follow the inner one.
          </p>
          <RadiusLab />
        </section>

        <section className={styles.section} aria-labelledby="details-title">
          <h2 id="details-title">Polish is a system, not a flourish.</h2>
          <p>
            Great UI combines both source skills rather than selecting a few
            memorable tricks.
          </p>
          <div className={styles.surface}>
            {craftDetails.map(([name, detail]) => (
              <div className={styles.detail} key={name}>
                <span>{name}</span>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="sources-title">
          <h2 id="sources-title">Two perspectives. One working method.</h2>
          <p>
            Better UI supplies exact recipes. Emil Design Engineering supplies
            the judgment for when—and why—to use them.
          </p>
          <div className={styles.sourceGrid}>
            <a
              className={styles.sourceCard}
              href="https://github.com/jakubkrehel/skills/tree/main/skills/better-ui"
              target="_blank"
              rel="noreferrer"
            >
              <span>01</span>
              <strong>better-ui</strong>
              <small>Exact values for surfaces, icons, and motion.</small>
            </a>
            <a
              className={styles.sourceCard}
              href="https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng"
              target="_blank"
              rel="noreferrer"
            >
              <span>02</span>
              <strong>emil-design-eng</strong>
              <small>Craft judgment, interaction purpose, and restraint.</small>
            </a>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="use-title">
          <h2 id="use-title">Build. Polish. Review.</h2>
          <div className={styles.prompts}>
            <div>
              <h3>Build</h3>
              <code>
                /great-ui Build this interaction with considered defaults and
                accessible state feedback.
              </code>
            </div>
            <div>
              <h3>Polish</h3>
              <code>
                /great-ui Polish this page without changing its product or
                visual language.
              </code>
            </div>
            <div>
              <h3>Review</h3>
              <code>
                /great-ui Review every surface, icon, and motion state. Report
                what still feels off.
              </code>
            </div>
          </div>
          <InstallCommand />
        </section>

        <footer className={styles.footer}>
          <Link href="/">Matthieu Duchatellier</Link>
          <span>Better UI × Emil Design Engineering</span>
        </footer>
      </div>
    </main>
  )
}
