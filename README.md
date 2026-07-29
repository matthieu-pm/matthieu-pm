# matthieu.pm

The source code for [matthieu-pm.vercel.app](https://matthieu-pm.vercel.app/),
a lightweight personal portfolio for presenting projects, skills, selected
results, and contact information.

The website is built with Next.js and TypeScript in a Bun and Turborepo
monorepo. It is responsive, accessible, and optimized for fast loading.

![Site quality scores: 100 for performance, accessibility, best practices, and SEO, plus 2/2 for agentic browsing](docs/site-quality-scores.png)

## Features

- Responsive portfolio layout for desktop and mobile
- Project, skills, impact, and contact sections
- Downloadable résumé
- Optimized images and locally optimized Geist typography
- Vercel Analytics and Speed Insights
- Shared UI workspace configured for shadcn/ui components
- No environment variables or external database required

## Technology

| Tool                                          | Purpose                                        |
| --------------------------------------------- | ---------------------------------------------- |
| [Next.js 16](https://nextjs.org/)             | Web framework and static rendering             |
| [React 19](https://react.dev/)                | User interface                                 |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development                          |
| [Bun](https://bun.sh/)                        | Package manager and script runner              |
| [Turborepo](https://turborepo.com/)           | Monorepo task orchestration                    |
| CSS Modules                                   | Component-scoped styling                       |
| [Vercel](https://vercel.com/)                 | Hosting, analytics, and performance monitoring |

## Getting started

### Requirements

- [Bun 1.3 or newer](https://bun.sh/docs/installation)
- Node.js 20 or newer

### Install and run locally

```bash
git clone https://gitlab.com/wondertale-dev/matthieu-pm.git
cd matthieu-pm
bun install
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Available commands

Run these commands from the repository root:

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `bun run dev`       | Start the development server                  |
| `bun run build`     | Create a production build                     |
| `bun run lint`      | Check the code with ESLint                    |
| `bun run typecheck` | Check TypeScript types                        |
| `bun run format`    | Format TypeScript and TSX files with Prettier |

To preview the production build locally:

```bash
bun run build
cd apps/web
bun run start
```

## Project structure

```text
.
├── apps/
│   └── web/                    # Next.js portfolio application
│       ├── app/                # Page, layout, metadata, and styles
│       └── public/             # Images, logos, résumé, and icons
├── packages/
│   ├── eslint-config/          # Shared ESLint configuration
│   ├── typescript-config/      # Shared TypeScript configuration
│   └── ui/                     # Shared shadcn/ui components and styles
├── docs/                       # README assets
├── package.json                # Root scripts and workspace configuration
└── turbo.json                  # Turborepo task configuration
```

## Customizing the portfolio

The main files you will usually edit are:

- `apps/web/app/page.tsx` — portfolio text, links, projects, skills, and impact
- `apps/web/app/page.module.css` — page layout and component styles
- `apps/web/app/globals.css` — global colors and base styles
- `apps/web/app/layout.tsx` — metadata, font setup, analytics, and page shell
- `apps/web/public/` — images, logos, icons, and downloadable files

To use your own résumé, replace
`apps/web/public/matthieu-duchatellier-resume.pdf` and update its link in
`apps/web/app/page.tsx` if you choose a different filename.

To add a shadcn/ui component to the shared UI package:

```bash
bunx --bun shadcn@latest add button -c apps/web
```

Import shared components in the web application like this:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Deploying to Vercel

1. Import the repository into Vercel.
2. Select **Next.js** as the framework preset.
3. Set the root directory to `apps/web`.
4. Use `bun run build` as the build command.
5. Leave the output directory on the Next.js default.
6. Deploy the project.

The current site does not require environment variables. After deployment,
enable Analytics and Speed Insights in the Vercel dashboard to collect their
respective metrics.

## Use it as a template

You may access, copy, modify, and use this website for free as a template for
your own portfolio. Replace the personal content, links, images, and résumé
with your own information before publishing it.

If you redistribute a substantial portion of the source, keep the original
copyright and license notice as required by the MIT License.

## License

This project is available under the [MIT License](LICENSE).
