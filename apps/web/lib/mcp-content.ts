import { catalogues, navigation } from "../app/inspirations/catalogues"
import { siteConfig } from "../app/site-config"
import { htmlToMarkdown } from "./markdown"
import { publishedContent } from "./site-content"

export const contentIndex = publishedContent.map((entry) => ({
  ...entry,
  url: new URL(entry.path, siteConfig.url).href,
}))

export const collectionIndex = navigation.flatMap((category) =>
  catalogues[category.id].flatMap((section) =>
    section.items.map((item) => ({
      name: item.name,
      description: item.description,
      url: item.href,
      category: category.id,
      section: section.title,
      source: `${siteConfig.url}${category.href}#${section.id}`,
    }))
  )
)

export function searchTerms(query: string) {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

export function matchesQuery(text: string, terms: string[]) {
  const normalized = text.toLowerCase()
  return terms.every((term) => normalized.includes(term))
}

export function searchCollection(query: string, category?: string) {
  const terms = searchTerms(query)
  const seen = new Set<string>()
  return collectionIndex.filter((item) => {
    if (category && item.category !== category) return false
    if (
      !matchesQuery(
        `${item.name} ${item.description} ${item.category} ${item.section}`,
        terms
      ) ||
      seen.has(item.url)
    )
      return false
    seen.add(item.url)
    return true
  })
}

export async function readPublishedContent(id: string, requestUrl: string) {
  const entry = contentIndex.find((item) => item.id === id)
  if (!entry) throw new Error("Unknown content ID")

  // Fetch only known public paths from a trusted deployment. Caller-supplied
  // URLs, query strings, cookies and authorization headers are never forwarded.
  let origin: string = siteConfig.url
  if (process.env.VERCEL_URL) origin = `https://${process.env.VERCEL_URL}`
  else if (process.env.NODE_ENV !== "production") {
    const local = new URL(requestUrl)
    if (["localhost", "127.0.0.1", "[::1]"].includes(local.hostname)) {
      origin = local.origin
    }
  }
  const headers = new Headers({ Accept: "text/html" })
  if (process.env.VERCEL && process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers.set(
      "x-vercel-protection-bypass",
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    )
  }
  const response = await fetch(new URL(entry.path, origin), {
    headers,
    redirect: "error",
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(15_000),
  })
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("text/html")
  ) {
    throw new Error("Published page is temporarily unavailable")
  }
  const html = await response.text()
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
  if (!main) throw new Error("Published page content is unavailable")
  return htmlToMarkdown(main, entry.url)
}
