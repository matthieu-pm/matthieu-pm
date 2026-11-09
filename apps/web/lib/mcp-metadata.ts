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

const mcpEndpointPath = "/api/mcp"
const mcpEndpoint = `${siteConfig.url}${mcpEndpointPath}`

// Keep SEP-1649 transport metadata and the endpoint fields DNS-AID clients read.
export const mcpServerCard = {
  serverInfo: mcpServerInfo,
  endpoint: mcpEndpoint,
  endpoints: { mcp: mcpEndpointPath },
  transport: {
    type: "streamable-http",
    endpoint: mcpEndpoint,
  },
  capabilities: mcpCapabilities,
}
