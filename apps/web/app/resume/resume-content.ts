export type ResumeEntry = {
  title: string
  subtitle?: string
  date?: string
  logos: readonly string[]
  tags: readonly string[]
  details: readonly string[]
}

// Experience and education are based on the site's existing English résumé.
export const experience: ResumeEntry[] = [
  {
    title: "Wondertale",
    subtitle: "Co-founder · Product Designer",
    date: "Founded Oct 2024",
    logos: ["/logos/wondertale-diamond.svg"],
    tags: ["Product Design", "Client Delivery", "Webflow", "Framer"],
    details: [
      "Managed 14 client projects in Linear, with 98% delivered on time.",
      "Designed CMS-backed websites in Webflow and Framer that increased conversion rates by 29%.",
      "Collected customer feedback and wrote documentation for post-launch support.",
    ],
  },
  {
    title: "Xllence",
    subtitle: "Product Marketing Manager · Work-study",
    date: "Sep 2024 – Aug 2025",
    logos: ["/logos/xllence-logo.svg"],
    tags: ["Growth", "SEO", "Automation", "UX Research"],
    details: [
      "Led SEO content work across subsidiaries, generating average traffic growth of 210%.",
      "Automated marketing tasks in Zapier to save four hours a week.",
      "Designed an AI-assisted blog scheduling and writing workflow that saved six hours a week.",
    ],
  },
  {
    title: "Avico",
    subtitle: "Marketing Manager · Internship & work-study",
    date: "May 2023 – Sep 2024",
    logos: ["/logos/avico-icon.webp"],
    tags: ["Content Strategy", "Social Analytics", "Web Design"],
    details: [
      "Grew Avico’s LinkedIn following by 12% and generated 240,000 impressions for Privajet.",
      "Led visual identity and website design for the launch of the Ernestine subsidiary.",
    ],
  },
]

export const education: ResumeEntry[] = [
  {
    title: "SKEMA Business School × Politecnico di Milano",
    subtitle: "MSc Product Management & UX Design",
    date: "2025 – 2027",
    logos: ["/logos/skema-shield.webp", "/logos/polimi.webp"],
    tags: ["Product Management", "UX Design"],
    details: [],
  },
  {
    title: "SKEMA Business School × Soochow University",
    subtitle: "DESMI · Specialized Degree in International Management",
    date: "2025 – 2027",
    logos: ["/logos/skema-shield.webp", "/logos/soochow.webp"],
    tags: ["International Management"],
    details: [],
  },
  {
    title: "IIM Digital School",
    subtitle: "Bachelor’s in Digital Project Management",
    date: "2021 – 2024",
    logos: ["/logos/iim-digital-school.webp"],
    tags: ["Digital Project Management"],
    details: [],
  },
]

export const certifications = [
  {
    title: "AI Product Management",
    issuer: "IBM via Coursera",
    date: "2025",
    logo: "/logos/ibm.svg",
  },
  {
    title: "Design Thinking",
    issuer: "Dthinking Academy",
    date: "2022",
    logo: "/logos/dthinking.webp",
  },
]

export const projectHighlights: Record<string, readonly string[]> = {
  Forge: [
    "Connects issue tracking, team planning, documents, and coding agents in one workspace.",
    "Keeps agent work tied to the source issue so teammates can review the result in context.",
  ],
  Carbon: [
    "Runs Codex, Claude Code, and other coding agents in parallel on a Mac or remote server.",
    "Starts sessions from GitHub or Linear issues, with built-in browser testing and PR review.",
    "Pairs a design canvas with agent chat for sketching screens and sending pinned feedback.",
  ],
  Atrium: [
    "Brings company records, contacts, deals, enrichment, and follow-up into a shared CRM.",
    "Connects an AI assistant to CRM records and actions so teams can move from account context to their next step.",
  ],
  "My collection": [
    "Organizes curated design references, development tools, and resources by what they help people do.",
    "Makes the same collection browseable on the web and searchable through MCP.",
  ],
}
