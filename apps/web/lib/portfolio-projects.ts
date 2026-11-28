export const technologies = {
  nextdotjs: "Next.js",
  typescript: "TypeScript",
  tauri: "Tauri",
  rust: "Rust",
  bun: "Bun",
  modelcontextprotocol: "Model Context Protocol",
  orpc: "oRPC",
  tanstack: "TanStack Start",
  neon: "Neon Postgres",
}

export const projects: {
  name: string
  description: string
  href: string
  logo: string | null
  video?: string
  stack: (keyof typeof technologies)[]
}[] = [
  {
    name: "My collection",
    description: "Curated lists of tools and inspiring designs",
    href: "/inspirations",
    logo: null,
    video: "/videos/inspirations.mp4",
    stack: ["bun", "nextdotjs", "modelcontextprotocol"],
  },
  {
    name: "Atrium",
    description: "Revenue teams meet agentic CRM workflows",
    href: "https://atriumcrm.com/",
    logo: "/logos/atrium.svg",
    video: "/videos/atrium.mp4?v=6",
    stack: ["typescript", "orpc", "nextdotjs"],
  },
  {
    name: "Carbon",
    description: "A desktop home for your coding agents",
    href: "https://carbonhq.sh",
    logo: "/logos/carbon.svg",
    video: "/videos/carbon.mp4?v=2",
    stack: ["rust", "typescript", "tauri"],
  },
  {
    name: "Forge",
    description: "An agentic issue tracking workspace",
    href: "https://forgenow.tech/",
    logo: "/logos/forge.svg",
    video: "/videos/forge.mp4?v=6",
    stack: ["tanstack", "neon", "typescript"],
  },
]
