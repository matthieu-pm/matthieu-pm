import { NextResponse, type NextRequest } from "next/server"

import { prefersMarkdown } from "./lib/content-negotiation"

export function proxy(request: NextRequest) {
  let response = NextResponse.next()

  if (
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
