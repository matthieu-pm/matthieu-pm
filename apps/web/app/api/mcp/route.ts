import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"

import { siteConfig } from "@/app/site-config"
import { readPublishedContent } from "@/lib/mcp-content"
import { createMcpServer } from "@/lib/mcp-server"

export const runtime = "nodejs"

function responseHeaders(request: Request) {
  const headers = new Headers({ "Cache-Control": "no-store", Vary: "Origin" })
  const origin = request.headers.get("origin")
  const allowed = new Set([
    // Browser WebMCP calls come from the current deployment, including aliases.
    new URL(request.url).origin,
    siteConfig.url,
    "https://claude.ai",
    "https://chatgpt.com",
    "https://chat.openai.com",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ])
  if (process.env.NODE_ENV !== "production") {
    const local = new URL(request.url)
    if (["localhost", "127.0.0.1", "[::1]"].includes(local.hostname))
      allowed.add(local.origin)
    allowed.add("http://localhost:6274")
  }
  if (origin && !allowed.has(origin)) return null
  if (origin) headers.set("Access-Control-Allow-Origin", origin)
  return headers
}

export async function POST(request: Request) {
  const headers = responseHeaders(request)
  if (!headers) return new Response("Forbidden origin", { status: 403 })

  // A fresh stateless server per request works across serverless instances.
  const server = createMcpServer((id) => readPublishedContent(id, request.url))
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 16_384,
  })
  try {
    await server.connect(transport)
    const response = await transport.handleRequest(request)
    headers.forEach((value, name) => response.headers.set(name, value))
    return response
  } finally {
    await server.close()
  }
}

export function GET(request: Request) {
  const headers = responseHeaders(request)
  if (!headers) return new Response("Forbidden origin", { status: 403 })
  headers.set("Allow", "POST, OPTIONS")
  return new Response(
    "Use a Streamable HTTP MCP client with POST. Connection guide: /mcp",
    { status: 405, headers }
  )
}

export function OPTIONS(request: Request) {
  const headers = responseHeaders(request)
  if (!headers) return new Response("Forbidden origin", { status: 403 })
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id"
  )
  return new Response(null, { status: 204, headers })
}
