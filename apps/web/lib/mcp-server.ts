import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { navigation } from "../app/inspirations/catalogues"
import { siteConfig } from "../app/site-config"
import {
  collectionIndex,
  contentIndex,
  matchesQuery,
  searchCollection,
  searchTerms,
} from "./mcp-content"

const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
}
const query = z.string().trim().max(200).default("")
const limit = z.number().int().min(1).max(30).default(10)
const offset = z.number().int().min(0).max(1_000_000).default(0)
const contentId = z.enum(
  contentIndex.map((entry) => entry.id) as [string, ...string[]]
)

function result(data: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  }
}

export function createMcpServer(readContent: (id: string) => Promise<string>) {
  const server = new McpServer(
    { name: "matthieu-pm", version: "1.0.0", websiteUrl: siteConfig.url },
    {
      instructions:
        "Search Matthieu's public design collection, skills and writing. Use source URLs when citing results. Empty queries browse the available items. Page text describes the published guide; installing a skill is a separate action described on its page.",
    }
  )

  server.registerTool(
    "search_collection",
    {
      title: "Search the design collection",
      description:
        "Keyword search over curated resource names, descriptions, sections and categories. All query words must match; use a short query or an empty query to browse. Returns external resource links and their source page. Does not visit external sites.",
      inputSchema: {
        query,
        category: z
          .enum(navigation.map((entry) => entry.id) as [string, ...string[]])
          .optional(),
        limit,
        offset,
      },
      annotations: readOnly,
    },
    async ({ query, category, limit, offset }) => {
      const items = searchCollection(query, category)
      return result({
        total: items.length,
        results: items.slice(offset, offset + limit),
        next_offset: offset + limit < items.length ? offset + limit : null,
      })
    }
  )

  server.registerTool(
    "search_content",
    {
      title: "Search skills and writing",
      description:
        "Keyword search over published skill guides and articles, including their full page text. All query words must match. Empty query lists pages without fetching their text. Returns IDs for get_content, source URLs and excerpts. Reports any temporarily unavailable pages.",
      inputSchema: {
        query,
        kind: z.enum(["skill", "writing"]).optional(),
        limit,
        offset,
      },
      annotations: readOnly,
    },
    async ({ query, kind, limit, offset }) => {
      const entries = contentIndex.filter((item) => !kind || item.kind === kind)
      const terms = searchTerms(query)
      const pages = await Promise.allSettled(
        entries.map(async (item) => (terms.length ? readContent(item.id) : ""))
      )
      const unavailable: string[] = []
      const matches = entries.flatMap((entry, index) => {
        const page = pages[index]!
        if (page.status === "rejected") unavailable.push(entry.id)
        const markdown = page.status === "fulfilled" ? page.value : ""
        if (
          !matchesQuery(
            `${entry.title} ${entry.description} ${markdown}`,
            terms
          )
        )
          return []
        const position = terms.length
          ? Math.max(0, markdown.toLowerCase().indexOf(terms[0]!) - 80)
          : 0
        return [
          {
            ...entry,
            excerpt: markdown
              ? markdown.slice(position, position + 300)
              : entry.description,
          },
        ]
      })
      return result({
        total: matches.length,
        results: matches.slice(offset, offset + limit),
        next_offset: offset + limit < matches.length ? offset + limit : null,
        unavailable,
      })
    }
  )

  server.registerTool(
    "get_content",
    {
      title: "Read a skill guide or article",
      description:
        "Read a published page as Markdown using an ID from search_content. Includes its canonical source URL. Continue from next_offset to read longer pages. Interactive controls are omitted; skill guides include installation links rather than installing anything.",
      inputSchema: {
        id: contentId,
        offset,
        max_length: z.number().int().min(100).max(24_000).default(12_000),
      },
      annotations: readOnly,
    },
    async ({ id, offset, max_length }) => {
      try {
        const markdown = await readContent(id)
        return result({
          ...contentIndex.find((entry) => entry.id === id)!,
          markdown: markdown.slice(offset, offset + max_length),
          total_length: markdown.length,
          next_offset:
            offset + max_length < markdown.length ? offset + max_length : null,
        })
      } catch {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "This published page is temporarily unavailable. Try again or open its source URL from search_content.",
            },
          ],
        }
      }
    }
  )

  server.registerResource(
    "content-index",
    `${siteConfig.url}/mcp#content`,
    {
      title: "Published skills and writing",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(contentIndex),
        },
      ],
    })
  )

  server.registerResource(
    "design-collection",
    `${siteConfig.url}/mcp#collection`,
    {
      title: "Curated design collection",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(collectionIndex),
        },
      ],
    })
  )

  return server
}
