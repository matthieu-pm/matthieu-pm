import { ditherPixels, type DitherOptions } from "../lib/dither"

let source:
  | { pixels: Uint8ClampedArray; width: number; height: number }
  | undefined

self.onmessage = (
  event: MessageEvent<
    | {
        type: "source"
        pixels: Uint8ClampedArray
        width: number
        height: number
      }
    | { type: "render"; options: DitherOptions; id: number }
  >
) => {
  const message = event.data
  if (message.type === "source") {
    source = message
    return
  }
  if (!source) return
  try {
    const pixels = ditherPixels(
      source.pixels,
      source.width,
      source.height,
      message.options
    )
    self.postMessage(
      { pixels, width: source.width, height: source.height, id: message.id },
      { transfer: [pixels.buffer] }
    )
  } catch {
    self.postMessage({
      error: "Could not render this image. Try a smaller output size.",
      id: message.id,
    })
  }
}
