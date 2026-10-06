import type { Metadata } from "next"
import { InspirationSections } from "./inspirations"
import { siteConfig } from "../site-config"

const title = `My collection — ${siteConfig.name}`
const description =
  "Explore my collection of design inspiration, UI components, development tools, and resources, plus the stack I use to design and build products."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/inspirations" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/inspirations",
    images: [
      {
        url: siteConfig.socialPreview.path,
        width: siteConfig.socialPreview.width,
        height: siteConfig.socialPreview.height,
        alt: siteConfig.socialPreview.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@matthieu_pm",
    images: [siteConfig.socialPreview.path],
  },
}

export default function InspirationsPage() {
  return <InspirationSections />
}
