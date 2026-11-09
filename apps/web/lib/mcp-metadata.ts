import { siteConfig } from "../app/site-config"

export const mcpServerInfo = {
  name: "matthieu-pm",
  version: "1.0.0",
  websiteUrl: siteConfig.url,
}

export const mcpCapabilities = {
  tools: { listChanged: true },
  resources: { listChanged: true },
}

// Compatibility card for discovery clients using the original SEP-1649 format.
export const mcpServerCard = {
  serverInfo: mcpServerInfo,
  transport: {
    type: "streamable-http",
    endpoint: `${siteConfig.url}/api/mcp`,
  },
  capabilities: mcpCapabilities,
}
