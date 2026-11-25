import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { GeistMono } from "geist/font/mono"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { projects, technologies } from "@/lib/portfolio-projects"
import stack from "../inspirations/data/stack.json"
import { InspirationsOrb } from "../inspirations/inspirations-orb"
import { siteConfig } from "../site-config"
import {
  certifications,
  education,
  experience,
  projectHighlights,
  type ResumeEntry,
} from "./resume-content"
import styles from "./resume.module.css"

const title = `Résumé · ${siteConfig.name}`
const description =
  "Experience, education, and selected projects from Matthieu Duchatellier, product manager and design engineer."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resume" },
  openGraph: {
    title,
    description,
    url: "/resume",
    images: [
      { url: siteConfig.socialPreview.path, alt: siteConfig.socialPreview.alt },
    ],
  },
}

const sections = [
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "stack", title: "Stack" },
  { id: "education", title: "Education" },
]

function LogoTile({ src }: { src: string }) {
  return (
    <span className={styles.rowIcon}>
      <Image
        className={styles.brandLogo}
        src={src}
        width={32}
        height={32}
        alt=""
      />
    </span>
  )
}

function ResumeRow({
  entry,
  symbol,
  open,
  children,
}: {
  entry: ResumeEntry
  symbol?: ReactNode
  open?: boolean
  children?: ReactNode
}) {
  const heading = (
    <>
      <span className={styles.rowLogos} aria-hidden="true">
        {entry.logos.map((logo) => (
          <LogoTile key={logo} src={logo} />
        ))}
        {symbol && <span className={styles.rowIcon}>{symbol}</span>}
      </span>
      <span className={styles.rowCopy}>
        <span className={styles.rowTitle}>{entry.title}</span>
        <span className={styles.rowMeta}>
          {entry.date && <span className={styles.date}>{entry.date}</span>}
          {entry.subtitle && <span>{entry.subtitle}</span>}
        </span>
        {entry.tags.length > 0 && (
          <span className={styles.tags}>
            {entry.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        )}
      </span>
    </>
  )

  if (!entry.details.length && !children) {
    return <div className={styles.rowHeading}>{heading}</div>
  }

  return (
    <details className={styles.row} open={open}>
      <summary className={styles.rowHeading}>
        {heading}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={18}
          aria-hidden="true"
          className={styles.chevron}
        />
      </summary>
      <div className={styles.rowDetails}>
        {entry.details.length > 0 && (
          <ul>
            {entry.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </details>
  )
}

export default function ResumePage() {
  return (
    <main className={`${styles.page} ${GeistMono.variable}`} id="top">
      <div className={styles.frame}>
        <header className={styles.topbar}>
          <Link className={styles.back} href="/">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={17}
              aria-hidden="true"
            />
            Back
          </Link>
          <nav className={styles.sectionNav} aria-label="Résumé sections">
            {sections.map(({ id, title }) => (
              <a key={id} href={`#${id}`}>
                {title}
              </a>
            ))}
          </nav>
          <div className={styles.topActions}>
            <a
              className={styles.download}
              href="/english-resume-matthieu-duchatellier.pdf"
              download
            >
              <HugeiconsIcon
                icon={Download01Icon}
                size={17}
                aria-hidden="true"
              />
              <span>Download PDF</span>
            </a>
            <ThemeToggle />
          </div>
        </header>

        <section className={styles.identity} aria-labelledby="resume-name">
          <div className={styles.identityHeading}>
            <Image
              className={styles.portrait}
              src="/images/matthieu-picture.webp"
              alt=""
              width={64}
              height={64}
            />
            <div>
              <h1 id="resume-name">{siteConfig.name}</h1>
              <p className={styles.role}>Product Manager · Design Engineer</p>
            </div>
          </div>
          <p className={styles.intro}>
            I build AI products and work across product management, UX design,
            and growth. I’m open to Product Manager and Design Engineer roles
            starting June 2027.
          </p>
          <div className={styles.contact}>
            <a href="mailto:matthieu.duchatellier@gmail.com">
              Email{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                aria-hidden="true"
              />
            </a>
            <a
              href={siteConfig.socialProfiles[0]}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                aria-hidden="true"
              />
            </a>
            <a
              href="https://github.com/matthieu-pm"
              target="_blank"
              rel="noreferrer"
            >
              GitHub{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                aria-hidden="true"
              />
            </a>
          </div>
        </section>

        <section
          className={styles.section}
          id="experience"
          aria-labelledby="work-title"
        >
          <h2 id="work-title">Experience</h2>
          {experience.map((entry, index) => (
            <ResumeRow key={entry.title} entry={entry} open={index === 0} />
          ))}
        </section>

        <section
          className={styles.section}
          id="projects"
          aria-labelledby="project-title"
        >
          <h2 id="project-title">Selected projects</h2>
          {projects.map((project) => (
            <ResumeRow
              key={project.name}
              entry={{
                title: project.name,
                subtitle: project.description,
                logos: project.logo ? [project.logo] : [],
                tags: project.stack.map(
                  (technology) => technologies[technology]
                ),
                details: projectHighlights[project.name] ?? [],
              }}
              open
              symbol={
                !project.logo && (
                  <InspirationsOrb
                    className={styles.collectionLogo}
                    size={26}
                    interactive={false}
                  />
                )
              }
            >
              <Link className={styles.projectLink} href={project.href}>
                Visit {project.name}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={15}
                  aria-hidden="true"
                />
              </Link>
            </ResumeRow>
          ))}
        </section>

        <section
          className={styles.section}
          id="stack"
          aria-labelledby="stack-title"
        >
          <h2 id="stack-title">My stack</h2>
          <ul className={styles.stackList}>
            {stack.map(({ href, icon, name }) => (
              <li key={href}>
                <a
                  className={styles.stackLink}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={name}
                >
                  <Image
                    className={styles.stackIcon}
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`${styles.section} ${styles.education}`}
          id="education"
          aria-labelledby="education-title"
        >
          <h2 id="education-title">Education</h2>
          {education.map((entry) => (
            <ResumeRow key={entry.title} entry={entry} />
          ))}
          <div className={styles.certifications}>
            <h3>Certifications</h3>
            <ul>
              {certifications.map(({ title, issuer, date, logo }) => (
                <li key={title}>
                  <LogoTile src={logo} />
                  <span>
                    {title} <span className={styles.issuer}>{issuer}</span>
                  </span>
                  <time dateTime={date}>{date}</time>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className={styles.footer}>
          <a href="#top">Back to top</a>
        </footer>
      </div>
    </main>
  )
}
