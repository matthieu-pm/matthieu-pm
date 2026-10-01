/** OKLab's inverse transform, followed by linear sRGB / Display-P3 gamut checks. */
export function linearRgb(lightness: number, chroma: number, hue: number) {
  const angle = (hue * Math.PI) / 180
  const a = chroma * Math.cos(angle)
  const b = chroma * Math.sin(angle)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ] as const
}
export function maximumChroma(
  lightness: number,
  hue: number,
  gamut: "srgb" | "p3"
) {
  if (lightness <= 0 || lightness >= 1) return 0
  let low = 0,
    high = 0.4
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    const [r, g, b] = linearRgb(lightness, mid, hue)
    const channels =
      gamut === "srgb"
        ? [r, g, b]
        : [
            0.8224619687 * r + 0.1775380313 * g,
            0.0331941989 * r + 0.9668058011 * g,
            0.0170826307 * r + 0.0723974407 * g + 0.9105199286 * b,
          ]
    if (channels.every((value) => value >= 0 && value <= 1)) low = mid
    else high = mid
  }
  return low
}
export function rgbByte(linear: number) {
  const encoded =
    linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055
  return Math.round(Math.max(0, Math.min(1, encoded)) * 255)
}

function luminance(channels: readonly number[]) {
  const [r = 0, g = 0, b = 0] = channels.map((channel) => Math.max(0, Math.min(1, channel)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hslLinearRgb(hue: number, saturation: number, lightness: number) {
  const amplitude = saturation * Math.min(lightness, 1 - lightness)
  return [0, 8, 4].map((offset) => {
    const k = (offset + hue / 30) % 12
    const channel = lightness - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
}

/** Invert background lightness, preserving its hue and enough contrast to read. */
export function contrastingText(model: "oklch" | "hsl", lightness: number, hue: number) {
  const isOklch = model === "oklch"
  const background = luminance(isOklch
    ? linearRgb(lightness, 0.16, hue)
    : hslLinearRgb(hue, 1, lightness))
  const tint = (value: number) => {
    const chroma = Math.min(0.1, maximumChroma(value, hue, "srgb"))
    const foreground = luminance(isOklch
      ? linearRgb(value, chroma, hue)
      : hslLinearRgb(hue, 1, value))
    return {
      color: isOklch
        ? `oklch(${value} ${chroma} ${hue})`
        : `hsl(${hue} 100% ${value * 100}%)`,
      contrast: (Math.max(background, foreground) + 0.05)
        / (Math.min(background, foreground) + 0.05),
    }
  }
  const inverted = 1 - lightness
  const opposite = tint(inverted)
  if (opposite.contrast >= 4.5) return opposite.color

  // Find the closest readable lightness instead of selecting a preset text color.
  const endpoint = tint(1).contrast >= tint(0).contrast ? 1 : 0
  let unreadable = inverted
  let readable = endpoint
  for (let step = 0; step < 24; step++) {
    const candidate = (unreadable + readable) / 2
    if (tint(candidate).contrast >= 4.5) readable = candidate
    else unreadable = candidate
  }
  return tint(readable).color
}
