import ContributionSkyline from "@/components/ui/contribution-skyline"
import { getGitLabActivity } from "@/lib/gitlab-activity"

import styles from "./page.module.css"

export async function GitLabActivity() {
  const activity = await getGitLabActivity()

  if (!activity) {
    return (
      <p className={styles.activityStatus}>
        Activity is temporarily unavailable. You can still explore my work on
        GitLab.
      </p>
    )
  }

  return (
    <ContributionSkyline
      data={activity.days}
      endDate={activity.endDate}
      palette="ember"
      showStats={false}
      duration={1800}
      weekStart={1}
    />
  )
}
