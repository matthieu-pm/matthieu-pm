import type { MetadataRoute } from "next"

import { siteConfig } from "./site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/inspirations`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/skills/great-ui`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/skills/product-bet`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...[
      "ux-writing",
      "ai-design-engineer",
      "ai-product-manager",
    ].map((slug) => ({
      url: `${siteConfig.url}/writing/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
