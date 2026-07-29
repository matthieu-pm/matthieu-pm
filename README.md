# matthieu.pm

This is the source code for the matthieu.pm website, built as a Next.js
monorepo with shadcn/ui.

## Use it as a template

This website is free to access, copy, modify, and use as a template for your
own website. See the [MIT License](LICENSE) for the full license terms.

## Package manager

The monorepo uses Bun:

```bash
bun install
bun run dev
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
bunx --bun shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
