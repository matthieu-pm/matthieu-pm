import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { siteConfig } from "../site-config"
import { PageShell } from "./page-controls"
import { ReferenceContent } from "./reference-content"
import "./reference.css"
import "./oklch.css"

const title = "OKLCH Color Guide: Lightness, Chroma, Hue & CSS"
const description =
  "Learn the OKLCH color model with interactive examples. Explore lightness, chroma, hue, CSS syntax, gradients, color gamuts, and browser fallbacks."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/oklch" },
  openGraph: {
    type: "website",
    url: "/oklch",
    title,
    description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/oklch/opengraph-image",
        alt: "OKLCH color guide with a spectrum of color swatches",
      },
    ],
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/oklch#webpage`,
  url: `${siteConfig.url}/oklch`,
  name: title,
  description,
  inLanguage: "en",
  isPartOf: { "@id": `${siteConfig.url}/#website` },
  about: { "@type": "Thing", name: "OKLCH color model" },
}

export default function OklchPage() {
  return (
    <PageShell className={GeistMono.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <ReferenceContent />
    </PageShell>
  )
}
