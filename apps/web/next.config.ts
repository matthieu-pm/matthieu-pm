import type { NextConfig } from "next"
import { fileURLToPath } from "node:url"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/llms.md",
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
        ],
      },
      {
        source: "/.well-known/ai-catalog.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/.well-known/agent-skills/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</llms.md>; rel="describedby"; type="text/markdown", </.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "matthieu-pm.vercel.app",
          },
        ],
        destination: "https://matthieu.pm/:path*",
        permanent: true,
      },
    ]
  },
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
}

export default nextConfig
