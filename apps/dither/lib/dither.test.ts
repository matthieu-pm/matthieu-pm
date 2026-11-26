import { describe, expect, test } from "bun:test"
import sharp from "sharp"
import { bayer8, ditherPixels, presets } from "./dither"
import {
  decodeBase64,
  fetchImage,
  isPublicAddress,
  validateImageUrl,
} from "./image-source"
import { renderImage } from "./render"
import { handleMcp } from "./mcp"

describe("Bayer dithering", () => {
  test("8×8 ordered thresholds cover the entire matrix once", () => {
    const thresholds = Array.from({ length: 64 }, (_, i) =>
      bayer8(i % 8, Math.floor(i / 8))
    )
    expect(new Set(thresholds).size).toBe(64)
    expect([...thresholds].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 64 }, (_, i) => (i + 0.5) / 64)
    )
    expect(bayer8(0, 0)).toBe(0.5 / 64)
    expect(bayer8(1, 0)).toBe(32.5 / 64)
    expect(bayer8(0, 1)).toBe(48.5 / 64)
    expect(bayer8(8, 8)).toBe(bayer8(0, 0))
  })

  test("half gray becomes equal black and white, with the expected spatial ordering", () => {
    const source = new Uint8Array(8 * 8 * 4).fill(128)
    for (let i = 3; i < source.length; i += 4) source[i] = 255
    const output = ditherPixels(source, 8, 8, {
      pixel_size: 1,
      color_levels: 2,
      strength: 1,
      grain: 0,
    })
    const red = Array.from({ length: 64 }, (_, i) => output[i * 4])
    expect(red.filter((value) => value === 255).length).toBe(32)
    expect(red.slice(0, 8)).toEqual([0, 255, 0, 255, 0, 255, 0, 255])
    expect(new Set(red)).toEqual(new Set([0, 255]))
  })

  test("zero strength returns exact source pixels, and every alpha value survives", () => {
    const source = new Uint8Array(7 * 5 * 4).map((_, i) => (i * 59) % 256)
    expect(
      Array.from(
        ditherPixels(source, 7, 5, { ...presets.classic, strength: 0 })
      )
    ).toEqual(Array.from(source))
    const result = ditherPixels(source, 7, 5, presets.classic)
    for (let i = 3; i < source.length; i += 4) expect(result[i]).toBe(source[i])
    expect(result).toEqual(ditherPixels(source, 7, 5, presets.classic))
  })

  test("PNG output keeps alpha, fits inside the requested bounds, and rejects unsupported input", async () => {
    const source = await sharp({
      create: {
        width: 128,
        height: 256,
        channels: 4,
        background: { r: 120, g: 80, b: 40, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer()
    const rendered = await renderImage({
      image_base64: source.toString("base64"),
      max_width: 64,
    })
    expect(rendered.metadata.width).toBe(32)
    expect(rendered.metadata.height).toBe(64)
    const decoded = await sharp(rendered.png)
      .raw()
      .toBuffer({ resolveWithObject: true })
    expect(decoded.info.channels).toBe(4)
    expect(decoded.data[3]).toBe(128)
    await expect(
      renderImage({
        image_base64: source.toString("base64"),
        image_url: "https://example.com/image.jpg",
      })
    ).rejects.toThrow("exactly one")
    const svg = Buffer.from(
      '<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="red"/></svg>'
    )
    await expect(
      renderImage({ image_base64: svg.toString("base64") })
    ).rejects.toThrow("Supported formats")
  })

  test("orientation is corrected before fitting", async () => {
    const source = await sharp({
      create: { width: 80, height: 40, channels: 3, background: "red" },
    })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer()
    const { metadata } = await renderImage({
      image_base64: source.toString("base64"),
      max_width: 64,
    })
    expect([metadata.width, metadata.height]).toEqual([32, 64])
  })
})

describe("image source boundaries", () => {
  test("private, mapped and reserved IP ranges are rejected", () => {
    for (const address of [
      "127.0.0.1",
      "10.1.2.3",
      "172.16.0.1",
      "192.168.1.1",
      "169.254.169.254",
      "0.0.0.0",
      "100.64.0.1",
      "224.1.1.1",
      "::1",
      "fc00::1",
      "fe80::1",
      "::ffff:127.0.0.1",
      "2001:db8::1",
    ])
      expect(isPublicAddress(address)).toBe(false)
    expect(isPublicAddress("1.1.1.1")).toBe(true)
    expect(isPublicAddress("2606:4700:4700::1111")).toBe(true)
  })

  test("URL validation and resolved-address checks block local fetches", async () => {
    for (const url of [
      "http://example.com/a",
      "file:///etc/passwd",
      "https://user:pass@example.com/a",
      "https://example.com:3000/a",
      "https://localhost/a",
      "https://foo.local/a",
    ])
      expect(() => validateImageUrl(url)).toThrow()
    for (const url of [
      "https://127.0.0.1/a",
      "https://[::1]/a",
      "https://169.254.169.254/latest/meta-data",
    ])
      await expect(fetchImage(url)).rejects.toThrow("Private or reserved")
    expect(() => decodeBase64("not base64!")).toThrow("Invalid")
    expect(decodeBase64("data:image/png;base64,YWJj").toString()).toBe("abc")
  })
})

async function rpc(
  method: string,
  params: unknown = {},
  id = 1,
  origin?: string
) {
  return handleMcp(
    new Request("https://dither.matthieu.pm/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "MCP-Protocol-Version": "2025-11-25",
        ...(origin ? { Origin: origin } : {}),
      },
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    })
  )
}

describe("MCP protocol", () => {
  test("initializes, lists tools and renders an image via the stateless HTTP transport", async () => {
    const init = await rpc("initialize", {
      protocolVersion: "2025-11-25",
      clientInfo: { name: "test", version: "1" },
      capabilities: {},
    })
    expect(init.status).toBe(200)
    expect((await init.json()).result.serverInfo.name).toBe("dither")
    const list = await rpc("tools/list")
    const tools = (await list.json()).result.tools
    expect(tools.map((tool: { name: string }) => tool.name)).toEqual([
      "dither_image",
      "get_dither_presets",
      "get_dither_shader",
    ])
    expect(tools[0].inputSchema.properties.image_url).toBeDefined()
    const source = await sharp({
      create: { width: 16, height: 16, channels: 3, background: "#387f9a" },
    })
      .png()
      .toBuffer()
    const call = await rpc("tools/call", {
      name: "dither_image",
      arguments: { image_base64: source.toString("base64") },
    })
    const result = (await call.json()).result
    expect(result.isError).not.toBe(true)
    expect(result.content[0].type).toBe("image")
    expect(result.structuredContent.width).toBe(16)
    const metadata = await sharp(
      Buffer.from(result.content[0].data, "base64")
    ).metadata()
    expect(metadata.format).toBe("png")
    expect(metadata.width).toBe(16)
  })

  test("rejects unexpected origins and reports invalid tool arguments", async () => {
    expect(
      (await rpc("tools/list", {}, 1, "https://unrelated.example")).status
    ).toBe(403)
    const response = await rpc("tools/call", {
      name: "dither_image",
      arguments: { pixel_size: 99 },
    })
    expect((await response.json()).result.isError).toBe(true)
    const privateImage = await rpc("tools/call", {
      name: "dither_image",
      arguments: { image_url: "https://127.0.0.1/image.png" },
    })
    expect((await privateImage.json()).result.isError).toBe(true)
  })
})
