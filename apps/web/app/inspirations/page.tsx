import type { Metadata } from "next"
import { Inspirations } from "./inspirations"

const description =
  "A curated collection of interface craft, component libraries, AI tools, and resources for builders."

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
  return <Inspirations />
}
