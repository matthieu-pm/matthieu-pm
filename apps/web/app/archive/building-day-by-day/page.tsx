import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { gitlabProfileUrl } from "@/lib/gitlab-activity"

import { GitLabActivity } from "../../gitlab-activity"
import activityStyles from "../../page.module.css"
import { siteConfig } from "../../site-config"
import { ArticleControls } from "../../writing/article-controls"
import layoutStyles from "../homeview/page.module.css"
import styles from "./page.module.css"

const path = "/archive/building-day-by-day"
const title = "Building, day by day"
const description =
  "A year of GitLab contributions, drawn as an interactive skyline. Explore the daily activity behind the work."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "article",
    title,
    description,
    url: path,
    siteName: siteConfig.name,
    images: [siteConfig.socialPreview.path],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.socialPreview.path],
  },
}

export default function BuildingDayByDayPage() {
  return (
    <main className={layoutStyles.page}>
      <article className={layoutStyles.column}>
        <ArticleControls pageUrl={`${siteConfig.url}${path}`} />

        <header className={layoutStyles.hero}>
          <p className={layoutStyles.eyebrow}>Archive · Activity</p>
          <h1>Building, day by day</h1>
          <p className={layoutStyles.lead}>
            A year of contributions, one day at a time.
          </p>
          <p className={layoutStyles.intro}>
            My GitLab activity as an interactive skyline. Switch between the
            calendar and 3D views, and explore each day’s contributions.
          </p>
        </header>

        <section className={styles.activity} aria-labelledby="activity-title">
          <div className={activityStyles.activityHeading}>
            <h2 id="activity-title">GitLab activity</h2>
            <a href={gitlabProfileUrl} target="_blank" rel="noreferrer">
              <Image src="/logos/gitlab.svg" alt="" width={14} height={14} />
              GitLab
              <span className={activityStyles.activityArrow} aria-hidden="true">
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={14}
                  strokeWidth={1.8}
                />
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={14}
                  strokeWidth={1.8}
                />
              </span>
            </a>
          </div>
          <Suspense
            fallback={
              <p className={activityStyles.activityStatus}>
                Loading GitLab activity…
              </p>
            }
          >
            <GitLabActivity />
          </Suspense>
        </section>

        <footer className={layoutStyles.footer}>
          <Link href="/#archive-title">Back to Archive</Link>
          <span>Matthieu Duchatellier</span>
        </footer>
      </article>
    </main>
  )
}
