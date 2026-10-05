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
  RewriteReview,
  ToneInContext,
} from "../ux-writing-lab"
import styles from "../article.module.css"

const articles = {
  "ux-writing": {
    title: "Write the interface",
    description:
      "Learn to write labels, buttons, and messages that help people use your product. Practice with ten short exercises.",
  },
  "ai-design-engineer": {
    title: "From Prompt to Product",
    description:
      "A hands-on introduction to prompting, building, and refining interfaces with AI.",
  },
  "ai-product-manager": {
    title: "The AI-Augmented Product Manager",
    description:
      "A practical guide for PMs using AI to sharpen discovery, decisions, and delivery.",
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
        <h2 id="start-title">Help people take the next step</h2>
        <p>
          UX writing helps people understand what a product does and how to use
          it. A button names an action. A field label explains what to enter. An
          error message helps someone recover when a task fails.
        </p>
        <p>
          Compare “Submit” with “Save changes.” The second label tells you what
          will happen. That is the job of interface copy: give people enough
          information to act with confidence.
        </p>
        <p>
          Use this guide to choose clearer labels, write helpful messages, and
          review a product flow. Try the exercises as you go, or read through
          first. All examples are for practice.
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
        <h2 id="microcopy-title">Recognize microcopy</h2>
        <p>
          <strong>Microcopy</strong> is the short text that guides an
          interaction. Its purpose matters more than its length: a slogan
          attracts attention, while a password hint helps someone finish a task.
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
            "Success message",
            "Title",
            "Button label",
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
          These words appear in apps, websites, kiosks, and voice assistants. At
          each step, ask: what does the person need to know now, and what can
          they do next?
        </p>
      </section>

      <Exercise
        id="find-the-microcopy"
        title="Find the microcopy"
        introduction="Choose the examples that help someone use a product. You can select more than one."
      >
        <MicrocopyMap />
      </Exercise>

      <section
        id="product-team"
        className={styles.prose}
        aria-labelledby="team-title"
      >
        <h2 id="team-title">Write while you design</h2>
        <p>
          UX writers work closely with designers, product managers, researchers,
          developers, support, and marketing. Start with the user’s goal and
          write the copy while the flow is still taking shape.
        </p>
        <div className={styles.lifecycle}>
          <article className={styles.infoCard}>
            <span>Discover</span>
            <p>Listen to users. Collect their words and questions.</p>
          </article>
          <article className={styles.infoCard}>
            <span>Build</span>
            <p>Write in the prototype. Check each action and state.</p>
          </article>
          <article className={styles.infoCard}>
            <span>Deliver</span>
            <p>Test understanding. Improve and document the copy.</p>
          </article>
        </div>
        <p>
          Review the flow together. Can someone skip this step? What happens if
          saving fails? Does “Delete” mean permanent deletion? Agree on the
          behavior before writing a promise the product cannot keep.
        </p>
      </section>

      <section
        id="principles"
        className={styles.prose}
        aria-labelledby="principles-title"
      >
        <h2 id="principles-title">Give every word a job</h2>
        <p>
          Review your draft in four passes. Start with what the person needs,
          then make the wording shorter, more natural, and easier to understand.
        </p>
        <div className={styles.principles}>
          <div className={styles.infoCard}>
            <strong>Purposeful</strong>
            <small>Does it help someone decide, act, or recover?</small>
          </div>
          <div className={styles.infoCard}>
            <strong>Concise</strong>
            <small>Can you cut words without losing needed context?</small>
          </div>
          <div className={styles.infoCard}>
            <strong>Conversational</strong>
            <small>Would you say this to someone asking for help?</small>
          </div>
          <div className={styles.infoCard}>
            <strong>Clear</strong>
            <small>Will people understand what happens next?</small>
          </div>
        </div>
        <p>
          Shorter is not always clearer. “File too large” names the problem.
          “Choose a file under 10 MB” also explains how to fix it. Keep the
          details someone needs to finish the task.
        </p>
      </section>

      <Exercise
        id="choose-good-over-vague"
        title="Choose a helpful error message"
        introduction="Compare the messages. Which one explains what to do next?"
      >
        <GoodOrBad />
      </Exercise>

      <Exercise
        id="replace-the-jargon"
        title="Replace the jargon"
        introduction="Rewrite this sign-in error in everyday language. Explain the problem and give a next step."
      >
        <RewriteReview />
      </Exercise>

      <section
        id="structure"
        className={styles.prose}
        aria-labelledby="structure-title"
      >
        <h2 id="structure-title">Put the important words first</h2>
        <p>
          Put the most important information first. Use short sentences, active
          voice, and familiar words. If a technical term is essential, explain
          it where it appears. If it is not essential, replace it.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>Lead with the action</span> “To continue, you will need to
            verify your email” becomes “Verify your email to continue.”
          </p>
          <p>
            <span>Use active voice</span> “An invitation will be sent by us”
            becomes “We’ll send an invitation.”
          </p>
          <p>
            <span>Use everyday words</span> “Initiate data export” becomes
            “Export your data.”
          </p>
          <p>
            <span>Write for translation</span> “You’re good to go” becomes “Your
            account is ready.” Avoid idioms and wordplay.
          </p>
        </div>
      </section>

      <Exercise
        id="keep-one-name"
        title="Keep one name"
        introduction="A workspace, project, and space may sound like different things. Keep one name for the same concept."
      >
        <ConsistencyCheck />
      </Exercise>

      <section
        id="components"
        className={styles.prose}
        aria-labelledby="components-title"
      >
        <h2 id="components-title">Match the words to the component</h2>
        <p>
          Start with the question someone has at that moment. What will this
          button do? Why is this list empty? Did my changes save? Use the
          component to answer it.
        </p>
        <div className={styles.componentRules}>
          <article className={styles.infoCard}>
            <strong>Button</strong>
            <p>
              Name the action and object: “Save changes” or “Download invoice.”
            </p>
          </article>
          <article className={styles.infoCard}>
            <strong>Loading</strong>
            <p>
              Describe the current task: “Uploading your file…” Only show
              progress you can measure.
            </p>
          </article>
          <article className={styles.infoCard}>
            <strong>Onboarding</strong>
            <p>Explain one useful step: “Choose a language to find lessons.”</p>
          </article>
          <article className={styles.infoCard}>
            <strong>Empty state</strong>
            <p>
              Explain what belongs here: “No saved places yet. Save a place to
              find it here later.”
            </p>
          </article>
          <article className={styles.infoCard}>
            <strong>Success</strong>
            <p>
              Confirm the result: “Changes saved.” Add a next step only if one
              is needed.
            </p>
          </article>
          <article className={styles.infoCard}>
            <strong>Error</strong>
            <p>
              Name the problem and a way forward: “Upload failed. Choose a file
              under 10 MB.”
            </p>
          </article>
        </div>
        <p>
          Put essential instructions beside the action. Give form fields visible
          labels, and keep requirements outside placeholders that disappear
          during typing. Offer extra detail when it is useful.
        </p>
        <p>
          For errors, explain the cause only when you know it. Say what was
          saved or charged only when the product can confirm it. Before a
          permanent action, state the consequence and name both choices: “Delete
          draft” and “Keep draft.”
        </p>
      </section>

      <Exercise
        id="make-the-cta-tell-the-truth"
        title="Name the button’s action"
        introduction="Choose a label that matches what the button actually does."
      >
        <MatchTheAction />
      </Exercise>

      <Exercise
        id="build-an-error-message"
        title="Build an error message"
        introduction="Choose the details someone needs after a failed payment. Then review an example message."
      >
        <BuildAnErrorMessage />
      </Exercise>

      <section
        id="audit"
        className={styles.prose}
        aria-labelledby="audit-title"
      >
        <h2 id="audit-title">Test the words in the flow</h2>
        <p>
          A UX writing audit reviews a complete journey, not isolated sentences.
          Capture the screen, component, current copy, user goal, issue,
          proposed change, and evidence. Fix the problems that prevent someone
          from finishing before polishing less important wording.
        </p>
        <p>
          Test important language in a prototype with the people who will use
          it. Watch whether they understand the state, predict the action, and
          recover from problems. For high-volume decisions, compare variants
          with an A/B test. For example, test whether a clearer booking label
          helps people find a room. Check completed bookings and accidental
          actions as well as clicks.
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
        title="Find the copy problems"
        introduction="Review this error screen. Select every issue that makes it harder to understand or recover."
      >
        <AuditTheFlow />
      </Exercise>

      <section
        id="research"
        className={styles.prose}
        aria-labelledby="research-title"
      >
        <h2 id="research-title">Use words your readers recognize</h2>
        <p>
          Good interface language begins with evidence: interviews, support
          conversations, search queries, reviews, usability sessions, and the
          words people already use. Collect repeated phrases and the context in
          which they appear. Use them to propose labels, then test whether other
          people understand those labels in the product.
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
        introduction="Read the fictional research excerpts. Choose a label that reflects the words these people use."
      >
        <FindUserLanguage />
      </Exercise>

      <section
        id="voice"
        className={styles.prose}
        aria-labelledby="voice-title"
      >
        <h2 id="voice-title">Adjust the tone to the situation</h2>
        <p>
          Voice is the product’s consistent personality. Tone adapts that voice
          to the situation. A celebration can be energetic; a payment problem
          should be calm and specific. Consider the person’s goal, likely
          concerns, and the consequences of the action.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>Routine task</span> Be brief: “Changes saved.”
          </p>
          <p>
            <span>First use</span> Explain the benefit: “Save a place to find it
            before your trip.”
          </p>
          <p>
            <span>Something failed</span> Give a recovery step: “We couldn’t
            load your places. Try again.”
          </p>
          <p>
            <span>Permanent action</span> State the consequence: “Delete this
            list? You can’t undo this.”
          </p>
        </div>
        <p>
          Document your voice with examples. If it is clear, warm, and direct,
          show how those qualities work in a welcome, an error, and a
          confirmation. Keep humor out of moments when someone may lose work or
          money.
        </p>
      </section>

      <Exercise
        id="tune-the-tone-to-the-moment"
        title="Choose a tone that fits"
        introduction="Try both situations. Choose a message that respects how the person may be feeling."
      >
        <ToneInContext />
      </Exercise>

      <section
        id="content-system"
        className={styles.prose}
        aria-labelledby="system-title"
      >
        <h2 id="system-title">Document the decisions you repeat</h2>
        <p>
          A content design system is the shared source of truth for interface
          language. Start with the decisions your team keeps making: which terms
          to use, how to explain errors, and what each button should say.
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
            buttons, and notifications.
          </p>
          <p>
            <span>Maintenance</span> Who reviews changes, when to update the
            guidance, and where to record decisions.
          </p>
        </div>
        <p>
          A glossary entry can be simple: “Saved places” means places someone
          has bookmarked. Use it in navigation and headings; avoid “Repository”
          for the same feature. Include the reason, an owner, and a review date.
        </p>
      </section>

      <section
        id="inclusive"
        className={styles.prose}
        aria-labelledby="inclusive-title"
      >
        <h2 id="inclusive-title">Remove barriers to understanding</h2>
        <p>
          Accessible UX writing uses plain language, descriptive labels, short
          sentences, and context that does not depend on vision, color, or prior
          knowledge. Check whether someone can understand the task while using a
          screen reader, reading in a second language, or working in a hurry.
        </p>
        <p>
          Do not communicate meaning through color, position, sound, or imagery
          alone. Write links and buttons that make sense out of context. Name
          the field with a visible label. Explain errors next to the affected
          input.
        </p>
        <div className={styles.ruleList}>
          <p>
            <span>Name the destination</span> Replace “Click here” with “Read
            the delivery policy.”
          </p>
          <p>
            <span>Keep labels visible</span> Use “Email address” as the label
            and “name@example.com” as an optional example.
          </p>
          <p>
            <span>Explain the fix</span> Replace “Invalid date” with “Choose a
            date in the future.”
          </p>
          <p>
            <span>Include text cues</span> Mark fields “Required” in text, even
            if you also use color.
          </p>
          <p>
            <span>Break up instructions</span> Put each action in its own step.
            Use headings that describe the task.
          </p>
        </div>
        <p>
          Inclusion goes further than technical access. Avoid assumptions about
          gender, relationships, ability, culture, or available resources. Ask
          only for information the task truly needs, and do not encode a
          presumed user into labels or defaults. “Emergency contact” leaves room
          for more relationships than “Husband or wife.”
        </p>
        <p>
          In a voice or conversational interface, language becomes the
          interface. Explain what it understood, confirm consequential actions,
          and let people correct mistakes.
        </p>
      </section>

      <Exercise
        id="remove-the-barrier"
        title="Remove the barrier"
        introduction="Compare two form instructions. Choose the one people can understand without seeing color."
      >
        <AccessibilityPass />
      </Exercise>

      <section
        id="ai-practice"
        className={styles.prose}
        aria-labelledby="ai-title"
      >
        <h2 id="ai-title">Use AI to draft alternatives</h2>
        <p>
          AI can generate alternatives, challenge a tone, simplify complex text,
          group feedback, or help review a flow. Give it the user’s goal, the
          product’s actual behavior, the component, and any constraints. Include
          examples of your voice and preferred terms.
        </p>
        <p>
          Treat every output as a draft. Verify the product behavior, source
          claims, accessibility, terminology, tone, and privacy before anything
          ships. A strong workflow asks for several options, compares them
          against explicit criteria, and improves the brief from the failures.
        </p>
      </section>

      <section className={styles.takeaway} aria-labelledby="takeaway-title">
        <h2 id="takeaway-title">Try it on one screen</h2>
        <p>
          Choose a screen in your product. Write down what someone needs to do,
          revise the words that might slow them down, and ask another person
          what they expect to happen next.
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
