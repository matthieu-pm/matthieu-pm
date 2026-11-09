import { expect, test } from "bun:test"

import { POST } from "../app/api/mcp/route"
import { registerWebMcpTools } from "./webmcp"

function setup({ legacy = false, unsupported = false, fetcher } = {}) {
  const tools = new Map()
  const visited = []
  const calls = []
  const context = {
    async registerTool(tool, { signal }) {
      if (signal.aborted) throw signal.reason
      if (tools.has(tool.name)) throw new Error("Duplicate tool")
      tools.set(tool.name, tool)
      if (!legacy)
        signal.addEventListener("abort", () => tools.delete(tool.name), {
          once: true,
        })
    },
    unregisterTool(name) {
      tools.delete(name)
    },
  }
  const controller = new AbortController()
  const environment = {
    document: !legacy && !unsupported ? { modelContext: context } : {},
    navigator: legacy ? { modelContext: context } : {},
    paths: ["/", "/inspirations", "/writing/ux-writing"],
    navigate: (path) => visited.push(path),
    fetch:
      fetcher ??
      (async (path, options) => {
        calls.push(JSON.parse(options.body))
        return POST(
          new Request(new URL(path, "http://localhost:3001"), options)
        )
      }),
  }
  return {
    tools,
    visited,
    calls,
    environment,
    controller,
    context,
    register: () => registerWebMcpTools(environment, controller.signal),
  }
}

test("discovers the real MCP schemas and executes validated search calls", async () => {
  const fixture = setup()
  await fixture.register()
  expect([...fixture.tools.keys()].sort()).toEqual([
    "get_content",
    "navigate_site",
    "search_collection",
    "search_content",
  ])
  const search = fixture.tools.get("search_collection")
  expect(search.inputSchema.properties.category.enum).toContain("inspiration")
  const result = await search.execute({
    query: "Mobbin",
    category: "inspiration",
  })
  expect(result.structuredContent.results[0].name).toBe("Mobbin")
  const invalid = await search.execute({ limit: 999 })
  expect(invalid.isError).toBe(true)
  expect(
    (await fixture.tools.get("search_content").execute({})).structuredContent
      .total
  ).toBe(4)
  fixture.controller.abort()
  expect(fixture.tools.size).toBe(0)
})

test("prefers document.modelContext and rejects arbitrary navigation destinations", async () => {
  const fixture = setup()
  fixture.environment.navigator = {
    modelContext: {
      registerTool() {
        throw new Error("Wrong API")
      },
    },
  }
  await fixture.register()
  const navigate = fixture.tools.get("navigate_site")
  await navigate.execute({ path: "/inspirations" })
  for (const path of [
    "javascript:alert(1)",
    "//example.com",
    "/api/mcp",
    "/writing/private",
  ]) {
    await expect(navigate.execute({ path })).rejects.toThrow("published path")
  }
  expect(fixture.visited).toEqual(["/inspirations"])
  const cancelled = AbortSignal.abort()
  await expect(
    navigate.execute({ path: "/" }, { signal: cancelled })
  ).rejects.toThrow()
  const search = fixture.tools.get("search_content")
  const before = fixture.calls.length
  await expect(search.execute({}, { signal: cancelled })).rejects.toThrow()
  expect(fixture.calls.length).toBe(before)
  fixture.controller.abort()
  await expect(search.execute({})).rejects.toThrow()
})

test("unregisters legacy tools and supports mounting again after cleanup", async () => {
  const fixture = setup({ legacy: true })
  await fixture.register()
  expect(fixture.tools.size).toBe(4)
  fixture.controller.abort()
  expect(fixture.tools.size).toBe(0)
  const next = new AbortController()
  await registerWebMcpTools(fixture.environment, next.signal)
  expect(fixture.tools.size).toBe(4)
  next.abort()
  expect(fixture.tools.size).toBe(0)
})

test("does no work in unsupported browsers or after an early abort", async () => {
  for (const fixture of [setup({ unsupported: true }), setup()]) {
    if (fixture.environment.document.modelContext) fixture.controller.abort()
    await fixture.register()
    expect(fixture.calls).toHaveLength(0)
    expect(fixture.tools.size).toBe(0)
  }
})

test("accepts browser tool discovery from the deployment's own origin", async () => {
  const response = await POST(
    new Request("https://portfolio.example/api/mcp", {
      method: "POST",
      headers: {
        Origin: "https://portfolio.example",
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    })
  )
  expect(response.status).toBe(200)
  expect((await response.json()).result.tools).toHaveLength(3)
})

test("aborting discovery prevents late registrations", async () => {
  let finish
  let markStarted
  const started = new Promise((resolve) => {
    markStarted = resolve
  })
  const fixture = setup({
    fetcher: () =>
      new Promise((resolve) => {
        finish = resolve
        markStarted()
      }),
  })
  const registration = fixture.register()
  await started
  fixture.controller.abort()
  finish(
    Response.json({
      result: {
        tools: [{ name: "late_tool", description: "Late", inputSchema: {} }],
      },
    })
  )
  await registration
  expect(fixture.tools.size).toBe(0)
})
