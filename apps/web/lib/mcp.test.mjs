import { expect, test } from "bun:test"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { GET, OPTIONS, POST } from "../app/api/mcp/route"
import { contentIndex, readPublishedContent } from "./mcp-content"
import { createMcpServer } from "./mcp-server"
async function withClient(read, run) {
  const server = createMcpServer(read),
    client = new Client({ name: "test-client", version: "1.0.0" }),
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await server.connect(serverTransport)
  await client.connect(clientTransport)
  try {
    await run(client)
  } finally {
    await client.close()
    await server.close()
  }
}
test("exposes only read-only tools and public indexes through the MCP SDK", async () => {
  await withClient(
    async () => "",
    async (client) => {
      const { tools } = await client.listTools()
      expect(tools.map((tool) => tool.name).sort()).toEqual([
        "get_content",
        "search_collection",
        "search_content",
      ])
      expect(
        tools.every(
          (tool) =>
            tool.annotations?.readOnlyHint && !tool.annotations.destructiveHint
        )
      ).toBe(!0)
      const { resources } = await client.listResources()
      expect(resources).toHaveLength(2)
      const index = await client.readResource({
        uri: "https://matthieu.pm/mcp#content",
      })
      expect(index.contents[0].text).not.toContain("product-bet")
      expect(index.contents[0].text).toContain("great-ui")
    }
  )
})
test("searches the real collection by keyword and category with pagination", async () => {
  await withClient(
    async () => "",
    async (client) => {
      const data = (
        await client.callTool({
          name: "search_collection",
          arguments: { query: "MOBBIN", category: "inspiration" },
        })
      ).structuredContent
      expect(data.total).toBe(1)
      expect(data.results).toEqual([
        expect.objectContaining({
          name: "Mobbin",
          url: "https://mobbin.com/",
          source: "https://matthieu.pm/inspirations#inspiration",
        }),
      ])
      const first = await client.callTool({
        name: "search_collection",
        arguments: { limit: 2 },
      })
      expect(first.structuredContent.next_offset).toBe(2)
      const second = await client.callTool({
        name: "search_collection",
        arguments: { limit: 2, offset: 2 },
      })
      expect(second.structuredContent.results).not.toEqual(
        first.structuredContent.results
      )
      const none = await client.callTool({
        name: "search_collection",
        arguments: { query: "unmatched-resource-xyz" },
      })
      expect(none.structuredContent.total).toBe(0)
      const invalid = await client.callTool({
        name: "search_collection",
        arguments: { limit: 1000 },
      })
      expect(invalid.isError).toBe(!0)
    }
  )
})
test("searches full page text, browses without fetching, and reports partial failures", async () => {
  let reads = 0
  await withClient(
    async (id) => {
      reads++
      if (id === "ai-product-manager") throw Error("Upstream unavailable")
      return id === "ux-writing"
        ? `# Write the interface
Help people recover from irreversible errors.`
        : "Other page text"
    },
    async (client) => {
      const browse = await client.callTool({
        name: "search_content",
        arguments: {},
      })
      expect(browse.structuredContent.total).toBe(contentIndex.length)
      expect(reads).toBe(0)
      const search = await client.callTool({
        name: "search_content",
        arguments: { query: "irreversible", kind: "writing" },
      })
      expect(search.structuredContent.results).toEqual([
        expect.objectContaining({
          id: "ux-writing",
          excerpt: expect.stringContaining("irreversible"),
        }),
      ])
      expect(search.structuredContent.unavailable).toEqual([
        "ai-product-manager",
      ])
    }
  )
})
test("reads long articles in complete chunks and rejects arbitrary paths", async () => {
  const markdown =
    `# An article
` + "Page text. ".repeat(3000)
  let reads = 0
  await withClient(
    async () => {
      reads++
      return markdown
    },
    async (client) => {
      let reconstructed = "",
        offset = 0
      do {
        const data = (
          await client.callTool({
            name: "get_content",
            arguments: { id: "ux-writing", offset },
          })
        ).structuredContent
        reconstructed += data.markdown
        expect(data.url).toBe("https://matthieu.pm/writing/ux-writing")
        if (data.next_offset === null) break
        offset = data.next_offset
      } while (offset < markdown.length)
      expect(reconstructed).toBe(markdown)
      const before = reads,
        invalid = await client.callTool({
          name: "get_content",
          arguments: { id: "http://127.0.0.1/private" },
        })
      expect(invalid.isError).toBe(!0)
      expect(reads).toBe(before)
    }
  )
  await expect(
    readPublishedContent("../private", "http://localhost:3001")
  ).rejects.toThrow("Unknown content ID")
})
test("returns a useful MCP error when a published page cannot be read", async () => {
  await withClient(
    async () => {
      throw Error("Secret upstream detail")
    },
    async (client) => {
      const response = await client.callTool({
        name: "get_content",
        arguments: { id: "great-ui" },
      })
      expect(response.isError).toBe(!0)
      expect(JSON.stringify(response)).toContain("temporarily unavailable")
      expect(JSON.stringify(response)).not.toContain("Secret upstream detail")
    }
  )
})
test("supports repeated stateless HTTP requests using the official client", async () => {
  const client = new Client({ name: "http-test", version: "1.0.0" }),
    transport = new StreamableHTTPClientTransport(
      new URL("http://localhost:3001/api/mcp"),
      {
        fetch: async (input, init) => {
          const request = new Request(input, init)
          return request.method === "POST" ? POST(request) : GET(request)
        },
      }
    )
  try {
    await client.connect(transport)
    expect((await client.listTools()).tools).toHaveLength(3)
    const [collection, pages] = await Promise.all([
      client.callTool({
        name: "search_collection",
        arguments: { query: "typography" },
      }),
      client.callTool({ name: "search_content", arguments: {} }),
    ])
    expect(collection.isError).not.toBe(!0)
    expect(pages.structuredContent.total).toBe(4)
  } finally {
    await client.close()
  }
})
test("validates origins, handles preflight and malformed or oversized messages", async () => {
  const url = "http://localhost:3001/api/mcp"
  expect(
    (
      await POST(
        new Request(url, {
          method: "POST",
          headers: { Origin: "https://untrusted.example" },
          body: "{}",
        })
      )
    ).status
  ).toBe(403)
  const preflight = OPTIONS(
    new Request(url, {
      method: "OPTIONS",
      headers: { Origin: "https://claude.ai" },
    })
  )
  expect(preflight.status).toBe(204)
  expect(preflight.headers.get("Access-Control-Allow-Origin")).toBe(
    "https://claude.ai"
  )
  expect(GET(new Request(url)).status).toBe(405)
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  }
  expect(
    (await POST(new Request(url, { method: "POST", headers, body: "{" })))
      .status
  ).toBe(400)
  expect(
    (
      await POST(
        new Request(url, { method: "POST", headers, body: " ".repeat(20000) })
      )
    ).status
  ).toBe(413)
})
