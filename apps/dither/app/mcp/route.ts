import { corsHeaders, handleMcp } from "../../lib/mcp"

export const runtime = "nodejs"
export const maxDuration = 30
export const POST = handleMcp

export function GET(request: Request) {
  const headers = corsHeaders(request)
  if (!headers) return new Response("Forbidden origin", { status: 403 })
  headers.set("Allow", "POST, OPTIONS")
  headers.set("Link", '</llms.txt>; rel="describedby"; type="text/plain"')
  return new Response(
    "Use a Streamable HTTP MCP client with POST. Documentation: https://dither.matthieu.pm/#mcp",
    { status: 405, headers }
  )
}

export function OPTIONS(request: Request) {
  const headers = corsHeaders(request)
  if (!headers) return new Response("Forbidden origin", { status: 403 })
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id"
  )
  return new Response(null, { status: 204, headers })
}
