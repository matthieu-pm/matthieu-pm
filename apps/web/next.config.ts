import type { NextConfig } from "next"
import { fileURLToPath } from "node:url"

const nextConfig: NextConfig = {
  async headers() {
    return [
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
            value: '</llms.txt>; rel="describedby"; type="text/plain"',
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
