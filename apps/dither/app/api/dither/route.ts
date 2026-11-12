import { corsHeaders } from "../../../lib/mcp"
import { renderImage } from "../../../lib/render"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(request: Request) {
  const headers = corsHeaders(request)
  if (!headers) return new Response("Forbidden origin", { status: 403 })
  if (!request.headers.get("content-type")?.includes("application/json"))
    return new Response("Use application/json", { status: 415 })
  // Bound the streamed body as well as Content-Length, which may be absent.
  const reader = request.body?.getReader()
  if (!reader) return new Response("Missing request body", { status: 400 })
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.length
      if (length > 3_900_000) {
        await reader.cancel()
        return new Response("Request too large", { status: 413, headers })
      }
      chunks.push(value)
    }
    const body = Buffer.concat(chunks)
    const { png, metadata } = await renderImage(
      JSON.parse(body.toString("utf8"))
    )
    headers.set("Content-Type", "image/png")
    headers.set("Content-Disposition", 'attachment; filename="dither.png"')
    headers.set("X-Image-Width", String(metadata.width))
    headers.set("X-Image-Height", String(metadata.height))
    return new Response(new Uint8Array(png), { headers })
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Could not process image",
      },
      { status: 400, headers }
    )
  }
}
