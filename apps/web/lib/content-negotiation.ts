export function prefersMarkdown(accept: string | null): boolean {
  const types = (accept ?? "").split(",").map((entry) => {
    const [type = "", ...parameters] = entry.trim().toLowerCase().split(";")
    const quality = parameters.find((parameter) =>
      parameter.trim().startsWith("q=")
    )
    const q = quality ? Number(quality.trim().slice(2)) : 1
    return {
      type: type.trim(),
      q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0,
    }
  })
  const markdown = types.find(({ type }) => type === "text/markdown")
  const html = types.find(({ type }) => type === "text/html")

  return Boolean(markdown && markdown.q > 0 && markdown.q >= (html?.q ?? 0))
}
