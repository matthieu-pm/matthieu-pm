// Only published pages belong here. Draft and archived skills stay private.
export const articles = {
  "ux-writing": {
    title: "Write the interface",
    description:
      "Learn to write labels, buttons, and messages that help people use your product. Practice with ten short exercises.",
  },
  "ai-design-engineer": {
    title: "From Prompt to Product",
    description:
      "A hands-on introduction to prompting, building, and refining interfaces with AI.",
  },
  "ai-product-manager": {
    title: "The AI-Augmented Product Manager",
    description:
      "A practical guide for PMs using AI to sharpen discovery, decisions, and delivery.",
  },
} as const

export const publishedContent = [
  {
    id: "great-ui",
    kind: "skill" as const,
    title: "Great UI",
    description:
      "A design engineering skill combining interface polish and interaction craft, with examples and installation instructions.",
    path: "/skills/great-ui",
  },
  ...Object.entries(articles).map(([slug, article]) => ({
    id: slug,
    kind: "writing" as const,
    ...article,
    path: `/writing/${slug}`,
  })),
]
