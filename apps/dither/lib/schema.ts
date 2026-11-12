import { z } from "zod"
import { presets } from "./dither"

export const MAX_BASE64_BYTES = 2_750_000
export const MAX_REMOTE_BYTES = 8_000_000
export const MAX_INPUT_PIXELS = 24_000_000
export const MAX_OUTPUT_BYTES = 2_900_000

export const imageSchema = z
  .object({
    image_url: z
      .string()
      .url()
      .max(2048)
      .optional()
      .describe(
        "Public HTTPS URL of a PNG, JPEG, WebP or AVIF image. Mutually exclusive with image_base64."
      ),
    image_base64: z
      .string()
      .max(Math.ceil(MAX_BASE64_BYTES / 3) * 4 + 64)
      .optional()
      .describe(
        "Base64 image bytes or a data URL, up to 2.75 MB decoded. Mutually exclusive with image_url."
      ),
    preset: z.enum(["classic", "fine", "soft"]).default("classic"),
    pixel_size: z
      .number()
      .int()
      .min(1)
      .max(16)
      .optional()
      .describe("Square pixel size in output pixels; overrides the preset."),
    color_levels: z
      .number()
      .int()
      .min(2)
      .max(16)
      .optional()
      .describe("Quantization levels per RGB channel; overrides the preset."),
    strength: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe("Effect strength. Zero preserves decoded source pixels."),
    grain: z
      .number()
      .min(0)
      .max(0.2)
      .optional()
      .describe("Deterministic colored grain before quantization."),
    max_width: z
      .number()
      .int()
      .min(64)
      .max(4096)
      .default(2048)
      .describe(
        "Fit inside this width and height without enlarging. Default 2048, max 4096."
      ),
  })
  .strict()
  .refine((input) => Boolean(input.image_url) !== Boolean(input.image_base64), {
    message: "Provide exactly one of image_url or image_base64",
  })

export type ImageInput = z.infer<typeof imageSchema>

export function resolveOptions(input: ImageInput) {
  return {
    pixel_size: input.pixel_size ?? presets[input.preset].pixel_size,
    color_levels: input.color_levels ?? presets[input.preset].color_levels,
    strength: input.strength ?? presets[input.preset].strength,
    grain: input.grain ?? presets[input.preset].grain,
  }
}
