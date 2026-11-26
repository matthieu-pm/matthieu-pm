import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { presets } from "./dither"
import { imageSchema } from "./schema"
import { renderImage } from "./render"
import { fragmentShader } from "./shader"

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
}

export function createDitherServer() {
  const server = new McpServer(
    { name: "dither", version: "1.0.0" },
    {
      instructions:
        "Apply deterministic Bayer ordered dithering to images. Use get_dither_presets to choose settings, then dither_image. The returned image content is a PNG: save its base64 bytes to a .png file. Images are processed in memory and are not stored. URLs must be public HTTPS. This recreates a dithering style; it does not identify a reference screenshot's exact shader.",
    }
  )
  server.registerTool(
    "dither_image",
    {
      title: "Dither an image",
      description:
        "Apply Bayer 8×8 ordered dithering, square pixelation, RGB color quantization and optional deterministic color grain. Accepts exactly one of a public HTTPS image_url (up to 8 MB) or image_base64 (up to 2.75 MB decoded). Still PNG/JPEG/WebP/AVIF only, up to 24 megapixels. Fits inside max_width × max_width, default 2048, maximum 4096; never enlarges. Preserves alpha and corrects EXIF orientation. Returns PNG image content and settings metadata, without storing uploads or creating a hosted URL. Output PNG is capped at 2.9 MB; reduce max_width if needed.",
      inputSchema: imageSchema,
      annotations: { ...annotations, openWorldHint: true },
    },
    async (input) => {
      try {
        const { png, metadata } = await renderImage(input)
        return {
          content: [
            {
              type: "image",
              mimeType: "image/png",
              data: png.toString("base64"),
            },
            { type: "text", text: JSON.stringify(metadata) },
          ],
          structuredContent: metadata,
        }
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text:
                error instanceof Error
                  ? error.message.slice(0, 500)
                  : "Could not process this image",
            },
          ],
        }
      }
    }
  )
  server.registerTool(
    "get_dither_presets",
    {
      title: "Get dithering presets",
      description:
        "List the classic, fine and soft presets with their exact settings. Individual settings can be overridden in dither_image.",
      inputSchema: {},
      annotations,
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(presets) }],
      structuredContent: { presets },
    })
  )
  server.registerTool(
    "get_dither_shader",
    {
      title: "Get the GLSL dithering shader",
      description:
        "Get the WebGL 2 fragment shader implementing this effect, including uniform names and texture orientation instructions. Does not render an image.",
      inputSchema: {},
      annotations,
    },
    async () => ({ content: [{ type: "text", text: fragmentShader }] })
  )
  return server
}

export function corsHeaders(request: Request) {
  const headers = new Headers({ "Cache-Control": "no-store", Vary: "Origin" })
  const origin = request.headers.get("origin")
  const allowed = new Set([
    new URL(request.url).origin,
    "https://dither.matthieu.pm",
    "https://chatgpt.com",
    "https://chat.openai.com",
    "https://claude.ai",
  ])
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`)
  if (process.env.NODE_ENV !== "production")
    allowed.add("http://localhost:6274")
  if (origin && !allowed.has(origin)) return null
  if (origin) headers.set("Access-Control-Allow-Origin", origin)
  return headers
}

export async function handleMcp(request: Request) {
  const headers = corsHeaders(request)
  if (!headers) return new Response("Forbidden origin", { status: 403 })
  const server = createDitherServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 3_900_000,
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
