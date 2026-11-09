import sitemap from "../sitemap"

export const dynamic = "force-static"

export function GET() {
  const content = sitemap().map((entry) => entry.url).join("\n") + "\n"

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
