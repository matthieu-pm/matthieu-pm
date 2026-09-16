import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { siteConfig } from "../../site-config"
import { ArticleControls } from "../article-controls"
import {
  GoodOrBad,
  MatchTheAction,
  MicrocopyMap,
  RewriteScore,
  ToneInContext,
} from "../ux-writing-lab"
import styles from "../article.module.css"

const articles = {
  "ux-writing": {
    title: "Write the Interface",
    description:
      "A beginner’s guide to UX writing, with five interactive exercises for clearer product experiences.",
  },
  "ai-design-engineer": {
    title: "From Prompt to Product",
    description:
      "A beginner’s guide to using AI as a design engineer—from first sketch to polished interface.",
  },
  "ai-product-manager": {
    title: "The AI-Augmented Product Manager",
    description:
      "A beginner’s guide to using AI for product discovery, clearer decisions, and faster delivery.",
  },
} as const

type ArticleSlug = keyof typeof articles

function isArticleSlug(slug: string): slug is ArticleSlug {
  return slug in articles
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!isArticleSlug(slug)) return {}

  const article = articles[slug]
  const path = `/writing/${slug}`

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: path,
      siteName: siteConfig.name,
      images: [siteConfig.socialPreview.path],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [siteConfig.socialPreview.path],
    },
  }
}

function ArticleHeader({ slug }: { slug: ArticleSlug }) {
  const article = articles[slug]

  return (
    <>
      <ArticleControls pageUrl={`${siteConfig.url}/writing/${slug}`} />
      <header className={styles.hero}>
        <h1>{article.title}</h1>
        <p className={styles.lead}>{article.description}</p>
        <div className={styles.byline}>
          <span>By Matthieu Duchatellier</span>
          <span>{slug === "ux-writing" ? "14 min read" : "6 min read"}</span>
        </div>
      </header>
    </>
  )
}

function Exercise({
  id,
  title,
  introduction,
  children,
}: {
  id: string
  title: string
  introduction: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.exercise} aria-labelledby={id}>
      <div className={styles.exerciseHeading}>
        <div>
          <h2 id={id}>{title}</h2>
          <p>{introduction}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function UxWritingArticle() {
  return (
    <>
      <section className={styles.prose} aria-labelledby="start-title">
        <h2 id="start-title">Words are part of the interface.</h2>
        <p>
          UX writing is writing for the user experience. It covers every word
          that helps someone understand and use a product: buttons, labels,
          onboarding, empty states, notifications, tooltips, errors, and more.
        </p>
        <p>
          The goal is not to decorate a screen. It is to put the right words in
          the right place, at the right time, with the right tone—so the product
          feels clear, confident, and easy to use.
        </p>
      </section>

      <nav className={styles.contents} aria-label="Article contents">
        <span>In this guide</span>
        <a href="#microcopy">Find the microcopy</a>
        <a href="#product-team">Work with the product team</a>
        <a href="#principles">Write clear, concise, useful copy</a>
        <a href="#components">Write for the component</a>
        <a href="#voice">Adapt voice and tone</a>
        <a href="#inclusive-ai">Stay inclusive and use AI wisely</a>
      </nav>

      <section id="microcopy" className={styles.prose} aria-labelledby="microcopy-title">
        <h2 id="microcopy-title">UX writing lives where people act.</h2>
        <p>
          Marketing copy earns attention. Editorial content informs. UX writing
          supports an interaction. It appears in small, contextual pieces of
          language often called <strong>microcopy</strong>.
        </p>
        <div className={styles.componentCloud} aria-label="Examples of microcopy">
          {[
            "Onboarding",
            "Empty state",
            "Notification",
            "Tooltip",
            "Toast",
            "Title",
            "CTA",
            "Confirmation",
            "Label",
            "Progress update",
            "Alert",
            "Transactional email",
          ].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <Exercise
        id="find-the-microcopy"
        title="Find the microcopy"
        introduction="UX writing is defined by where the words live and the job they do."
      >
        <MicrocopyMap />
      </Exercise>

      <section id="product-team" className={styles.prose} aria-labelledby="team-title">
        <h2 id="team-title">Do not wait for the final screen.</h2>
        <p>
          UX writers work closely with designers, product managers, researchers,
          developers, support, and marketing. They contribute across the product
          cycle—not as a final proofreading step.
        </p>
        <div className={styles.lifecycle}>
          <article><span>Discover</span><p>User interviews, verbatim analysis, UX audits.</p></article>
          <article><span>Build</span><p>Prototypes, microcopy, glossary, voice and tone.</p></article>
          <article><span>Deliver</span><p>User testing, A/B tests, measurement, iteration.</p></article>
        </div>
      </section>

      <section id="principles" className={styles.prose} aria-labelledby="principles-title">
        <h2 id="principles-title">Clear. Concise. Useful.</h2>
        <p>
          These three principles are the fastest way to assess interface copy.
          If the words fail one of them, the experience creates friction.
        </p>
        <div className={styles.principles}>
          <div className={styles.principleCard}><strong>Clear</strong><small>Use familiar language. Avoid jargon and ambiguity.</small></div>
          <div className={styles.principleCard}><strong>Concise</strong><small>Remove filler without removing necessary context.</small></div>
          <div className={styles.principleCard}><strong>Useful</strong><small>Anticipate the next question and show the way forward.</small></div>
        </div>
        <div className={styles.ruleList}>
          <p><span>Use active voice</span> Name who does what.</p>
          <p><span>Sound natural</span> Write like a calm, helpful person.</p>
          <p><span>Plan for translation</span> Avoid wordplay that breaks across languages.</p>
          <p><span>Stay consistent</span> One concept should keep one name.</p>
        </div>
      </section>

      <Exercise
        id="choose-good-over-vague"
        title="Choose good over vague"
        introduction="Specific copy reduces uncertainty and makes recovery feel possible."
      >
        <GoodOrBad />
      </Exercise>

      <Exercise
        id="replace-the-jargon"
        title="Replace the jargon"
        introduction="Rewrite the message. Your score rewards plain language, brevity, and a concrete next step."
      >
        <RewriteScore />
      </Exercise>

      <section id="components" className={styles.prose} aria-labelledby="components-title">
        <h2 id="components-title">Every component asks a different question.</h2>
        <p>
          A CTA predicts an action. An error helps someone recover. An empty
          state explains what belongs here. Loading copy manages waiting. Good
          UX writing begins with the component’s job, not a clever sentence.
        </p>
        <div className={styles.componentRules}>
          <article className={styles.componentRule}><strong>CTA</strong><p>What will happen when I select this?</p></article>
          <article className={styles.componentRule}><strong>Error</strong><p>What happened, and how can I recover?</p></article>
          <article className={styles.componentRule}><strong>Empty state</strong><p>Why is this empty, and how do I begin?</p></article>
          <article className={styles.componentRule}><strong>Loading</strong><p>What is happening, and should I wait?</p></article>
        </div>
      </section>

      <Exercise
        id="make-the-cta-tell-the-truth"
        title="Make the CTA tell the truth"
        introduction="A button label is a promise about what will happen after the click."
      >
        <MatchTheAction />
      </Exercise>

      <section id="voice" className={styles.prose} aria-labelledby="voice-title">
        <h2 id="voice-title">Your voice stays. Your tone moves.</h2>
        <p>
          Voice is the product’s consistent personality. Tone adapts that voice
          to the situation. A celebration can be energetic; a payment problem
          should be calm. The user’s emotional state decides the volume.
        </p>
        <blockquote>
          <p>When you try to speak to everyone, you end up speaking to no one.</p>
        </blockquote>
      </section>

      <Exercise
        id="tune-the-tone-to-the-moment"
        title="Tune the tone to the moment"
        introduction="Keep the same clear, human voice while adjusting the energy to fit the situation."
      >
        <ToneInContext />
      </Exercise>

      <section id="inclusive-ai" className={styles.prose} aria-labelledby="inclusive-title">
        <h2 id="inclusive-title">Make the system clearer for everyone.</h2>
        <p>
          Accessible UX writing uses plain language, descriptive labels, short
          sentences, and context that does not depend on vision, color, or prior
          knowledge. Inclusivity is not a tone—it is the removal of barriers.
        </p>
        <p>
          As products grow, capture decisions in a content design system: a
          glossary, voice chart, reusable microcopy, accessibility rules, and
          component guidelines. This keeps the experience consistent across
          teams and channels.
        </p>
        <div className={styles.aiNote}>
          <span>Using AI wisely</span>
          <p>
            AI is useful for alternatives, tone exploration, plain-language
            checks, research synthesis, and audits. Give it the user, context,
            goal, constraints, and desired format. Then verify every suggestion
            against the interface and your content standards.
          </p>
          <strong>Generate options. Keep the judgment.</strong>
        </div>
      </section>

      <section className={styles.takeaway} aria-labelledby="takeaway-title">
        <span>Keep this</span>
        <h2 id="takeaway-title">The right words. The right moment.</h2>
        <p>
          Know the user, the component, the context, and the next action. Write
          clearly, remove what is unnecessary, and test whether the result truly helps.
        </p>
      </section>

      <p className={styles.sourceNote}>
        Adapted from the course presentation{" "}
        <a
          href="https://canva.link/cours-ux-writing-25-26-en"
          target="_blank"
          rel="noreferrer"
        >
          Introduction to User Experience Writing
        </a>.
      </p>
    </>
  )
}

function AiDesignEngineerArticle() {
  return (
    <div className={styles.guideBody}>
      <section className={styles.prose}>
        <h2>AI is a fast collaborator, not an art director.</h2>
        <p>
          Use it to create options, translate intent into code, and inspect the
          result. Keep the taste, constraints, and final judgment with you.
        </p>
      </section>
      <section className={styles.steps} aria-label="AI design engineering workflow">
        <article><h2>Start with a visual brief</h2><p>Name the user, the job, the mood, the hierarchy, and the constraints. A precise brief beats a long prompt.</p></article>
        <article><h2>Ask for different directions</h2><p>Generate three meaningfully different approaches before polishing one. Compare structure, not decoration.</p></article>
        <article><h2>Build in small slices</h2><p>Move from layout to components to states. Review each slice in the browser before adding more.</p></article>
        <article><h2>Critique with evidence</h2><p>Check screenshots at real breakpoints. Ask what is unclear, inconsistent, inaccessible, or visually weak.</p></article>
        <article><h2>Polish by hand</h2><p>Fix spacing, type, motion, focus states, and edge cases. AI gets you to a draft; craft gets you to done.</p></article>
      </section>
    </div>
  )
}

function AiProductManagerArticle() {
  return (
    <div className={styles.guideBody}>
      <section className={styles.prose}>
        <h2>Use AI to widen the work, not outsource the decision.</h2>
        <p>
          AI can compress research, challenge assumptions, and sharpen product
          artifacts. Your job is still to supply context and own the tradeoffs.
        </p>
      </section>
      <section className={styles.steps} aria-label="AI product management workflow">
        <article><h2>Give it the real context</h2><p>Share the goal, user, constraints, evidence, and open questions. Generic context creates generic advice.</p></article>
        <article><h2>Synthesize, then verify</h2><p>Use AI to cluster interviews or feedback, but trace every important claim back to the source.</p></article>
        <article><h2>Generate counterarguments</h2><p>Ask what would make the idea fail, which assumption is weakest, and what cheaper test could prove it.</p></article>
        <article><h2>Draft sharper artifacts</h2><p>Turn decisions into briefs, specs, test plans, and release notes. Edit for product truth and team clarity.</p></article>
        <article><h2>Keep a decision log</h2><p>Record the evidence, tradeoff, owner, and revisit date. AI is most useful when the reasoning stays visible.</p></article>
      </section>
    </div>
  )
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isArticleSlug(slug)) notFound()

  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <ArticleHeader slug={slug} />
        {slug === "ux-writing" && <UxWritingArticle />}
        {slug === "ai-design-engineer" && <AiDesignEngineerArticle />}
        {slug === "ai-product-manager" && <AiProductManagerArticle />}
        <footer className={styles.footer}>
          <Link href="/">Matthieu Duchatellier</Link>
          <span>Writing about product, design, and AI.</span>
        </footer>
      </div>
    </main>
  )
}
