import { z } from "zod"

const count = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)
const date = z.iso.date()

export const activityDetailsSchema = z
  .object({
    version: z.literal(1),
    updatedAt: z.iso.datetime(),
    weeks: z.record(
      date,
      z
        .object({
          commits: count,
          repositories: count,
          linesAdded: count,
          linesDeleted: count,
          aiDiffs: count.nullable(),
          mostUsedModel: z.string().min(1).max(120).nullable(),
        })
        .strict()
    ),
  })
  .strict()

export type ActivityDetailsSnapshot = z.infer<typeof activityDetailsSchema>
export type ActivityDetails = ActivityDetailsSnapshot["weeks"][string]
