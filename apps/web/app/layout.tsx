import type { Metadata } from "next"
import { GeistPixelSquare } from "geist/font/pixel"
import { Inter } from "next/font/google"

import "@workspace/ui/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Matthieu Duchatellier — Product Manager",
  description:
    "Product Manager working across strategy, growth, UX, and AI-enabled product delivery.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${GeistPixelSquare.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
