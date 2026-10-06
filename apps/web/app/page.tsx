import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { Suspense } from "react"

import { gitlabProfileUrl } from "@/lib/gitlab-activity"

import { EmailCopy } from "./email-copy"
import { GitLabActivity } from "./gitlab-activity"
import { InspirationsOrb } from "./inspirations/inspirations-orb"
import styles from "./page.module.css"

const contactButtonLabel = "Get in touch"
const contactButtonStaggerMs = 28

const capabilities = [
  {
    path: "/product-bet",
    description: "Shape product ideas into bounded, testable decisions.",
    href: "/skills/product-bet",
  },
  {
    path: "/great-ui",
    description: "Build and polish interfaces where every detail compounds.",
    href: "/skills/great-ui",
  },
]

const articles = [
  {
    title: "Write the interface",
    detail:
      "A practical guide to writing clear, useful, and consistent interface copy.",
    href: "/writing/ux-writing",
  },
  {
    title: "From Prompt to Product",
    detail:
      "A hands-on introduction to prompting, building, and refining interfaces with AI.",
    href: "/writing/ai-design-engineer",
  },
  {
    title: "The AI-Augmented Product Manager",
    detail:
      "A practical guide for PMs using AI to sharpen discovery, decisions, and delivery.",
    href: "/writing/ai-product-manager",
  },
]

function PageSkeleton() {
  return (
    <span className={styles.skillPageSkeleton}>
      <span className={styles.skillSkeletonTitle} />
      <span className={styles.skillSkeletonHero} />
      <span className={styles.skillSkeletonLine} />
      <span
        className={`${styles.skillSkeletonLine} ${styles.skillSkeletonLineShort}`}
      />
    </span>
  )
}

export default function Page() {
  return (
    <main className={styles.page}>
      <header className={styles.identity}>
        <div className={styles.avatar}>
          <Image
            className={styles.avatarImage}
            src="/images/matthieu-picture.webp"
            alt=""
            width={44}
            height={44}
            aria-hidden="true"
          />
        </div>
        <div>
          <h1>Matthieu Duchatellier</h1>
          <p>Product Manager · Design Engineer</p>
        </div>
      </header>

      <section className={styles.intro} aria-label="Introduction">
        <p>
          I&apos;m a Product Management & UX Design MSc student at{" "}
          <a
            className={styles.socialLink}
            href="https://www.skema.edu/en/programmes/msc-product-management-ux-design"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/skema.webp"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <strong>SKEMA</strong>
          </a>{" "}
          and{" "}
          <a
            className={styles.socialLink}
            href="https://www.polimi.it/en/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/polimi.webp"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <strong>Politecnico di Milano</strong>
          </a>
          . I care{" "}
          <em>
            <strong>deeply</strong>
          </em>{" "}
          about craft and building products people enjoy using. I like figuring
          out what to build, designing how it should work, and bringing it to
          life in code.
        </p>
        <p>
          Previously, I worked on growth and marketing at{" "}
          <a
            className={styles.socialLink}
            href="https://www.avico.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/avico-icon.webp"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <strong>Avico</strong>
          </a>{" "}
          and{" "}
          <a
            className={styles.socialLink}
            href="https://www.linkedin.com/in/matthieu-duchatellier/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>other</strong>
          </a>{" "}
          companies, and I&apos;m looking for an end-of-study PM or Design
          Engineer internship starting May 2027. You can reach me at{" "}
          <a
            className={styles.socialLink}
            href="https://x.com/matthieu_pm"
            target="_blank"
            rel="noreferrer"
          >
            <strong>@matthieu_pm</strong>
          </a>{" "}
          or via{" "}
          <strong>
            <EmailCopy />
          </strong>
          , and explore my code on{" "}
          <a
            className={styles.socialLink}
            href="https://gitlab.com/wondertale-dev"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/gitlab.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <strong>GitLab</strong>
          </a>
          .
        </p>
      </section>

      <section className={styles.section} aria-labelledby="work-title">
        <h2 id="work-title">Projects</h2>
        <div className={styles.projectGrid}>
          <a
            className={styles.projectCard}
            href="https://atlasapp.fr"
            target="_blank"
            rel="noreferrer"
          >
            <span
              className={`${styles.projectMark} ${styles.projectVisualMark}`}
              aria-hidden="true"
            >
              <Image
                className={styles.projectMarkImage}
                src="/logos/atlas.svg"
                alt=""
                width={80}
                height={80}
              />
            </span>
            <span>
              <strong>Atlas</strong>
              <small>AI-powered MCQ exam practice</small>
            </span>
          </a>
          <Link className={styles.projectCard} href="/inspirations">
            <span
              className={`${styles.projectMark} ${styles.projectVisualMark}`}
              aria-hidden="true"
            >
              <InspirationsOrb size={80} interactive={false} />
            </span>
            <span>
              <strong>My collection</strong>
              <small>Design tools, references, and resources.</small>
            </span>
          </Link>
          <a
            className={styles.projectCard}
            href="https://skema-project-learning.vercel.app/landing/index.html"
            target="_blank"
            rel="noreferrer"
          >
            <span
              className={`${styles.projectMark} ${styles.projectVisualMark}`}
              aria-hidden="true"
            >
              <Image
                className={`${styles.projectMarkImage} ${styles.lumaProjectMarkImage}`}
                src="/logos/luma-transparent.gif"
                alt=""
                width={192}
                height={208}
                unoptimized
              />
            </span>
            <span>
              <strong>Mimo</strong>
              <small>One-to-one language learning with a real teacher.</small>
            </span>
          </a>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-title">
        <h2 id="capabilities-title">Skills for agents</h2>
        <div className={styles.rowList}>
          {capabilities.map((capability) => (
            <Link
              href={capability.href}
              className={`${styles.detailRow} ${styles.skillLink}`}
              key={capability.path}
            >
              <span className={styles.rowIndex} aria-hidden="true">
                <PageSkeleton />
              </span>
              <div>
                <h3>{capability.path}</h3>
                <p>{capability.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="writing-title">
        <h2 id="writing-title">Writing</h2>
        <div className={styles.rowList}>
          {articles.map((article) => (
            <Link
              className={`${styles.detailRow} ${styles.skillLink}`}
              href={article.href}
              key={article.title}
            >
              <span className={styles.rowIndex} aria-hidden="true">
                <PageSkeleton />
              </span>
              <div>
                <h3>{article.title}</h3>
                <p>{article.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="activity-title">
        <div className={styles.activityHeading}>
          <h2 id="activity-title">Building, day by day</h2>
          <a href={gitlabProfileUrl} target="_blank" rel="noreferrer">
            <Image src="/logos/gitlab.svg" alt="" width={14} height={14} />
            GitLab <span aria-hidden="true">↗</span>
          </a>
        </div>
        <Suspense
          fallback={
            <p className={styles.activityStatus}>Loading GitLab activity…</p>
          }
        >
          <GitLabActivity />
        </Suspense>
      </section>

      <section
        className={`${styles.section} ${styles.contactSection}`}
        aria-labelledby="contact-title"
      >
        <h2 id="contact-title">Let&apos;s talk</h2>
        <p>
          I&apos;m open to product opportunities where I can bring together
          strategy, design, growth, and AI.
        </p>
        <div className={styles.contactBar}>
          <span className={styles.emailIdentity}>
            <Image
              className={styles.contactIcon}
              src="/logos/gmail.webp"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <span>mattduchatellier@gmail.com</span>
          </span>
          <a
            href="mailto:mattduchatellier@gmail.com"
            aria-label={contactButtonLabel}
          >
            <Image
              className={styles.contactButtonIcon}
              src="/icons/paper-plane-fast.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <span className={styles.contactButtonLabel} aria-hidden="true">
              {Array.from(contactButtonLabel).map((character, index) => {
                const visibleCharacter =
                  character === " " ? "\u00A0" : character

                return (
                  <span
                    className={styles.contactButtonLetter}
                    data-letter={visibleCharacter}
                    style={
                      {
                        "--letter-delay-in": `${
                          index * contactButtonStaggerMs
                        }ms`,
                        "--letter-delay-out": `${
                          (contactButtonLabel.length - index - 1) *
                          contactButtonStaggerMs
                        }ms`,
                      } as CSSProperties
                    }
                    key={`${character}-${index}`}
                  >
                    {visibleCharacter}
                  </span>
                )
              })}
            </span>
          </a>
        </div>
        <p className={styles.contactNote}>
          Or download my résumé. (
          <a
            href="/matthieu-duchatellier-resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            french version
          </a>
          {" / "}
          <a
            href="/english-resume-matthieu-duchatellier.pdf"
            target="_blank"
            rel="noreferrer"
          >
            english version
          </a>
          )
        </p>
      </section>

      <footer className={styles.footer}>
        <nav className={styles.footerSocials} aria-label="Social profiles">
          <a href="https://x.com/matthieu_pm" target="_blank" rel="noreferrer">
            <Image
              className={styles.footerSocialIcon}
              src="/logos/x.webp"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            X
          </a>
          <a
            href="https://www.producthunt.com/@mengde"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.footerSocialIcon}
              src="/logos/product-hunt.webp"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            ProductHunt
          </a>
          <a
            href="https://www.linkedin.com/in/matthieu-duchatellier/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.footerSocialIcon}
              src="/logos/linkedin.webp"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            LinkedIn
          </a>
          <a
            href="https://medium.com/@mengde-pm"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.footerSocialIconCrop} aria-hidden="true">
              <Image
                className={styles.footerSocialIconMedium}
                src="/logos/medium.webp"
                alt=""
                width={28}
                height={21}
              />
            </span>
            Medium
          </a>
        </nav>
        <span className={styles.footerSignatureFrame}>
          <Image
            className={styles.footerSignatureImage}
            src="/images/signature-matthieu.webp"
            alt="Matthieu Duchatellier signature"
            width={220}
            height={213}
          />
        </span>
      </footer>
    </main>
  )
}
