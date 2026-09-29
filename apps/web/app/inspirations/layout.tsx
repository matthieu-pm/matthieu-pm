import type { ReactNode } from "react"
import { Inspirations } from "./inspirations"

export default function InspirationsLayout({
  children,
}: {
  children: ReactNode
}) {
  return <Inspirations>{children}</Inspirations>
}
