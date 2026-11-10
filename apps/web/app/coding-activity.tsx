import { getCodingActivity } from "@/lib/coding-activity"
import { getActivityDetails } from "@/lib/activity-details.server"
import { ActivityBar } from "./activity-bar"

export async function CodingActivity() {
  const [data, initialDetails] = await Promise.all([
    getCodingActivity(),
    getActivityDetails(),
  ])

  return <ActivityBar data={data} initialDetails={initialDetails} />
}
