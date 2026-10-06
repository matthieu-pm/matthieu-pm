// Rename to page.tsx to make this showcase publicly accessible again.
import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "../../site-config"
import { BetDemo, HeaderControls, InstallCommand } from "./controls"
import styles from "./showcase.module.css"

const title = "Product Bet — Matthieu Duchatellier"
const description =
  "Turn a promising idea into a bounded, testable investment decision. An agent skill for product managers, founders, and product engineers."
const path = "/skills/product-bet"
const source = "https://github.com/matthieu-pm/product-bet"

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

const alternatives = [
  [
    "AI-assisted concierge summary",
    "Learn whether a reviewed summary helps before automating it.",
    true,
  ],
  [
    "Rules-based activity digest",
    "Aggregate changes with less interpretation; may still leave too much noise.",
    false,
  ],
  [
    "Owner-written updates",
    "Ask project owners for structured updates; adds recurring work for the team.",
    false,
  ],
  [
    "Keep the current workflow",
    "No new investment, but no deliberate test of the idea’s value.",
    false,
  ],
] as const

const decisions = [
  [
    "Supported",
    "Test automation feasibility.",
    "Managers use the summaries and describe a concrete planning benefit.",
  ],
  [
    "Unsupported",
    "Revisit the problem.",
    "Summaries go unused or duplicate an existing workflow.",
  ],
  [
    "Harmful",
    "Stop the test.",
    "Sensitive information is exposed or an error causes a consequential wrong decision.",
  ],
  [
    "Invalid",
    "Repair the test.",
    "Delivery timing or missing source access prevents evaluation.",
  ],
  [
    "Inconclusive",
    "Investigate the uncertainty.",
    "Interview participants and revise the target situation before another test.",
  ],
] as const

export default function ProductBetPage() {
  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <HeaderControls pageUrl={`${siteConfig.url}${path}`} />
        <header className={styles.hero}>
          <h1>/product-bet</h1>
          <p className={styles.lead}>
            Turn a promising idea into a bounded, testable investment decision.
          </p>
          <p>
            For product managers, founders, and product engineers deciding what
            to build next.
          </p>
          <InstallCommand />
          <nav className={styles.links} aria-label="Skill resources">
            <a href="#example">
              See an example <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </header>

        <section
          id="example"
          className={styles.example}
          aria-label="Product Bet example"
        >
          <BetDemo
            raw={
              <div className={styles.rawIdea}>
                <p>“We should add AI-generated weekly summaries.”</p>
                <span className={styles.rawNote}>
                  Who needs this? What do we know? How much should we invest?
                </span>
              </div>
            }
            shaped={
              <div className={styles.shapedBet}>
                <div className={styles.artifactHeader}>
                  <span className={styles.badge}>Exploratory</span>
                </div>
                <h2>Test useful weekly summaries</h2>
                <p>
                  Help managers enter weekly planning with a trustworthy view of
                  changes, blockers, and decisions.
                </p>
                <dl className={styles.previewFacts}>
                  <div>
                    <dt>Investment</dt>
                    <dd>One setup week · one owner · two weekly cycles</dd>
                  </div>
                  <div>
                    <dt>Riskiest assumption</dt>
                    <dd>
                      Managers will trust and use a synthesized weekly view.
                    </dd>
                  </div>
                  <div>
                    <dt>First test</dt>
                    <dd>
                      Human-reviewed summaries for five opted-in managers.
                    </dd>
                  </div>
                </dl>
                <div className={styles.recommendation}>
                  ↳ Proceed to the concierge test
                </div>
              </div>
            }
          />
        </section>

        <section className={styles.section} aria-labelledby="evidence-title">
          <h2 id="evidence-title">Know what you know.</h2>
          <p>
            Before building summaries, check whether managers need them and
            whether the available project data can make them useful.
          </p>
          <div className={styles.surface}>
            <div className={styles.claim}>
              <span className={`${styles.badge} ${styles.amber}`}>
                Needs testing
              </span>
              <p>Managers spend meaningful time assembling weekly status.</p>
            </div>
            <div className={styles.claim}>
              <span className={`${styles.badge} ${styles.amber}`}>
                Needs testing
              </span>
              <p>
                Tasks and comments contain enough context for a useful summary.
              </p>
            </div>
            <div className={styles.claim}>
              <span className={styles.badge}>Not yet measured</span>
              <p>Current preparation time and the cost of missing an update.</p>
            </div>
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="alternatives-title"
        >
          <h2 id="alternatives-title">Give the idea some competition.</h2>
          <p>
            Compare different ways to solve the problem, including doing
            nothing.
          </p>
          <div className={styles.surface}>
            {alternatives.map(([name, detail, selected]) => (
              <div
                className={`${styles.option} ${selected ? styles.selected : ""}`}
                key={name}
              >
                <span className={styles.optionIndicator} aria-hidden="true">
                  {selected ? "✓" : "—"}
                </span>
                <div>
                  <h3>
                    {name}
                    {selected && (
                      <span className={styles.selectedLabel}>
                        Selected for test
                      </span>
                    )}
                  </h3>
                  <p>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="scope-title">
          <h2 id="scope-title">Make the investment finite.</h2>
          <p>
            Define the smallest intervention that can deliver value and test the
            idea.
          </p>
          <div className={styles.surface}>
            <dl className={styles.scopeGrid}>
              <div>
                <dt>Owner</dt>
                <dd>1 PM / design engineer</dd>
              </div>
              <div>
                <dt>Setup</dt>
                <dd>1 week</dd>
              </div>
              <div>
                <dt>Participants</dt>
                <dd>5 opted-in managers</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>2 weekly cycles</dd>
              </div>
            </dl>
            <div className={styles.scopeNote}>
              <strong>Quality bar</strong>
              <p>
                Human review and source links for every claim. Only opted-in
                projects; no automatic sending.
              </p>
            </div>
            <div className={styles.scopeNote}>
              <strong>Outside this test</strong>
              <p>
                Production integration, cross-workspace data, and automated
                recommendations.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="rules-title">
          <h2 id="rules-title">Decide what each result means.</h2>
          <p>
            Agree on the next move before running the test. Establish the
            preparation baseline during screening.
          </p>
          <div className={styles.surface}>
            {decisions.map(([outcome, action, condition]) => (
              <div className={styles.rule} key={outcome}>
                <span>{outcome}</span>
                <div>
                  <h3>{action}</h3>
                  <p>{condition}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="maturity-title">
          <h2 id="maturity-title">Confidence has to be earned.</h2>
          <p>
            This bet stays Exploratory. Defining a test doesn’t validate the
            problem or its proposed solution.
          </p>
          <ol className={`${styles.surface} ${styles.maturity}`}>
            <li aria-current="step">
              <span className={styles.stepDot} />
              <div>
                <h3>
                  Exploratory <span className={styles.badge}>Current</span>
                </h3>
                <p>
                  The decision, target user, outcome, and assumptions are
                  explicit.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepDot} />
              <div>
                <h3>Plausible</h3>
                <p>
                  Needs direct evidence of the problem and support for the
                  proposed mechanism.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepDot} />
              <div>
                <h3>Ready to test</h3>
                <p>
                  Also requires a bounded intervention, appetite, test method,
                  guardrails, and decision rules.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepDot} />
              <div>
                <h3>Ready to commit</h3>
                <p>
                  Needs supporting validation, clear ownership, and
                  implementable measurement.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className={styles.section} aria-label="Install Product Bet">
          <InstallCommand />
        </section>

        <footer className={styles.footer}>
          <Link href="/">Matthieu Duchatellier</Link>
          <a href={source} target="_blank" rel="noreferrer">
            Source on GitHub ↗
          </a>
        </footer>
      </div>
    </main>
  )
}
