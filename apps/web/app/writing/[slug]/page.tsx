import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { siteConfig } from "../../site-config"
import { ArticleControls } from "../article-controls"
import {
  AccessibilityPass,
  AuditTheFlow,
  BuildAnErrorMessage,
  ConsistencyCheck,
  FindUserLanguage,
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
      "A complete beginner’s guide to UX writing—from microcopy and research to voice, accessibility, testing, and AI-assisted practice.",
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
        <p>
          That makes it different from marketing copy, which attracts attention,
          and editorial content, which informs. UX writing supports a task. A
          content designer works at the wider system level: planning,
          structuring, governing, and connecting content across the entire
          experience.
        </p>
        <p>
          The discipline grew from content strategy and the earliest
          conversational interfaces. Today it extends beyond screens into smart
          devices, kiosks, voice products, and any experience where language
          helps a person make a decision.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>UX writing</span> Shapes the words people use while completing
            a task.
          </p>
          <p>
            <span>Content design</span> Shapes the content structure, rules, and
            strategy around that task.
          </p>
        </div>
      </section>

      <section
        id="microcopy"
        className={styles.prose}
        aria-labelledby="microcopy-title"
      >
        <h2 id="microcopy-title">UX writing lives where people act.</h2>
        <p>
          Marketing copy earns attention. Editorial content informs. UX writing
          supports an interaction. It appears in small, contextual pieces of
          language often called <strong>microcopy</strong>.
        </p>
        <div
          className={styles.componentCloud}
          aria-label="Examples of microcopy"
        >
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
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p>
          The interface may be a website, an app, a smart device, a chatbot, a
          kiosk, or a voice assistant. The surface changes; the responsibility
          does not. The words must help someone know what is happening and what
          they can do next.
        </p>
      </section>

      <Exercise
        id="find-the-microcopy"
        title="Find the microcopy"
        introduction="UX writing is defined by where the words live and the job they do."
      >
        <MicrocopyMap />
      </Exercise>

      <section
        id="product-team"
        className={styles.prose}
        aria-labelledby="team-title"
      >
        <h2 id="team-title">Do not wait for the final screen.</h2>
        <p>
          UX writers work closely with designers, product managers, researchers,
          developers, support, and marketing. They contribute across the product
          cycle—not as a final proofreading step.
        </p>
        <div className={styles.lifecycle}>
          <article className={styles.infoCard}>
            <span>Discover</span>
            <p>User interviews, verbatim analysis, UX audits.</p>
          </article>
          <article className={styles.infoCard}>
            <span>Build</span>
            <p>Prototypes, microcopy, glossary, voice and tone.</p>
          </article>
          <article className={styles.infoCard}>
            <span>Deliver</span>
            <p>User testing, A/B tests, measurement, iteration.</p>
          </article>
        </div>
        <p>
          The writer and designer should work in the same file, inspect the same
          flow, and make decisions together. Space affects wording; wording
          affects hierarchy. Collaboration is the work, not a handoff around it.
        </p>
      </section>

      <section
        id="principles"
        className={styles.prose}
        aria-labelledby="principles-title"
      >
        <h2 id="principles-title">Clear. Concise. Useful.</h2>
        <p>
          These three principles are the fastest way to assess interface copy.
          If the words fail one of them, the experience creates friction.
        </p>
        <div className={styles.principles}>
          <div className={styles.infoCard}>
            <strong>Clear</strong>
            <small>Use familiar language. Avoid jargon and ambiguity.</small>
          </div>
          <div className={styles.infoCard}>
            <strong>Concise</strong>
            <small>Remove filler without removing necessary context.</small>
          </div>
          <div className={styles.infoCard}>
            <strong>Useful</strong>
            <small>
              Anticipate the next question and show the way forward.
            </small>
          </div>
        </div>
        <div className={styles.ruleList}>
          <p>
            <span>Use active voice</span> Name who does what.
          </p>
          <p>
            <span>Sound natural</span> Write like a calm, helpful person.
          </p>
          <p>
            <span>Plan for translation</span> Avoid wordplay that breaks across
            languages.
          </p>
          <p>
            <span>Stay consistent</span> One concept should keep one name.
          </p>
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

      <section
        id="structure"
        className={styles.prose}
        aria-labelledby="structure-title"
      >
        <h2 id="structure-title">
          Make the message understandable at first sight.
        </h2>
        <p>
          Put the most important information first. Use short sentences, active
          voice, and familiar words. If a technical term is essential, explain
          it where it appears. If it is not essential, replace it.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>Lead with the point</span> Do not make users read the setup
            before the answer.
          </p>
          <p>
            <span>Remove the unneeded</span> Cut repetition, greetings, and
            filler that delay action.
          </p>
          <p>
            <span>Write for translation</span> Avoid idioms, wordplay, and
            sentences built around English word order.
          </p>
          <p>
            <span>Name things once</span> A project should not become a
            workspace, space, or folder elsewhere.
          </p>
        </div>
      </section>

      <Exercise
        id="keep-one-name"
        title="Keep one name"
        introduction="Consistency reduces the amount of interface language a user has to learn."
      >
        <ConsistencyCheck />
      </Exercise>

      <section
        id="components"
        className={styles.prose}
        aria-labelledby="components-title"
      >
        <h2 id="components-title">
          Every component asks a different question.
        </h2>
        <p>
          A CTA predicts an action. An error helps someone recover. An empty
          state explains what belongs here. Loading copy manages waiting. Good
          UX writing begins with the component’s job, not a clever sentence.
        </p>
        <div className={styles.componentRules}>
          <article className={styles.infoCard}>
            <strong>CTA</strong>
            <p>Action + truthful outcome.</p>
          </article>
          <article className={styles.infoCard}>
            <strong>Loading</strong>
            <p>What is happening + whether to wait or act.</p>
          </article>
          <article className={styles.infoCard}>
            <strong>Onboarding</strong>
            <p>Benefit + one concept + visible progress.</p>
          </article>
          <article className={styles.infoCard}>
            <strong>Empty state</strong>
            <p>What belongs here + why it is empty + first action.</p>
          </article>
          <article className={styles.infoCard}>
            <strong>404</strong>
            <p>What happened + a route to something useful.</p>
          </article>
          <article className={styles.infoCard}>
            <strong>Error</strong>
            <p>Specific problem + recovery + alternative exit.</p>
          </article>
        </div>
        <p>
          Use progressive disclosure: reveal the minimum needed for the current
          decision, then offer deeper detail close by. A tooltip cannot rescue a
          vague label, and onboarding cannot compensate for a confusing product.
        </p>
      </section>

      <Exercise
        id="make-the-cta-tell-the-truth"
        title="Make the CTA tell the truth"
        introduction="A button label is a promise about what will happen after the click."
      >
        <MatchTheAction />
      </Exercise>

      <Exercise
        id="build-an-error-message"
        title="Build an error message"
        introduction="A useful error protects the user’s progress and makes recovery concrete."
      >
        <BuildAnErrorMessage />
      </Exercise>

      <section
        id="audit"
        className={styles.prose}
        aria-labelledby="audit-title"
      >
        <h2 id="audit-title">Treat copy as a product decision.</h2>
        <p>
          A UX writing audit reviews a complete journey, not isolated sentences.
          Capture the screen, component, current copy, user goal, issue,
          proposed change, and evidence. Repeated problems reveal the system
          work behind the individual fixes.
        </p>
        <p>
          Test important language in a prototype with the people who will use
          it. Watch whether they understand the state, predict the action, and
          recover from problems. For high-volume decisions, compare variants
          with an A/B test and measure the product outcome—not which sentence
          sounds nicer.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>Comprehension</span> Can people explain what the message
            means?
          </p>
          <p>
            <span>Prediction</span> Can they tell what a button will do before
            selecting it?
          </p>
          <p>
            <span>Recovery</span> Can they complete the next step without
            outside help?
          </p>
          <p>
            <span>Consistency</span> Does the flow use the same terms, tone, and
            patterns?
          </p>
        </div>
      </section>

      <Exercise
        id="audit-the-flow"
        title="Audit the flow"
        introduction="Look beyond grammar. Find the language problems that block understanding or action."
      >
        <AuditTheFlow />
      </Exercise>

      <section
        id="research"
        className={styles.prose}
        aria-labelledby="research-title"
      >
        <h2 id="research-title">Borrow language before you invent it.</h2>
        <p>
          Good interface language begins with evidence: interviews, support
          conversations, search queries, reviews, usability sessions, and the
          words people already use. Collect repeated phrases and the context in
          which they appear. That is semantic research.
        </p>
        <p>
          A useful persona is not a fictional biography. It captures the user’s
          goal, situation, knowledge, anxieties, and vocabulary. Write for the
          decisions that person needs to make in the product.
        </p>
      </section>

      <Exercise
        id="find-user-language"
        title="Find the user’s language"
        introduction="Repeated phrases from research can reveal the label people will recognize fastest."
      >
        <FindUserLanguage />
      </Exercise>

      <section
        id="voice"
        className={styles.prose}
        aria-labelledby="voice-title"
      >
        <h2 id="voice-title">Your voice stays. Your tone moves.</h2>
        <p>
          Voice is the product’s consistent personality. Tone adapts that voice
          to the situation. A celebration can be energetic; a payment problem
          should be calm. The user’s emotional state decides the volume.
        </p>
        <blockquote>
          <p>
            When you try to speak to everyone, you end up speaking to no one.
          </p>
        </blockquote>
        <p>
          Define voice with useful dimensions rather than loose adjectives. For
          example: direct rather than chatty, warm rather than playful, expert
          without sounding technical. For each dimension, show what “more” and
          “less” sound like in real components.
        </p>
      </section>

      <Exercise
        id="tune-the-tone-to-the-moment"
        title="Tune the tone to the moment"
        introduction="Keep the same clear, human voice while adjusting the energy to fit the situation."
      >
        <ToneInContext />
      </Exercise>

      <section
        id="content-system"
        className={styles.prose}
        aria-labelledby="system-title"
      >
        <h2 id="system-title">Turn good decisions into reusable guidance.</h2>
        <p>
          A content design system is the shared source of truth for interface
          language. It combines principles with examples teams can apply while
          designing and shipping—not a PDF that is opened once a year.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>Voice and tone</span> Principles, ranges, and examples for
            real situations.
          </p>
          <p>
            <span>Glossary</span> Approved terms, avoided terms, definitions,
            and translations.
          </p>
          <p>
            <span>Patterns</span> Guidance for errors, onboarding, empty states,
            CTAs, and notifications.
          </p>
          <p>
            <span>Governance</span> Owners, contribution rules, review rhythm,
            and version history.
          </p>
        </div>
        <p>
          Keep the system relevant by reviewing support requests, store reviews,
          social conversations, new devices, and emerging interaction patterns.
        </p>
      </section>

      <section
        id="inclusive"
        className={styles.prose}
        aria-labelledby="inclusive-title"
      >
        <h2 id="inclusive-title">Make the system clearer for everyone.</h2>
        <p>
          Accessible UX writing uses plain language, descriptive labels, short
          sentences, and context that does not depend on vision, color, or prior
          knowledge. Inclusivity is not a tone—it is the removal of barriers.
        </p>
        <p>
          Do not communicate meaning through color, position, sound, or imagery
          alone. Write links and buttons that make sense out of context. Name
          the field with a visible label. Explain errors next to the affected
          input.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>Reduce choices</span> Hick’s Law: remove or group competing
            decisions.
          </p>
          <p>
            <span>Make targets predictable</span> Fitts’s Law: labels should
            describe the action precisely.
          </p>
          <p>
            <span>Chunk information</span> Miller’s Law: break dense
            instructions into meaningful groups.
          </p>
          <p>
            <span>Use familiar patterns</span> Jakob’s Law: prefer language
            people already recognize.
          </p>
          <p>
            <span>Keep hierarchy simple</span> Prägnanz: make the main message
            and action easy to perceive.
          </p>
        </div>
        <p>
          Inclusion goes further than technical access. Avoid assumptions about
          gender, relationships, ability, culture, or available resources. Ask
          only for information the task truly needs, and do not encode a
          “normal” user into labels or defaults.
        </p>
        <p>
          In a voice or conversational interface, language becomes the
          interface. Design intents, repair paths, confirmations, and contextual
          responses. The user needs to know what the system understood and how
          to correct it.
        </p>
      </section>

      <Exercise
        id="remove-the-barrier"
        title="Remove the barrier"
        introduction="Accessible copy communicates the same meaning without relying on a single sense."
      >
        <AccessibilityPass />
      </Exercise>

      <section
        id="ai-practice"
        className={styles.prose}
        aria-labelledby="ai-title"
      >
        <h2 id="ai-title">Use AI to explore. Keep the judgment.</h2>
        <p>
          AI can generate alternatives, challenge a tone, simplify complex text,
          cluster feedback, or help audit a flow. It works best with a precise
          brief: user, context, goal, component, constraints, desired format,
          and examples from your content system.
        </p>
        <p>
          Treat every output as a draft. Verify the product behavior, source
          claims, accessibility, terminology, tone, and privacy before anything
          ships. A strong workflow asks for several options, compares them
          against explicit criteria, and improves the brief from the failures.
        </p>
      </section>

      <section className={styles.takeaway} aria-labelledby="takeaway-title">
        <span>Keep this</span>
        <h2 id="takeaway-title">The right words. The right moment.</h2>
        <p>
          Know the user, the component, the context, and the next action. Write
          clearly, remove what is unnecessary, and test whether the result truly
          helps.
        </p>
      </section>
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
      <section
        className={styles.steps}
        aria-label="AI design engineering workflow"
      >
        <article>
          <h2>Start with a visual brief</h2>
          <p>
            Name the user, the job, the mood, the hierarchy, and the
            constraints. A precise brief beats a long prompt.
          </p>
        </article>
        <article>
          <h2>Ask for different directions</h2>
          <p>
            Generate three meaningfully different approaches before polishing
            one. Compare structure, not decoration.
          </p>
        </article>
        <article>
          <h2>Build in small slices</h2>
          <p>
            Move from layout to components to states. Review each slice in the
            browser before adding more.
          </p>
        </article>
        <article>
          <h2>Critique with evidence</h2>
          <p>
            Check screenshots at real breakpoints. Ask what is unclear,
            inconsistent, inaccessible, or visually weak.
          </p>
        </article>
        <article>
          <h2>Polish by hand</h2>
          <p>
            Fix spacing, type, motion, focus states, and edge cases. AI gets you
            to a draft; craft gets you to done.
          </p>
        </article>
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
      <section
        className={styles.steps}
        aria-label="AI product management workflow"
      >
        <article>
          <h2>Give it the real context</h2>
          <p>
            Share the goal, user, constraints, evidence, and open questions.
            Generic context creates generic advice.
          </p>
        </article>
        <article>
          <h2>Synthesize, then verify</h2>
          <p>
            Use AI to cluster interviews or feedback, but trace every important
            claim back to the source.
          </p>
        </article>
        <article>
          <h2>Generate counterarguments</h2>
          <p>
            Ask what would make the idea fail, which assumption is weakest, and
            what cheaper test could prove it.
          </p>
        </article>
        <article>
          <h2>Draft sharper artifacts</h2>
          <p>
            Turn decisions into briefs, specs, test plans, and release notes.
            Edit for product truth and team clarity.
          </p>
        </article>
        <article>
          <h2>Keep a decision log</h2>
          <p>
            Record the evidence, tradeoff, owner, and revisit date. AI is most
            useful when the reasoning stays visible.
          </p>
        </article>
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
