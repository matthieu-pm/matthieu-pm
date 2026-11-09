import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { publishedContent } from "@/lib/site-content"

import "./globals.css"
import { navigation } from "./inspirations/catalogues"
import { siteConfig } from "./site-config"
import { WebMcp } from "./webmcp"

const agentPaths = [
  "/",
  "/mcp",
  ...navigation.map((item) => item.href),
  ...publishedContent.map((item) => item.path),
]

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: "/",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    firstName: "Matthieu",
    lastName: "Duchatellier",
    username: "matthieu_pm",
    images: [
      {
        url: siteConfig.socialPreview.path,
        width: siteConfig.socialPreview.width,
        height: siteConfig.socialPreview.height,
        alt: siteConfig.socialPreview.alt,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@matthieu_pm",
    images: [
      {
        url: siteConfig.socialPreview.path,
        alt: siteConfig.socialPreview.alt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      url: siteConfig.url,
      image: `${siteConfig.url}/images/matthieu-picture.webp`,
      description: siteConfig.description,
      jobTitle: "Product Manager & Design Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Forge",
        url: "https://forgeapp.sh",
      },
      knowsAbout: [
        "Product management",
        "UX design",
        "Design engineering",
        "Growth",
        "AI product development",
      ],
      sameAs: siteConfig.socialProfiles,
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <WebMcp paths={agentPaths} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
