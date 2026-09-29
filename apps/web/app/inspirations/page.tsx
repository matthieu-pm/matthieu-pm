import type { Metadata } from "next"
import { InspirationSections } from "./inspirations"

const description =
  "A collection of inspiring interfaces, component libraries, AI tools, and resources for bringing ideas to life."

export const metadata: Metadata = {
  title: "Inspirations — Matthieu Duchatellier",
  description,
  alternates: { canonical: "/inspirations" },
  openGraph: {
    type: "website",
    title: "Inspirations — Matthieu Duchatellier",
    description,
    url: "/inspirations",
  },
}

export default function InspirationsPage() {
  return <InspirationSections />
}
