import { mcpServerCard } from "@/lib/mcp-metadata"

export const dynamic = "force-static"

export function GET() {
  return Response.json(mcpServerCard, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
