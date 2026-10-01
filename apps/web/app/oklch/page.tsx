import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { PageShell } from "./page-controls"
import { ReferenceContent } from "./reference-content"
import "./reference.css"
import "./oklch.css"

export const metadata: Metadata = {
  title: "OKLCH — Explore color as we see it",
  description:
    "Learn how OKLCH works with interactive color, lightness, gradient, and gamut examples.",
  alternates: { canonical: "/oklch" },
}

export default function OklchPage() {
  return (
    <PageShell className={GeistMono.variable}>
      <ReferenceContent />
    </PageShell>
  )
}
