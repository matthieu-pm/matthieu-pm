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
