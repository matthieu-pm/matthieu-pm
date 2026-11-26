import sharp from "sharp"
import { ditherPixels } from "./dither"
import { decodeBase64, fetchImage } from "./image-source"
import {
  imageSchema,
  MAX_INPUT_PIXELS,
  MAX_OUTPUT_BYTES,
  resolveOptions,
} from "./schema"

export async function renderImage(value: unknown) {
  const input = imageSchema.parse(value)
  const source = input.image_url
    ? await fetchImage(input.image_url)
    : decodeBase64(input.image_base64!)
  const decoder = sharp(source, {
    limitInputPixels: MAX_INPUT_PIXELS,
    failOn: "error",
  })
  const metadata = await decoder.metadata()
  if (!["png", "jpeg", "webp", "avif", "heif"].includes(metadata.format ?? ""))
    throw new Error("Supported formats: PNG, JPEG, WebP and AVIF")
  if ((metadata.pages ?? 1) > 1)
    throw new Error("Use a still image; animated images are not supported")
  const { data, info } = await decoder
    .autoOrient()
    .resize({
      width: input.max_width,
      height: input.max_width,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toColourspace("srgb")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const options = resolveOptions(input)
  const pixels = ditherPixels(data, info.width, info.height, options)
  const png = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer()
  if (png.length > MAX_OUTPUT_BYTES)
    throw new Error(
      "Output exceeds the response limit; reduce max_width, color_levels or grain"
    )
  return {
    png,
    metadata: {
      width: info.width,
      height: info.height,
      mime_type: "image/png",
      bytes: png.length,
      algorithm: "bayer8",
      preset: input.preset,
      ...options,
    },
  }
}
