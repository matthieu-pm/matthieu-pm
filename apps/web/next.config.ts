import type { NextConfig } from "next"
import { fileURLToPath } from "node:url"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
}

export default nextConfig
