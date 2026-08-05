import type { NextConfig } from "next"
import { fileURLToPath } from "node:url"

const nextConfig: NextConfig = {
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
