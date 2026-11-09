import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowTurnBackwardIcon } from "@hugeicons/core-free-icons"

import { mcpEndpoint } from "@/lib/mcp-metadata"
import { CopyValue } from "./copy-value"
import styles from "./mcp.module.css"

const title = "Connect your assistant"
const description =
  "Use Matthieu’s design collection, skills, and writing in your AI assistant through a public, read-only MCP server."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/mcp" },
  openGraph: { title, description, url: "/mcp", type: "website" },
}

export default function McpPage() {
  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <Link className={styles.back} href="/" aria-label="Return home">
          <HugeiconsIcon
            icon={ArrowTurnBackwardIcon}
            size={20}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </Link>

        <header className={styles.hero}>
          <h1>
            Good references.
            <br />
            One connection.
          </h1>
          <p className={styles.lead}>
            Bring my design collection, skills, and writing into the
            conversation you’re already having with your AI assistant.
          </p>
        </header>

        <section className={styles.section} aria-labelledby="connect">
          <h2 id="connect">Connect with MCP</h2>
          <p>
            MCP lets compatible AI assistants use resources from other apps and
            websites. Add this site as a remote MCP server in your assistant’s
            connection settings.
          </p>
          <ol className={styles.steps}>
            <li>Choose the option to add a remote or custom MCP server.</li>
            <li>
              Name it <strong>Matthieu’s resources</strong> and paste this
              server URL.
            </li>
            <li>
              If asked, choose <strong>Streamable HTTP</strong> and no
              authentication.
            </li>
          </ol>
          <CopyValue value={mcpEndpoint} label="server URL" />
          <p className={styles.note}>
            Your assistant needs to support remote MCP servers without
            authentication. The option and its name depend on the app you use.
          </p>
          <details className={styles.details}>
            <summary>Using Codex from the terminal?</summary>
            <p>Run this command to add the connection:</p>
            <CopyValue
              value={`codex mcp add matthieu --url ${mcpEndpoint}`}
              label="Codex command"
            />
          </details>
        </section>

        <section className={styles.section} aria-labelledby="try">
          <h2 id="try">Start with a question</h2>
          <p>Once connected, try asking your assistant:</p>
          <ul className={styles.prompts}>
            <li>
              “Find typography resources in Matthieu’s design collection.”
            </li>
            <li>
              “Read Matthieu’s Great UI guide and suggest improvements to this
              interface.”
            </li>
            <li>
              “Find Matthieu’s writing on UX copy and help me improve these
              error messages.”
            </li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="available">
          <h2 id="available">What you can use</h2>
          <dl className={styles.resources}>
            <div>
              <dt>
                <Link href="/inspirations">The design collection ↗</Link>
              </dt>
              <dd>
                Search curated tools, interface inspiration, components,
                visuals, utilities, and design engineers.
              </dd>
            </div>
            <div>
              <dt>
                <Link href="/skills/great-ui">Skills ↗</Link>
              </dt>
              <dd>
                Read the published Great UI guide, its examples, and
                installation instructions.
              </dd>
            </div>
            <div>
              <dt>
                <Link href="/writing/ux-writing">Writing ↗</Link>
              </dt>
              <dd>
                Search and read articles on UX writing, building interfaces with
                AI, and AI for product managers.
              </dd>
            </div>
          </dl>
          <details className={styles.details}>
            <summary>Available tools and resources</summary>
            <dl className={styles.tools}>
              <div>
                <dt>
                  <code>search_collection</code>
                </dt>
                <dd>Find resources by keyword or category.</dd>
              </div>
              <div>
                <dt>
                  <code>search_content</code>
                </dt>
                <dd>
                  Search the full text of published skills and articles. An
                  empty query lists the pages.
                </dd>
              </div>
              <div>
                <dt>
                  <code>get_content</code>
                </dt>
                <dd>
                  Read a page as Markdown using its ID. Longer pages can be read
                  in parts.
                </dd>
              </div>
            </dl>
            <p>
              The content index and collection are also available as MCP
              resources. Results include source links.
            </p>
          </details>
        </section>

        <footer className={styles.footer}>
          <p>
            This connection reads public content. It can’t edit the site, send
            messages, or install skills.
          </p>
          <p>
            Prefer browsing? <Link href="/">Back to the website</Link>.
          </p>
        </footer>
      </div>
    </main>
  )
}
