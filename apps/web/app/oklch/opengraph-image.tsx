import { ImageResponse } from "next/og"

export const alt = "OKLCH color guide with a spectrum of color swatches"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 80,
        background: "#fafafa",
        color: "#171717",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
        {[
          "#9575ed",
          "#6595ee",
          "#40adb9",
          "#4fb98c",
          "#98b95a",
          "#d6ad52",
          "#ec927c",
        ].map((color) => (
          <div
            key={color}
            style={{
              width: 72,
              height: 96,
              borderRadius: 20,
              background: color,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3 }}>
        OKLCH color guide
      </div>
      <div style={{ fontSize: 32, color: "#525252", marginTop: 20 }}>
        Lightness, chroma, hue, and CSS. Explained visually.
      </div>
      <div style={{ fontSize: 24, color: "#737373", marginTop: 52 }}>
        matthieu.pm/oklch
      </div>
    </div>,
    size
  )
}
