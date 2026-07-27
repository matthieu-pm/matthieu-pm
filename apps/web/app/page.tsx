import Image from "next/image"

import styles from "./page.module.css"

const experiences = [
  {
    company: "Wondertale",
    role: "Co-founder · Growth Designer",
    period: "Oct 2024 — Present",
    description:
      "Conversion-focused websites, product experiences, and client delivery.",
    logo: "/logos/wondertale.png",
    logoWidth: 500,
    logoHeight: 500,
    logoClassName: styles.experienceLogoWondertale,
  },
  {
    company: "Xllence",
    role: "Marketing Manager",
    period: "Sep 2024 — Aug 2025",
    description:
      "Growth systems, AI-enabled content workflows, and UX research.",
    logo: "/logos/xllence.png",
    logoWidth: 176,
    logoHeight: 88,
    logoClassName: styles.experienceLogoXllence,
  },
  {
    company: "Avico",
    role: "Marketing Manager",
    period: "May 2023 — Sep 2024",
    description:
      "Data-led content, brand positioning, and digital product launches.",
    logo: "/logos/avico.png",
    logoWidth: 1920,
    logoHeight: 630,
    logoClassName: styles.experienceLogoAvico,
  },
]

const capabilities = [
  {
    path: "/product",
    description: "Strategy, roadmaps, discovery, OKRs & prioritization",
  },
  {
    path: "/ux",
    description: "Research, wireframes, prototyping & design thinking",
  },
  {
    path: "/growth",
    description: "Go-to-market, content, SEO & experimentation",
  },
  {
    path: "/ai",
    description: "Agentic workflows, LLMs, automation & APIs",
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
    title: "MSc Product Management & UX Design",
    detail: "SKEMA × Politecnico di Milano × POLIMI.design · 2025–2027",
    logos: [
      {
        src: "/logos/skema.png",
        width: 447,
        height: 447,
        className: styles.educationLogoSkema,
      },
      {
        src: "/logos/polimi.png",
        width: 447,
        height: 447,
        className: styles.educationLogoPolimi,
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
        width: 91,
        height: 101,
        className: styles.educationLogoIim,
      },
    ],
  },
]

export default function Page() {
  return (
    <main className={styles.page}>
      <header className={styles.identity}>
        <div className={styles.avatar}>
          <Image
            className={styles.avatarImage}
            src="/images/matthieu-picture.png"
            alt=""
            width={300}
            height={300}
            aria-hidden="true"
          />
        </div>
        <div>
          <h1>Matthieu Duchatellier</h1>
          <p>Product Manager · Growth & UX</p>
        </div>
      </header>

      <section className={styles.intro} aria-label="Introduction">
        <p>
          I&apos;m a Product Management & UX Design student at{" "}
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
          </a>, and also the founding product engineer at{" "}
          <a
            className={styles.socialLink}
            href="https://forgeapp.sh"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className={styles.socialIcon}
              src="/logos/forge.png"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            Forge
          </a>, where we are engineering the tool that operates self-building
          software.
        </p>
        <p>
          I care <em>deeply</em> about craft and quality and I like to make
          people enjoy my work, by bringing together user insights, business
          outcomes and AI-enabled execution.
        </p>
        <p>
          Previously, I led growth and marketing work at{" "}
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
          </a>. I&apos;m open for a PM/PO internship from May 2027. You can reach
          me on{" "}
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
          </a>, via{" "}
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
          </a>, or see my code on{" "}
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
            Gitlab
          </a>.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="work-title">
        <h2 id="work-title">Selected work</h2>
        <div className={styles.projectGrid}>
          <a className={styles.projectCard} href="#wondertale">
            <span className={styles.projectMark} aria-hidden="true">
              W
            </span>
            <span>
              <strong>Wondertale</strong>
              <small>Conversion-led websites and product experiences.</small>
            </span>
          </a>
          <a className={styles.projectCard} href="#xllence">
            <span className={styles.projectMark} aria-hidden="true">
              AI
            </span>
            <span>
              <strong>AI content workflows</strong>
              <small>Agentic planning and generation, saving 6h/week.</small>
            </span>
          </a>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.standardGap}`}
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
                <h3>{experience.company}</h3>
                <p>{experience.role}</p>
                <p className={styles.rowMeta}>{experience.period}</p>
                <p className={styles.rowDescription}>
                  {experience.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.standardGap}`}
        aria-labelledby="capabilities-title"
      >
        <h2 id="capabilities-title">Capabilities</h2>
        <div className={styles.rowList}>
          {capabilities.map((capability, index) => (
            <article className={styles.detailRow} key={capability.path}>
              <span className={styles.rowIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
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
        className={`${styles.section} ${styles.standardGap}`}
        aria-labelledby="impact-title"
      >
        <h2 id="impact-title">Selected impact</h2>
        <div className={styles.rowList}>
          {outcomes.map((outcome, index) => (
            <article className={styles.detailRow} key={outcome.title}>
              <span className={styles.rowIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
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
        className={`${styles.section} ${styles.standardGap}`}
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
          <a href="mailto:matthieu.duchatellier@gmail.com">Get in touch</a>
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
        <span>Paris ↔ Milan</span>
        <strong aria-label="Matthieu Duchatellier">M</strong>
      </footer>
    </main>
  )
}
