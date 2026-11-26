import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./styles.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://dither.matthieu.pm"),
  title: "Dither — a little image laboratory",
  description:
    "Turn smooth images into tiny patterns. An ordered dithering studio and public MCP tool by Matthieu Duchatellier.",
  alternates: { canonical: "/" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
