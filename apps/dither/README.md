# Dither

A small browser studio and stateless MCP server at `https://dither.matthieu.pm`.

```sh
bun install
bun run --cwd apps/dither dev
bun run --cwd apps/dither test
bun run --cwd apps/dither build
```

Connect an MCP client with Streamable HTTP to `https://dither.matthieu.pm/mcp`. No authentication is required. Available tools: `dither_image`, `get_dither_presets`, `get_dither_shader`. See [public/llms.txt](public/llms.txt) for source formats, settings, limits and the HTTP API.

`lib/dither.ts` is the deterministic, shared renderer. The studio runs it in a Web Worker. The MCP server decodes and encodes with Sharp, renders the same algorithm, and returns PNG image content. `lib/shader.ts` supplies a matching WebGL 2 fragment shader for integrations. Browser decoding/resampling may differ slightly from Sharp.

The URL loader validates every resolved address and connects to a pinned public IP with the original TLS server name, revalidating redirects. Requests, downloads, decoded pixels and PNG responses have size limits. No user images are stored, and no external image-generation services are called. This is a public service; Vercel's platform request logs and usage limits still apply.

Deploy as a separate Vercel project with root directory `apps/dither`, framework Next.js, install command `bun install`, and build command `bun run build` from that app root. The existing portfolio project remains separate. Authoritative DNS is managed at Vercel.
