import assert from "node:assert/strict"
import { test } from "node:test"

import { prefersMarkdown } from "./content-negotiation.ts"
import { htmlToMarkdown } from "./markdown.ts"

test("negotiates explicit Markdown while preserving browser defaults and quality preferences", () => {
  for (const accept of [
    "text/markdown",
    "text/markdown, text/html, */*",
    "TEXT/MARKDOWN; charset=utf-8",
  ]) {
    assert.equal(prefersMarkdown(accept), true, accept)
  }
  for (const accept of [
    null,
    "*/*",
    "text/html",
    "text/markdown;q=0",
    "text/markdown;q=0.3,text/html;q=0.9",
    "text/markdown-preview",
    "text/markdown;q=invalid",
  ]) {
    assert.equal(prefersMarkdown(accept), false, accept)
  }
})

test("converts the page content and links without styles, hydration data or interface controls", () => {
  const markdown = htmlToMarkdown(
    `<!doctype html><html><head><title>Metadata</title><style>body{color:red}</style></head><body>
    <header><h1>Matthieu Duchatellier</h1></header>
    <main><p>Studying at <a href="https://www.gsom.polimi.it/en"><strong>POLIMI</strong></a>.</p>
    <h2>Projects</h2><ul><li><a href="/writing/example">Read more</a></li></ul>
    <a href="/writing/guide"><h3>Guide</h3><p>Read the guide.</p></a>
    <script>self.__next_f.push(["hydration"])</script><button>Toggle menu</button><span aria-hidden="true">Icon</span>
    <pre><code>const hello = "world"</code></pre></main></body></html>`,
    "https://matthieu.pm/"
  )

  assert.match(markdown, /^# Matthieu Duchatellier/)
  assert.match(
    markdown,
    /\[\*\*POLIMI\*\*\]\(<https:\/\/www.gsom.polimi.it\/en>\)/
  )
  assert.match(markdown, /## Projects/)
  assert.match(
    markdown,
    /### \[Guide\]\(<https:\/\/matthieu.pm\/writing\/guide>\)/
  )
  assert.match(
    markdown,
    /-\s+\[Read more\]\(<https:\/\/matthieu.pm\/writing\/example>\)/
  )
  assert.match(markdown, /```\nconst hello = "world"\n```/)
  assert.doesNotMatch(
    markdown,
    /Metadata|color:red|hydration|Toggle menu|Icon|<html/
  )
})
