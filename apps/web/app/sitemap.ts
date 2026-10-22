import type { MetadataRoute } from "next"

import { siteConfig } from "./site-config"
import { navigation } from "./inspirations/catalogues"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
    {
      url: `${siteConfig.url}/skills/great-ui`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...["ux-writing", "ai-design-engineer", "ai-product-manager"].map(
      (slug) => ({
        url: `${siteConfig.url}/writing/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    ),
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
