import { getCodingActivity } from "@/lib/coding-activity"
import { ActivityBar } from "./activity-bar"

export async function CodingActivity() {
  return <ActivityBar data={await getCodingActivity()} />
}
