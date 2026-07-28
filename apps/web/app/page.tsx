import Image from "next/image"
import type { CSSProperties } from "react"

import styles from "./page.module.css"

const contactButtonLabel = "Get in touch"
const contactButtonStaggerMs = 28

const experiences = [
  {
    company: "Wondertale",
    role: "Co-founder · Growth Designer",
    period: "Oct 2024 — Present",
    description:
      "Conversion-focused websites, product experiences, and client delivery.",
    logo: "/logos/wondertale.png",
    logoWidth: 31,
    logoHeight: 31,
    logoClassName: styles.experienceLogoWondertale,
  },
  {
    company: "Xllence",
    role: "Marketing Manager",
    period: "Sep 2024 — Aug 2025",
    description:
      "Growth systems, AI-enabled content workflows, and UX research.",
    logo: "/logos/xllence.png",
    logoWidth: 43,
    logoHeight: 22,
    logoClassName: styles.experienceLogoXllence,
  },
  {
    company: "Avico",
    role: "Marketing Manager",
    period: "May 2023 — Sep 2024",
    description:
      "Data-led content, brand positioning, and digital product launches.",
    logo: "/logos/avico.png",
    logoWidth: 43,
    logoHeight: 14,
    logoClassName: styles.experienceLogoAvico,
  },
]

const capabilities = [
  {
    path: "/skills",
    description: "UI, accessibility, typography, layout, colors & more",
  },
  {
    path: "/better-interfaces",
    description: "UI skill for improving interfaces",
  },
  {
    path: "/oklch",
    description: "Skill for using OKLCH colors",
  },
]

const outcomes = [
  {
    title: "210% average organic traffic growth",
    detail: "Xllence · 2024–2025",
  },
  {
    title: "6 hours saved every week with AI workflows",
    detail: "Xllence · 2025",
  },
  {
    title: "29% conversion uplift across client websites",
    detail: "Wondertale · 2024–Present",
  },
  {
    title: "14 projects delivered with 98% on-time delivery",
    detail: "Wondertale · 2024–Present",
  },
  {
    title: "240,000 impressions from product-led content",
    detail: "Avico · 2023–2024",
  },
]

const education = [
  {
    title: "2Y MSc Double diploma in Product Management & UX Design",
    detail: "SKEMA × Politecnico di Milano × POLIMI.design · 2025–2027",
    logos: [
      {
        src: "/logos/skema.png",
        width: 21,
        height: 21,
        className: styles.educationLogoSkema,
      },
      {
        src: "/logos/polimi.png",
        width: 21,
        height: 21,
        className: styles.educationLogoPolimi,
      },
    ],
  },
  {
    title: "Exchange student in International Management and Marketing",
    detail:
      "SKEMA Suzhou x 苏州大学 (Soochow University) · 2026 Spring semester",
    logos: [
      {
        src: "/logos/skema.png",
        width: 21,
        height: 21,
        className: styles.educationLogoSkema,
      },
      {
        src: "/logos/soochow.png",
        width: 22,
        height: 21,
        className: styles.educationLogoSoochow,
      },
    ],
  },
  {
    title: "AI Product Manager Professional Certificate",
    detail: "IBM · 2025",
    logos: [
      {
        src: "/logos/ibm.svg",
        width: 50,
        height: 21,
        className: styles.educationLogoIbm,
      },
    ],
  },
  {
    title: "Bachelor, Digital Project Management",
    detail: "IIM Digital School · 2021–2024",
    logos: [
      {
        src: "/logos/iim.png",
        width: 19,
        height: 21,
        className: styles.educationLogoIim,
      },
    ],
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
            src="/images/matthieu-picture.png"
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
            href="https://skema.eu/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/skema.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            SKEMA
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
              src="/logos/polimi.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            Politecnico di Milano
          </a>, and the founding product engineer at{" "}
          <a
            className={styles.socialLink}
            href="https://forgeapp.sh"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={`${styles.socialIcon} ${styles.socialIconForge}`}
              src="/logos/forge.svg"
              alt=""
              width={19}
              height={14}
              aria-hidden="true"
            />
            Forge
          </a>, where we&apos;re building the infrastructure that operates
          self-building software.
        </p>
        <p>
          I care <em>deeply</em> about craft and building products people enjoy
          using. I work at the intersection of product management and design
          engineering, turning user insight into AI products, from discovery
          and UX to shipped software.
        </p>
        <p>
          Previously, I worked on growth and marketing at{" "}
          <a
            className={styles.socialLink}
            href="https://www.xllence.fr/fr/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/xllence-icon.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            Xllence
          </a>{" "}
          and{" "}
          <a
            className={styles.socialLink}
            href="https://www.avico.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/avico-icon.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            Avico
          </a>, and co-founded{" "}
          <a
            className={styles.socialLink}
            href="https://wondertale.xyz"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/wondertale.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            Wondertale
          </a>. I&apos;m looking for an end-of-study PM or Design Engineer
          internship starting May 2027.
        </p>
        <p>
          You can reach me on{" "}
          <a
            className={styles.socialLink}
            href="https://www.linkedin.com/in/matthieu-duchatellier/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/linkedin.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            LinkedIn
          </a>{" "}
          or via{" "}
          <a
            className={styles.socialLink}
            href="mailto:matthieu.duchatellier@gmail.com"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/gmail.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            email
          </a>, and explore my code on{" "}
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
            GitLab
          </a>.
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
          <a
            className={styles.projectCard}
            href="https://oklch.sh"
            target="_blank"
            rel="noreferrer"
          >
            <span
              className={`${styles.projectMark} ${styles.projectVisualMark}`}
              aria-hidden="true"
            >
              <Image
                className={`${styles.projectMarkImage} ${styles.oklchProjectMarkImage}`}
                src="/logos/oklch-icon.webp"
                alt=""
                width={96}
                height={96}
              />
            </span>
            <span>
              <strong>oklch.sh</strong>
              <small>A guide to OKLCH colors.</small>
            </span>
          </a>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="capabilities-title"
      >
        <h2 id="capabilities-title">Skills for agents</h2>
        <div className={styles.rowList}>
          {capabilities.map((capability) => (
            <article className={styles.detailRow} key={capability.path}>
              <span className={styles.rowIndex} aria-hidden="true">
                <PageSkeleton />
              </span>
              <div>
                <h3>{capability.path}</h3>
                <p>{capability.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="impact-title"
      >
        <h2 id="impact-title">Selected impact</h2>
        <div className={styles.rowList}>
          {outcomes.map((outcome) => (
            <article className={styles.detailRow} key={outcome.title}>
              <span className={styles.rowIndex} aria-hidden="true">
                <PageSkeleton />
              </span>
              <div>
                <h3>{outcome.title}</h3>
                <p>{outcome.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="experience-title"
        id="experience"
      >
        <h2 id="experience-title">Experience</h2>
        <div className={styles.rowList}>
          {experiences.map((experience) => (
            <article
              className={styles.detailRow}
              id={experience.company.toLowerCase()}
              key={experience.company}
            >
              <span className={styles.experienceLogo} aria-hidden="true">
                <Image
                  className={`${styles.experienceLogoImage} ${experience.logoClassName}`}
                  src={experience.logo}
                  alt=""
                  width={experience.logoWidth}
                  height={experience.logoHeight}
                />
              </span>
              <div>
                <div className={styles.experienceHeader}>
                  <h3>{experience.company}</h3>
                  <p>{experience.role}</p>
                  <p className={styles.rowMeta}>{experience.period}</p>
                </div>
                <p className={styles.rowDescription}>
                  {experience.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="education-title"
      >
        <h2 id="education-title">Education</h2>
        <div className={styles.rowList}>
          {education.map((item) => (
            <article className={styles.detailRow} key={item.title}>
              <span className={styles.educationLogos} aria-hidden="true">
                {item.logos.map((logo) => (
                  <Image
                    className={`${styles.experienceLogoImage} ${logo.className}`}
                    src={logo.src}
                    alt=""
                    width={logo.width}
                    height={logo.height}
                    key={logo.src}
                  />
                ))}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
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
            <Image
              className={styles.contactIcon}
              src="/logos/gmail.png"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <span>matthieu.duchatellier@gmail.com</span>
          </span>
          <a
            href="mailto:matthieu.duchatellier@gmail.com"
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
            <span
              className={styles.contactButtonLabel}
              aria-hidden="true"
            >
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
          Or{" "}
          <a
            href="/matthieu-duchatellier-resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            download my résumé
          </a>
          .
        </p>
      </section>

      <footer className={styles.footer}>
        <nav className={styles.footerSocials} aria-label="Social profiles">
          <a
            href="https://x.com/matthieu_pm"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.footerSocialIcon}
              src="/logos/x.png"
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
              src="/logos/product-hunt.png"
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
              src="/logos/linkedin.png"
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
                src="/logos/medium.png"
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
            src="/images/signature-matthieu.png"
            alt="Matthieu Duchatellier signature"
            width={220}
            height={213}
          />
        </span>
      </footer>
    </main>
  )
}
