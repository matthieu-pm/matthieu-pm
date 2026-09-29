import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { InspirationSections } from "../inspirations"
import { catalogues, isCatalogueId, navigation } from "../catalogues"

type Props = { params: Promise<{ category: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return navigation
    .filter((item) => item.id !== "inspiration")
    .map((item) => ({ category: item.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const page = navigation.find((item) => item.id === category)
  if (!page || !isCatalogueId(category) || category === "inspiration")
    notFound()
  const title = `${page.label} — Inspirations — Matthieu Duchatellier`
  const description = catalogues[category]
    .map((section) => section.description)
    .join(" ")
  return {
    title,
    description,
    alternates: { canonical: page.href },
    openGraph: { type: "website", title, description, url: page.href },
  }
}

export default async function CataloguePage({ params }: Props) {
  const { category } = await params
  if (!isCatalogueId(category) || category === "inspiration") notFound()
  return <InspirationSections key={category} category={category} />
}
