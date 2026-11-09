import sitemap from "../sitemap"

export const dynamic = "force-static"

export function GET() {
  const content = [
    "# Sitemap",
    "",
    ...sitemap().map((entry) => `- <${entry.url}>`),
    "",
  ].join("\n")

  return new Response(content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
