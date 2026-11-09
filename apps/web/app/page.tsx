import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { EmailCopy } from "./email-copy"
import { InspirationsOrb } from "./inspirations/inspirations-orb"
import styles from "./page.module.css"

const contactButtonLabel = "Get in touch"
const contactButtonStaggerMs = 28

const technologies = {
  nextdotjs: "Next.js",
  react: "React",
  typescript: "TypeScript",
  tauri: "Tauri",
  convex: "Convex",
  vite: "Vite",
}

const projects: {
  name: string
  description: string
  href: string
  logo: string | null
  stack: (keyof typeof technologies)[]
}[] = [
  {
    name: "My collection",
    description: "Design tools and inspiration",
    href: "/inspirations",
    logo: null,
    stack: ["nextdotjs", "react", "typescript"],
  },
  {
    name: "Atlas",
    description: "AI-powered exam practice",
    href: "https://atlasapp.fr",
    logo: "/logos/atlas.svg",
    stack: ["nextdotjs", "convex", "react"],
  },
  {
    name: "Atrium",
    description: "AI-powered CRM",
    href: "https://atrium-landing-tau.vercel.app/",
    logo: "/logos/atrium.svg",
    stack: ["nextdotjs", "convex", "react"],
  },
  {
    name: "Carbon",
    description: "One app for your coding agents",
    href: "https://carbonhq.sh",
    logo: "/logos/carbon.svg",
    stack: ["tauri", "react", "typescript"],
  },
  {
    name: "Forge",
    description: "Issue tracking with AI agents",
    href: "https://forge-app-mauve.vercel.app",
    logo: "/logos/forge.svg",
    stack: ["vite", "react", "typescript"],
  },
  {
    name: "Researchie",
    description: "AI chat research form",
    href: "https://survey.matthieu-pm.chatgpt.site",
    logo: "/logos/researchie.svg",
    stack: ["nextdotjs", "react", "typescript"],
  },
]

const capabilities = [
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
    hidden: true,
  },
  {
    title: "The AI-Augmented Product Manager",
    detail:
      "A practical guide for PMs using AI to sharpen discovery, decisions, and delivery.",
    href: "/writing/ai-product-manager",
    hidden: true,
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
          I’m a Product Management & UX Design MSc student at{" "}
          <a
            className={styles.socialLink}
            href="https://www.skema.edu/en/programmes/msc-product-management-ux-design"
            target="_blank"
            rel="noreferrer"
          >
            <strong>SKEMA</strong>
          </a>{" "}
          and{" "}
          <a
            className={styles.socialLink}
            href="https://www.gsom.polimi.it/en"
            target="_blank"
            rel="noreferrer"
          >
            <strong>POLIMI</strong>
          </a>
          . I bring product thinking, design, and code together to turn ideas
          into useful, thoughtful experiences.
          <br />I enjoy understanding what people need, deciding what’s worth
          building, and shaping the details that make it feel right.
        </p>
        <p>
          Previously, I worked on growth and product design at{" "}
          <a
            className={styles.socialLink}
            href="https://www.avico.com/"
            target="_blank"
            rel="noreferrer"
          >
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
          companies, and I&apos;m open for a Product Manager or Design Engineer
          position starting June 2027.
        </p>
        <p>
          You can reach me at{" "}
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
          </strong>{" "}
          and explore my code on{" "}
          <a
            className={styles.socialLink}
            href="https://gitlab.com/wondertale-dev"
            target="_blank"
            rel="noreferrer"
          >
            <strong>GitLab</strong>
          </a>
          .
        </p>
      </section>

      <section
        className={`${styles.section} ${styles.projectsSection}`}
        aria-labelledby="work-title"
      >
        <h2 id="work-title">Projects</h2>
        <ul className={styles.projectList}>
          {projects.map((project) => (
            <li key={project.name}>
              <Link
                className={styles.projectRow}
                href={project.href}
                target={project.href.startsWith("/") ? undefined : "_blank"}
                rel={project.href.startsWith("/") ? undefined : "noreferrer"}
              >
                <span className={styles.projectMark} aria-hidden="true">
                  {project.logo ? (
                    <Image
                      className={styles.projectMarkImage}
                      src={project.logo}
                      alt=""
                      width={20}
                      height={20}
                    />
                  ) : (
                    <InspirationsOrb size={20} interactive={false} />
                  )}
                </span>
                <span className={styles.projectText}>
                  <strong>{project.name}</strong>
                  <span className={styles.projectDescription}>
                    {project.description}
                  </span>
                </span>
                <span className={styles.projectMeta}>
                  <span className={styles.projectStack}>
                    {project.stack.map((technology) => (
                      <span
                        className={styles.technologyIcon}
                        key={technology}
                        role="img"
                        aria-label={technologies[technology]}
                        title={technologies[technology]}
                        style={{
                          maskImage: `url(/logos/technologies/${technology}.svg)`,
                        }}
                      />
                    ))}
                  </span>
                  <span
                    className={styles.projectDestination}
                    title={project.href}
                    aria-hidden="true"
                  >
                    <span>
                      {project.href.startsWith("/")
                        ? project.href
                        : new URL(project.href).hostname.replace(/^www\./, "")}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 12 12 4M4 4h8v8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
          {articles
            .filter((article) => !article.hidden)
            .map((article) => (
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

      <section className={styles.section} aria-labelledby="archive-title">
        <h2 id="archive-title">Archive</h2>
        <div className={styles.rowList}>
          <Link
            href="/archive/homeview"
            className={`${styles.detailRow} ${styles.skillLink}`}
          >
            <span className={styles.rowIndex} aria-hidden="true">
              <PageSkeleton />
            </span>
            <div>
              <h3>HomeView</h3>
              <p>An interactive home display concept, and how it was built.</p>
            </div>
          </Link>
          <Link
            href="/archive/building-day-by-day"
            className={`${styles.detailRow} ${styles.skillLink}`}
          >
            <span className={styles.rowIndex} aria-hidden="true">
              <PageSkeleton />
            </span>
            <div>
              <h3>Building, day by day</h3>
              <p>A year of GitLab activity, drawn as an interactive skyline.</p>
            </div>
          </Link>
        </div>
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
            <span>mattduchatellier@gmail.com</span>
          </span>
          <a
            href="mailto:mattduchatellier@gmail.com"
            aria-label={contactButtonLabel}
          >
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
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <nav className={styles.footerSocials} aria-label="Social profiles">
            <a
              href="https://x.com/matthieu_pm"
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>
            <a
              href="https://www.producthunt.com/@mengde"
              target="_blank"
              rel="noreferrer"
            >
              ProductHunt
            </a>
            <a
              href="https://www.linkedin.com/in/matthieu-duchatellier/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://medium.com/@mengde-pm"
              target="_blank"
              rel="noreferrer"
            >
              Medium
            </a>
          </nav>
        </div>
        <span className={styles.footerSignatureFrame}>
          <Image
            className={styles.footerSignatureImage}
            src="/images/signature-matthieu.webp"
            alt="Matthieu Duchatellier signature"
            width={220}
            height={213}
          />
        </span>
        <nav
          className={`${styles.footerSocials} ${styles.footerResources}`}
          aria-label="Site resources"
        >
          <Link href="/mcp">MCP</Link>
          <a href="/llms.txt">llms.txt</a>
        </nav>
      </footer>
    </main>
  )
}
