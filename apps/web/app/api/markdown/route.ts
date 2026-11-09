import type { NextRequest } from "next/server"

import { htmlToMarkdown } from "@/lib/markdown"
import { siteConfig } from "@/app/site-config"

export async function GET(request: NextRequest) {
  const path = request.headers.get("x-markdown-path")
  if (!path?.startsWith("/")) {
    return new Response("Not found", { status: 404 })
  }

  // Use this deployment's origin, never a caller-supplied fetch destination.
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : request.nextUrl.origin
  const source = new URL(origin)
  if (
    !process.env.VERCEL &&
    !["localhost", "127.0.0.1", "[::1]"].includes(source.hostname)
  ) {
    return new Response("Invalid origin", { status: 400 })
  }
  source.pathname = path
  source.search = request.headers.get("x-markdown-query") ?? ""
  if (/^\/(api|_next)(\/|$)/.test(source.pathname)) {
    return new Response("Not found", { status: 404 })
  }

  const headers = new Headers({ Accept: "text/html" })
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers.set(
      "x-vercel-protection-bypass",
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    )
  }

  let upstream: Response
  try {
    upstream = await fetch(source, {
      headers,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return new Response("Unable to retrieve page", { status: 502 })
  }

  if (!upstream.headers.get("content-type")?.includes("text/html")) {
    return upstream
  }

  const pageUrl = new URL(source.pathname + source.search, siteConfig.url)
  const markdown = htmlToMarkdown(await upstream.text(), pageUrl.href)
  const responseHeaders = new Headers(upstream.headers)
  for (const name of [
    "content-length",
    "content-encoding",
    "content-range",
    "etag",
    "last-modified",
  ]) {
    responseHeaders.delete(name)
  }
  responseHeaders.set("Content-Type", "text/markdown; charset=utf-8")
  responseHeaders.set("Cache-Control", "private, no-store")
  responseHeaders.append("Vary", "Accept")

  return new Response(markdown, {
    status: upstream.status,
    headers: responseHeaders,
  })
}
