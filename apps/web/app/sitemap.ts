import type { MetadataRoute } from "next"

import { siteConfig } from "./site-config"
import { navigation } from "./inspirations/catalogues"
import { publishedContent } from "@/lib/site-content"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/archive/building-day-by-day`,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/archive/homeview`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/oklch`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...navigation.map((page) => ({
      url: `${siteConfig.url}${page.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...publishedContent.map((entry) => ({
      url: `${siteConfig.url}${entry.path}`,
      changeFrequency: "monthly" as const,
      priority: entry.kind === "skill" ? 0.8 : 0.7,
    })),
    {
      url: `${siteConfig.url}/mcp`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
