import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ActivityBarSkeleton } from "./activity-bar"
import { CodingActivity } from "./coding-activity"
import { EmailCopy } from "./email-copy"
import { InspirationsOrb } from "./inspirations/inspirations-orb"
import { ProjectVideoLink } from "./project-video-link"
import styles from "./page.module.css"

const technologies = {
  nextdotjs: "Next.js",
  typescript: "TypeScript",
  tauri: "Tauri",
  rust: "Rust",
  bun: "Bun",
  modelcontextprotocol: "Model Context Protocol",
  orpc: "oRPC",
  tanstack: "TanStack Start",
  neon: "Neon Postgres",
}

const projects: {
  name: string
  description: string
  href: string
  logo: string | null
  video?: string
  stack: (keyof typeof technologies)[]
}[] = [
  {
    name: "My collection",
    description: "Curated lists of tools and inspiring designs",
    href: "/inspirations",
    logo: null,
    video: "/videos/inspirations.mp4",
    stack: ["bun", "nextdotjs", "modelcontextprotocol"],
  },
  {
    name: "Atrium",
    description: "Revenue teams meet agentic CRM workflows",
    href: "https://atriumcrm.com/",
    logo: "/logos/atrium.svg",
    video: "/videos/atrium.mp4?v=6",
    stack: ["typescript", "orpc", "nextdotjs"],
  },
  {
    name: "Carbon",
    description: "A desktop home for your coding agents",
    href: "https://carbonhq.sh",
    logo: "/logos/carbon.svg",
    video: "/videos/carbon.mp4",
    stack: ["rust", "typescript", "tauri"],
  },
  {
    name: "Forge",
    description: "An agentic issue tracking workspace",
    href: "https://app.forgenow.tech/",
    logo: "/logos/forge.svg",
    video: "/videos/forge.mp4?v=6",
    stack: ["tanstack", "neon", "typescript"],
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
        <div className={styles.identityCopy}>
          <h1>Matthieu Duchatellier</h1>
          <p>Product Manager · Design Engineer</p>
        </div>
        <ThemeToggle />
      </header>

      <section className={styles.intro} aria-label="Introduction">
        <p>
          I love building AI products. Making my own, like Forge and Carbon, has
          taught me a lot about engineering, and it’s changed how I approach
          product and design. Currently, I&apos;m pursuing
          a Product Management & UX Design MSc at SKEMA & POLIMI.
        </p>
        <Suspense fallback={<ActivityBarSkeleton />}>
          <CodingActivity />
        </Suspense>
        <p>
          Previously, I worked on growth and product design at{" "}
          <a
            className={styles.socialLink}
            href="https://www.avico.com/en/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Avico</strong>
          </a>
          , an air charter broker, and{" "}
          <a
            className={styles.socialLink}
            href="https://www.xllence.fr/fr/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Xllence</strong>
          </a>
          , a B2B sales agency. I’m open to a Product Manager or Design Engineer
          role starting June 2027.
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
          </a>{" "}
          /{" "}
          <a
            className={styles.socialLink}
            href="https://github.com/matthieu-pm"
            target="_blank"
            rel="noreferrer"
          >
            <strong>GitHub</strong>
          </a>
          .
        </p>
      </section>

      <section
        className={`${styles.section} ${styles.projectsSection}`}
        aria-labelledby="work-title"
      >
        <h2 id="work-title">Tools and apps I built</h2>
        <ul className={styles.projectList}>
          {projects.map((project) => {
            const linkProps = {
              className: styles.projectRow,
              href: project.href,
              target: project.href.startsWith("/") ? undefined : "_blank",
              rel: project.href.startsWith("/") ? undefined : "noreferrer",
            }
            const content = (
              <>
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
                    ~ {project.description}
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
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
              </>
            )
            return (
              <li key={project.name}>
                {project.video ? (
                  <ProjectVideoLink
                    {...linkProps}
                    videoSrc={project.video}
                    projectName={project.name}
                  >
                    {content}
                  </ProjectVideoLink>
                ) : (
                  <Link {...linkProps}>{content}</Link>
                )}
              </li>
            )
          })}
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
            <div>
              <h3>HomeView</h3>
              <p>An interactive home display concept, and how it was built.</p>
            </div>
          </Link>
          <Link
            href="/archive/building-day-by-day"
            className={`${styles.detailRow} ${styles.skillLink}`}
          >
            <div>
              <h3>Building, day by day</h3>
              <p>A year of GitLab activity, drawn as an interactive skyline.</p>
            </div>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <nav className={styles.footerSocials} aria-label="Footer links">
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
            <Link href="/mcp">MCP</Link>
            <a href="/llms.txt">llms.txt</a>
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
      </footer>
    </main>
  )
}
