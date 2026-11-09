import TurndownService from "turndown"

export function htmlToMarkdown(html: string, pageUrl: string): string {
  const converter = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  })

  converter.addRule("omitNonContent", {
    filter: (node) =>
      [
        "HEAD",
        "TITLE",
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "SVG",
        "NAV",
        "BUTTON",
        "FORM",
      ].includes(node.nodeName) ||
      node.getAttribute("aria-hidden") === "true" ||
      node.hasAttribute("hidden"),
    replacement: () => "",
  })
  converter.addRule("absoluteLinks", {
    filter: (node) => node.nodeName === "A" && node.hasAttribute("href"),
    replacement: (content, node) => {
      const href = new URL(node.getAttribute("href")!, pageUrl).href
      if (node.querySelector("h1, h2, h3, h4, h5, h6")) {
        const linkedHeading = content
          .trim()
          .replace(
            /^(#{1,6}) (.+)$/m,
            (_, level: string, title: string) =>
              `${level} [${title}](<${href}>)`
          )
        return `\n\n${linkedHeading}\n\n`
      }
      if (node.children.length > 1) {
        return `\n\n[${content.trim()}](<${href}>)\n\n`
      }
      return `[${content}](<${href}>)`
    },
  })

  return `${converter.turndown(html).trim()}\n`
}
