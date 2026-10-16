<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Bun 1.3.5 is the package manager (`packageManager` in the root `package.json`, lockfile `bun.lock`). Install with `bun install --frozen-lockfile`.
- `bun run dev` serves the Next.js app at http://localhost:3001. To bind every interface, run `bun run dev -- --hostname 0.0.0.0` from `apps/web` (`next dev --port 3001`).
- No environment variables, database, or login are required. The homepage GitLab chart requests the public GitLab calendar and shows a short unavailable message if that request fails.
- Checks from the repo root: `bun run lint`, `bun run typecheck`, and `bun run build`. Lint exits 0 with existing warnings in `apps/web/scripts/homeview/kit/`.
