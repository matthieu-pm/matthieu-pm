import { writeFile } from "node:fs/promises"
import TurndownService from "turndown"

import sitemap from "../app/sitemap"
import {
  catalogues,
  navigation,
  type Resource,
} from "../app/inspirations/catalogues"
import stack from "../app/inspirations/data/stack.json"
import { siteConfig } from "../app/site-config"

// Run against the local site so the export includes the current checkout.
const origin = new URL(process.argv[2] ?? "http://localhost:3001")
let pageUrl: string = siteConfig.url
const converter = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
})

converter.addRule("omitNonContent", {
  filter: (node) =>
    ["HEAD", "TITLE", "SCRIPT", "STYLE", "NOSCRIPT", "SVG", "NAV"].includes(
      node.nodeName
    ) ||
    node.getAttribute("aria-hidden") === "true" ||
    node.hasAttribute("hidden"),
  replacement: () => "",
})
converter.addRule("links", {
  filter: "a",
  replacement: (content, node) => {
    const href = node.getAttribute("href")
    if (!href) return content
    const url = new URL(href, pageUrl).href
    const label = content.trim() || node.getAttribute("aria-label") || url
    // Keep linked project titles and descriptions readable on separate lines.
    return content.includes("\n") || node.querySelector("small")
      ? `\n\n${label}\n\n${url}\n\n`
      : `[${label}](<${url}>)`
  },
})
converter.addRule("images", {
  filter: "img",
  replacement: (_, node) => {
    const alt = node.getAttribute("alt")
    const src = node.getAttribute("src")
    return alt && src ? `![${alt}](<${new URL(src, pageUrl).href}>)` : ""
  },
})
converter.addRule("fieldValues", {
  filter: "input",
  replacement: (_, node) =>
    node.getAttribute("value") || node.getAttribute("placeholder") || "",
})
converter.addRule("inlineSpacing", {
  filter: (node) => ["SPAN", "LABEL", "BUTTON"].includes(node.nodeName),
  replacement: (content, node) => {
    if (node.closest("pre, code") || content.trim().length === 1) return content
    return content.trim() ? ` ${content.trim()} ` : ""
  },
})
converter.addRule("smallText", {
  filter: "small",
  replacement: (content) => ` — ${content}`,
})

const pages = sitemap().sort((a, b) =>
  a.url === siteConfig.url ? -1 : b.url === siteConfig.url ? 1 : 0
)
const sections: { title: string; url: string; content: string }[] = []

for (const page of pages) {
  pageUrl = page.url
  const path = new URL(page.url).pathname
  const response = await fetch(new URL(path, origin), {
    headers: { Accept: "text/html" },
    redirect: "error",
    signal: AbortSignal.timeout(60_000),
  })
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("text/html")
  ) {
    throw new Error(`Unable to export ${path}: HTTP ${response.status}`)
  }
  const html = await response.text()
  if (!/<main\b/i.test(html)) throw new Error(`Missing page content: ${path}`)
  const titleHtml = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
  const title = titleHtml ? converter.turndown(titleHtml) : path
  const category = navigation.find((entry) => entry.href === path)
  let content: string
  if (category) {
    // Read collection data directly: grid previews and stack tooltips don't
    // expose all resource names and descriptions in the server-rendered HTML.
    const resources = (items: Resource[]) =>
      items
        .map((item) => `- [${item.name}](<${item.href}>): ${item.description}`)
        .join("\n")
    content = [
      "# My collection",
      "A collection of inspiring interfaces, component libraries, AI tools, and resources for bringing ideas to life.",
      "## My stack",
      resources(stack),
      ...catalogues[category.id].flatMap((section) => [
        `## ${section.title}`,
        section.description,
        resources(section.items),
      ]),
    ].join("\n\n")
  } else {
    // Keep the complete body, including content delivered after a Suspense
    // boundary. Preserve examples, form labels, and button copy in the guides.
    const resolvedHtml = html
      .replace(
        /<!--\$\?--><template id="B:[^"]*"><\/template>[\s\S]*?<!--\/\$-->/g,
        ""
      )
      .replace(/(<div)\s+hidden(?:="")?(\s+id="S:[^"]*")/g, "$1$2")
    content = converter.turndown(resolvedHtml).trim()
  }
  if (!content) throw new Error(`Empty page content: ${path}`)
  sections.push({ title, url: page.url, content })
  console.log(`Exported ${path}`)
}

const output =
  [
    `# ${siteConfig.name} — Full website content`,
    `> Complete text of the ${sections.length} public pages at ${siteConfig.url}, including the portfolio, collection, skills, writing, guides, and archives.`,
    "External projects and collection resources are linked; their websites are not included. Interactive examples are represented by their initial text and accompanying explanations.",
    "## Contents",
    sections.map((page) => `- [${page.title}](${page.url})`).join("\n"),
    ...sections.map(
      (page) =>
        `---\n\n# ${page.title}\n\nSource: ${page.url}\n\n${page.content}`
    ),
  ].join("\n\n") + "\n"

// Write only after every page succeeds, preserving the previous export on error.
await writeFile(new URL("../public/llms-full.txt", import.meta.url), output)
await writeFile(new URL("../public/llms.txt", import.meta.url), output)
console.log(
  `Wrote llms-full.txt and llms.txt (${sections.length} pages, ${Buffer.byteLength(output)} bytes each)`
)
