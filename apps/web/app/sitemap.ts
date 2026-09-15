import type { MetadataRoute } from "next"

import { siteConfig } from "./site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
