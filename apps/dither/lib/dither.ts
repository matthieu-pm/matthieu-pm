export type DitherOptions = {
  pixel_size: number
  color_levels: number
  strength: number
  grain: number
}

export const presets = {
  classic: { pixel_size: 4, color_levels: 4, strength: 1, grain: 0.035 },
  fine: { pixel_size: 2, color_levels: 6, strength: 1, grain: 0.015 },
  soft: { pixel_size: 3, color_levels: 5, strength: 0.7, grain: 0.02 },
} satisfies Record<string, DitherOptions>

export function bayer8(x: number, y: number) {
  const b2 = (a: number, b: number) => (2 * (a & 1) + 3 * (b & 1)) % 4
  return (
    (16 * b2(x, y) + 4 * b2(x >> 1, y >> 1) + b2(x >> 2, y >> 2) + 0.5) / 64
  )
}

function noise(x: number, y: number, channel: number) {
  let h =
    (Math.imul(x, 374761393) ^
      Math.imul(y, 668265263) ^
      Math.imul(channel + 1, 1274126177)) >>>
    0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  h = (h ^ (h >>> 16)) >>> 0
  return (h & 65535) / 65535 - 0.5
}

/** Shared by the browser worker and MCP renderer. Input/output are sRGB RGBA. */
export function ditherPixels(
  source: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  options: DitherOptions
) {
  if (source.length !== width * height * 4)
    throw new Error("Invalid RGBA dimensions")
  const output = new Uint8ClampedArray(source.length)
  const { pixel_size: size, color_levels, strength, grain } = options
  if (strength === 0) {
    output.set(source)
    return output
  }
  const levels = color_levels - 1
  for (let cy = 0; cy < Math.ceil(height / size); cy++) {
    for (let cx = 0; cx < Math.ceil(width / size); cx++) {
      const sx = Math.min(width - 1, Math.floor((cx + 0.5) * size))
      const sy = Math.min(height - 1, Math.floor((cy + 0.5) * size))
      const sample = (sy * width + sx) * 4
      const threshold = bayer8(cx, cy)
      const colors = [0, 1, 2].map((channel) => {
        const c = source[sample + channel]! / 255
        const noisy = Math.min(
          1,
          Math.max(0, c + noise(cx, cy, channel) * grain)
        )
        const quantized = Math.floor(noisy * levels + threshold) / levels
        return Math.round((c + (quantized - c) * strength) * 255)
      })
      for (let y = cy * size; y < Math.min(height, (cy + 1) * size); y++) {
        for (let x = cx * size; x < Math.min(width, (cx + 1) * size); x++) {
          const index = (y * width + x) * 4
          output[index] = colors[0]!
          output[index + 1] = colors[1]!
          output[index + 2] = colors[2]!
          output[index + 3] = source[index + 3]!
        }
      }
    }
  }
  return output
}
