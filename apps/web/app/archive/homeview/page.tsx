import type { Metadata } from "next"
import Link from "next/link"

import { HomeView } from "../../homeview/art"
import { SectionNavigator } from "../../section-navigator"
import { siteConfig } from "../../site-config"
import { ArticleControls } from "../../writing/article-controls"
import styles from "./page.module.css"

const path = "/archive/homeview"
const title = "HomeView — a home display concept"
const description =
  "An interactive, Apple-inspired home display study. Explore the concept and how SVG geometry, a live HTML screen, and small interactions bring it to life."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "article",
    title,
    description,
    url: path,
    siteName: siteConfig.name,
    images: [siteConfig.socialPreview.path],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.socialPreview.path],
  },
}

export default function HomeViewPage() {
  return (
    <main className={styles.page}>
      <SectionNavigator />
      <article className={styles.column}>
        <ArticleControls pageUrl={`${siteConfig.url}${path}`} />

        <header className={styles.hero}>
          <p className={styles.eyebrow}>Archive · Design study</p>
          <h1>HomeView</h1>
          <p className={styles.lead}>
            A small display. A little more life at home.
          </p>
          <p className={styles.intro}>
            An Apple-inspired home display with a square screen, an aluminum
            enclosure, and a domed speaker base. A study in making a physical
            object feel tangible and usable in the browser.
          </p>
        </header>

        <HomeView title="Explore the concept" />
        <p className={styles.caption}>
          Choose a finish below the device. Swipe its screen, or focus the
          display and use the arrow keys, to explore Home, Music, and Clock.
          Try the lights, temperature controls, and music animation.
        </p>

        <section className={styles.section} aria-labelledby="idea-title">
          <h2 id="idea-title">Start with the object</h2>
          <p>
            The concept brings a few everyday actions into one quiet object:
            adjust the room temperature, switch the lights, or glance at the
            time. The music screen adds an animated player. These controls
            simulate the experience locally; they don’t connect to home devices
            or play audio.
          </p>
          <p>
            The hardware takes cues from Apple’s materials and proportions.
            This is an independent design study, unaffiliated with Apple, with
            model units rather than manufactured dimensions.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="geometry-title">
          <h2 id="geometry-title">Build the form in code</h2>
          <p>
            The device is drawn with SVG. A build script uses the Anatomy
            geometry kit to project 47 solids into a shared view: the rubber
            foot, speaker body, 36 curved grille segments, dome, hinge, and
            layered display. The speaker apertures follow the curved surface,
            while the bezel and glass share the display’s rounded outline.
          </p>
          <p>
            The script orders and audits the geometry, then saves the paths in
            a generated file. Next.js renders those paths on the server. The
            browser receives the finished shapes, so it doesn’t need to rebuild
            the hardware during an animation.
          </p>
          <dl className={styles.layers}>
            <div>
              <dt>SVG</dt>
              <dd>The enclosure, speaker, shadows, and material detail.</dd>
            </div>
            <div>
              <dt>HTML + CSS</dt>
              <dd>A live screen aligned to the same projected plane.</dd>
            </div>
            <div>
              <dt>React</dt>
              <dd>Screen navigation, finishes, and local control states.</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section} aria-labelledby="screen-title">
          <h2 id="screen-title">Put a real interface on the screen</h2>
          <p>
            The screen is HTML positioned over the SVG device with a shared
            transformation matrix. That keeps text and buttons interactive
            while matching the angle of the glass. It also avoids a WebKit
            rendering issue with layered HTML inside an SVG foreignObject.
          </p>
          <p>
            Swipes are translated from the pointer’s position into the screen’s
            own coordinates. The interface follows the drag, then settles onto
            a screen using distance and flick velocity. A little resistance at
            either end makes the boundary feel physical. Keyboard navigation
            offers the same three screens, and inactive screens are removed
            from the focus order.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="details-title">
          <h2 id="details-title">Finish with the small details</h2>
          <p>
            Four finishes change the material colors through CSS variables.
            The swatches sit outside the card so the object stays the focus.
            Moving the pointer shifts a soft reflection across the glass, the
            lights update their readout, and the clock uses the visitor’s
            local time.
          </p>
          <p>
            The device and screen scale together as the card gets smaller.
            Motion respects reduced-motion preferences, and the clock updates
            only while the concept is in view. The result pairs a fixed,
            detailed illustration with a small layer of live behavior.
          </p>
        </section>

        <footer className={styles.footer}>
          <Link href="/#archive-title">Back to Archive</Link>
          <span>Matthieu Duchatellier</span>
        </footer>
      </article>
    </main>
  )
}
