import { siteConfig } from "../site-config"

export const dynamic = "force-static"

export function GET() {
  const content = [
    "User-Agent: *",
    "Content-Signal: ai-train=no, search=yes, ai-input=no",
    "Allow: /",
    "",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    `Agentmap: ${siteConfig.url}/.well-known/ai-catalog.json`,
    `Host: ${siteConfig.url}`,
    "",
  ].join("\n")

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
