import type { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "../../site-config"
import { SectionNavigator } from "../../section-navigator"
import {
  HeaderControls,
  InstallCommand,
  InterfaceLab,
  RadiusLab,
} from "./controls"
import styles from "./showcase.module.css"
import { CraftExamples } from "./craft-examples"

const path = "/skills/great-ui"
const title = "Great UI"
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

export default function GreatUiPage() {
  return (
    <main className={styles.page}>
      <SectionNavigator />
      <div className={styles.column}>
        <HeaderControls pageUrl={`${siteConfig.url}${path}`} />

        <header className={styles.hero}>
          <h1>/great-ui</h1>
          <p className={styles.lead}>Make every interface detail feel right.</p>
          <p>
            A faithful merge of{" "}
            <a
              href="https://github.com/jakubkrehel/skills/tree/main/skills/better-ui"
              target="_blank"
              rel="noreferrer"
            >
              Better UI
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng"
              target="_blank"
              rel="noreferrer"
            >
              Emil Design Engineering
            </a>
            {
              ". It brings together surfaces, icons, and motion that feel right."
            }
          </p>
          <InstallCommand />
        </header>

        <section
          id="example"
          className={styles.example}
          aria-labelledby="example-title"
        >
          <div className={styles.exampleIntro}>
            <h2 id="example-title">
              Correct is the start. Crafted is the goal.
            </h2>
            <p>
              Refine the details that make an interface feel intentional.
              Improve geometry, optical balance, and surface depth. Add
              contextual icons, generous hit areas, and subtle motion.
            </p>
          </div>
          <InterfaceLab />
        </section>

        <section className={styles.section} aria-labelledby="geometry-title">
          <h2 id="geometry-title">Make the geometry feel inevitable.</h2>
          <p>
            Nested surfaces feel related when their radii share the same center.
            Adjust each value to see the geometry respond in real time.
          </p>
          <RadiusLab />
        </section>

        <section className={styles.section} aria-labelledby="details-title">
          <h2 id="details-title">Polish is a system, not a flourish.</h2>
          <p>
            Great UI combines both source skills rather than selecting a few
            memorable tricks.
          </p>
          <CraftExamples />
        </section>

        <section className={styles.section} aria-labelledby="sources-title">
          <h2 id="sources-title">Two perspectives. One working method.</h2>
          <p>
            Better UI supplies exact recipes. Emil Design Engineering supplies
            the judgment for when and why to use them.
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

        <section
          id="install"
          className={styles.section}
          aria-label="Install Great UI"
          data-section-nav-label="Install Great UI"
        >
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
