import { NextResponse, type NextRequest } from "next/server"

import { prefersMarkdown } from "./lib/content-negotiation"
import { mcpEndpointPath } from "./lib/mcp-metadata"

export function proxy(request: NextRequest) {
  let response = NextResponse.next()
  const acceptsEventStream = (request.headers.get("accept") ?? "")
    .split(",")
    .some((type) => type.trim().toLowerCase().split(";")[0] === "text/event-stream")

  if (
    request.nextUrl.pathname === mcpEndpointPath &&
    (!["GET", "HEAD"].includes(request.method) || acceptsEventStream)
  ) {
    // Share the public /mcp URL between the connection guide and the transport.
    const destination = request.nextUrl.clone()
    destination.pathname = "/api/mcp"
    response = NextResponse.rewrite(destination)
  } else if (
    ["GET", "HEAD"].includes(request.method) &&
    !request.headers.has("rsc") &&
    prefersMarkdown(request.headers.get("accept"))
  ) {
    const destination = new URL("/api/markdown", request.url)
    const headers = new Headers(request.headers)
    headers.set("x-markdown-path", request.nextUrl.pathname)
    headers.set("x-markdown-query", request.nextUrl.search)
    response = NextResponse.rewrite(destination, { request: { headers } })
  }

  response.headers.append("Vary", "Accept")
  return response
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|.*\\.[^/]+$).*)"],
}
