import inspiration from "./catalogue.json"
import components from "./data/components.json"
import build from "./data/build.json"
import visuals from "./data/visuals.json"
import utilities from "./data/utilities.json"
import designers from "./data/designers.json"

export type Resource = {
  name: string
  description: string
  href: string
  icon: string | null
  preview: string | null
  previewVideo?: string
}

export const catalogues = {
  inspiration,
  components,
  build,
  visuals,
  utilities,
  designers,
}

export type CatalogueId = keyof typeof catalogues

const labels: Record<CatalogueId, string> = {
  inspiration: "Inspiration",
  components: "Components",
  build: "Build",
  visuals: "Visuals",
  utilities: "Utilities",
  designers: "Design Engineers",
}

export const navigation = (Object.keys(catalogues) as CatalogueId[]).map(
  (id) => ({
    id,
    label: labels[id],
    href: id === "inspiration" ? "/inspirations" : `/inspirations/${id}`,
    count: catalogues[id].reduce(
      (total, section) => total + section.items.length,
      0
    ),
  })
)

export const allResources = Object.values(catalogues)
  .flatMap((sections) =>
    sections.flatMap((section) =>
      section.items.map((item) => ({ ...item, section: section.title }))
    )
  )
  .filter(
    (resource, index, resources) =>
      resources.findIndex((item) => item.href === resource.href) === index
  )

export function isCatalogueId(value: string): value is CatalogueId {
  return Object.hasOwn(catalogues, value)
}
