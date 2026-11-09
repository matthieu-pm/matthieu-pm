export type WebMcpTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: { readOnlyHint: boolean }
  execute: (
    input: Record<string, unknown>,
    options?: { signal?: AbortSignal }
  ) => Promise<unknown>
}

type ModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options: { signal: AbortSignal }
  ) => Promise<void> | void
  unregisterTool?: (name: string) => void
}

type ToolDefinition = Pick<WebMcpTool, "name" | "description" | "inputSchema">

type Environment = {
  document: { modelContext?: ModelContext }
  navigator: { modelContext?: ModelContext }
  fetch: typeof fetch
  navigate: (path: string) => void
  paths: string[]
}

// Keep the browser tools' schemas, validation and results identical to the MCP
// server, without shipping the SDK or the design catalogues to every browser.
async function requestMcp(
  fetcher: typeof fetch,
  method: string,
  params: Record<string, unknown>,
  signal: AbortSignal
) {
  const response = await fetcher("/api/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(20_000)]),
  })
  if (!response.ok)
    throw new Error("The site's tools are temporarily unavailable.")
  const message = await response.json()
  if (message.error || !message.result)
    throw new Error("The site could not complete this tool request.")
  return message.result
}

export async function registerWebMcpTools(
  environment: Environment,
  signal: AbortSignal
) {
  const { document, navigator, fetch: fetcher, navigate, paths } = environment
  const context = document.modelContext ?? navigator.modelContext
  if (!context?.registerTool || signal.aborted) return

  const names = new Set<string>()
  // Early Chromium implementations use navigator.modelContext and an explicit
  // unregister method instead of honoring the registration's AbortSignal.
  if (!document.modelContext && context.unregisterTool) {
    signal.addEventListener(
      "abort",
      () => {
        for (const name of names) context.unregisterTool?.(name)
      },
      { once: true }
    )
  }

  async function register(tool: WebMcpTool) {
    if (signal.aborted) return
    try {
      const registration = context!.registerTool(tool, { signal })
      names.add(tool.name)
      await registration
    } catch (error) {
      names.delete(tool.name)
      if (!signal.aborted)
        console.warn(`WebMCP: could not register ${tool.name}.`, error)
    }
  }

  await register({
    name: "navigate_site",
    description:
      "Navigate this browser tab to Matthieu's homepage, design collection, published skill guides, articles, or MCP connection guide. Returns the requested path; page rendering may still be in progress.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          enum: paths,
          description: "Published site path to open in this tab.",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    execute: async ({ path }, options) => {
      signal.throwIfAborted()
      options?.signal?.throwIfAborted()
      if (typeof path !== "string" || !paths.includes(path))
        throw new Error("Choose a published path from the tool's schema.")
      navigate(path)
      return { requested_path: path }
    },
  })

  try {
    const { tools } = (await requestMcp(fetcher, "tools/list", {}, signal)) as {
      tools: ToolDefinition[]
    }
    await Promise.all(
      tools.map((tool) =>
        register({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: { readOnlyHint: true },
          execute: async (input, options) => {
            const executionSignal = options?.signal
              ? AbortSignal.any([signal, options.signal])
              : signal
            executionSignal.throwIfAborted()
            return requestMcp(
              fetcher,
              "tools/call",
              { name: tool.name, arguments: input },
              executionSignal
            )
          },
        })
      )
    )
  } catch (error) {
    if (!signal.aborted)
      console.warn("WebMCP: could not load the site's tools.", error)
  }
}
