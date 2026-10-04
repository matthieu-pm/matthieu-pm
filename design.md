# Design the matthieu.pm website

## Purpose and identity

Present Matthieu Duchatellier's work across product management and design engineering. Help a reader understand his interests, inspect working examples, read his thinking, and make contact. Let the work demonstrate craft.

The website should feel personal, precise, calm, and approachable. Use clear writing, compact typography, generous section spacing, and carefully finished interactions. Preserve the small personal identity header and the direct route from introduction to work. A large promotional hero would change the character of this site.

This guide adapts the supplied design-guidelines example to this repository. It does not adopt Vercel authorship, logos, report components, or the example's CSS system.

## Scope and project guides

This file owns the shared principles and the homepage at `/`. Read the relevant local guide before changing a project. Local guides describe deliberate visual differences; shared content, accessibility, and scope rules still apply.

| Surface | Design guide | Scope |
| --- | --- | --- |
| Portfolio | This file | Identity, introduction, projects, skills, writing, contact, footer |
| Atlas | [Atlas](docs/projects/atlas/design.md) | Its portfolio presentation; the application lives elsewhere |
| OKLCH | [OKLCH](apps/web/app/oklch/design.md) | Color reference and interactive demonstrations |
| Inspirations | [Inspirations](apps/web/app/inspirations/design.md) | All catalogue categories and shared browsing controls |
| Great UI | [Great UI](apps/web/app/skills/great-ui/design.md) | Skill installation, interface comparison, geometry lab |
| Product Bet | [Product Bet](apps/web/app/skills/product-bet/design.md) | Skill installation and an example investment decision |
| Writing | [Writing](apps/web/app/writing/design.md) | All three articles and the UX-writing exercises |

`/skills/better-ui` redirects to `/skills/great-ui`; it has no separate design. Category routes and article slugs inherit their shared guide rather than maintaining duplicate rules.

The dimensions and colors below describe the current source baseline. Requirements describe how to extend it; they are not a claim that every existing screen has passed a new accessibility or visual audit. Where older implementation details conflict with a requirement, apply the requirement within the requested change instead of broadening the task into a site redesign.

## Priority order

1. Preserve the user's requested scope, supplied content, technical meaning, and attribution.
2. Preserve the reader's task and the working behavior of existing controls.
3. Keep the owning project's visual identity and established component boundaries.
4. Make hierarchy, reading order, and action clear through typography and alignment.
5. Refine responsive behavior, accessibility, motion, and surface details.

Modify the named component or visual layer when the request is local. Do not add a second control to solve a problem in an existing one. Avoid new dependencies, visual frameworks, or global theme systems for isolated refinements.

## Composition and reading order

The homepage follows a single 644px column: identity, introduction, projects, skills for agents, writing, contact, then social links and signature. Keep this sequence easy to scan. Project cards are visual entry points; skills and articles are quieter rows with a title and a short explanation.

Use cards for discrete destinations and interactive demonstrations. Use open prose for the introduction and explanatory content. Do not wrap every paragraph or section in another surface. Preserve one dominant object per section and let supporting labels recede.

Give each gap one owner. Related text belongs close together; new sections need a larger interval. Inspect complete transitions, including the empty space inside the preceding element, before adding margins.

## Typography and language

- Use sentence case for headings, labels, buttons, badges, navigation, metadata, and interactive examples.
- Never use full uppercase as a visual style. Do not use CSS capitalization to force text into uppercase.
- Keep conventional acronyms and initialisms uppercase when that is their correct spelling, such as UI, UX, AI, CTA, SEO, API, A/B, and 404. Preserve proper product names and literal code.
- Create hierarchy with font weight, spacing, color, and necessary borders rather than capitalization or excessive letter spacing.
- Use the installed Geist Sans through `--font-sans`. Keep route-specific monospace setup for code and technical values; do not introduce a second body font.
- Use concrete nouns and active verbs. Explain what a project does before describing how impressive it is. Avoid hype, unsupported outcomes, and em dashes in newly authored prose.
- Preserve qualifications, units, sources, and uncertainty when rewriting educational content. A rewrite should improve expression without changing the claim.

The homepage uses 16px body text at 1.5 line height. Identity and section headings remain 16px with weight 500. Links gain weight and an underline; they do not need bright accent colors. Reserve smaller text for subordinate footer and feedback details.

## Homepage visual baseline

Values are owned by `apps/web/app/page.module.css`, not by a global token package.

| Role | Current value |
| --- | --- |
| Canvas / `--paper` | `#fcfcfc` |
| Primary text / `--ink` | `#1f1f1f` |
| Secondary text / `--muted` | `#6b6b6b` |
| Light rule / `--faint` | `#e9e9e9` |
| Soft fill / `--soft` | `#f3f3f3` |
| Content measure | 644px maximum |
| Desktop page padding | 96px vertically, 24px horizontally |
| Major section gap | 96px desktop, 64px at widths up to 680px |
| Project grid | Two equal columns, 16px gap; one column up to 680px |
| Portrait | 44px circle |
| Project card | 26px padding, 238px minimum height; 250px on mobile |

The shared card in `apps/web/app/card.module.css` has an 18px outer radius, a 4px inset shell, and a 14px inner radius. Its warm neutral shell, white inset, thin borders, and low-opacity shadows create restrained depth. Reuse that geometry where already composed; do not replace it with flat generic panels or stack more shells inside it.

The portfolio, skill showcases, and writing pages currently use light canvases. Inspirations and OKLCH own separate light/dark behavior. Do not assume the presence of a theme-provider file makes dark mode global.

## Assets and authorship

Use local assets from `apps/web/public/`: the portrait, signature, project marks, and source logos. Preserve aspect ratios and the established optical sizing. A brand mark beside readable text is generally decorative and should not be announced twice.

Keep Matthieu's identity and genuine source attribution. Do not add third-party branding solely because a reference example uses it. Use authentic project imagery; do not invent product screenshots, results, customer logos, or endorsements.

## Interaction and motion

The homepage's craft is quiet: a project card lifts by 1px, links change emphasis, the contact label rolls on hover, and email copying produces brief confirmation. Keep interactions interruptible and feedback close to its trigger.

Email confirmation is controlled by React state and resets after 1,800ms. Repeated clicks restart the timer. Hover and focus must not keep the copied confirmation visible after its timeout. Verify both pointer and keyboard behavior when touching this control.

Use motion to explain a change or express an established project identity. Inspirations deliberately has richer motion, while Great UI demonstrates motion as its subject. Preserve those local decisions instead of applying a universal animation ban or introducing effects across every route. Reduced-motion settings must retain complete content and usable controls.

## Responsive behavior and accessibility

Reflow before shrinking. At the homepage's 680px breakpoint, keep 24px side padding, reduce vertical page padding to 48px, stack project cards, and turn the contact bar into a vertical group with a 44px minimum-height action.

Use semantic landmarks, one descriptive primary heading, ordered headings, real links for navigation, and buttons for actions. Give icon-only controls accessible names. Preserve visible keyboard focus and readable contrast; communicate state through text or shape as well as color. Target WCAG AA when adding or changing UI.

Keep source order aligned with reading order. Allow long labels and URLs to wrap appropriately. Fix the element that causes horizontal overflow rather than hiding page overflow. Dialogs need Escape dismissal, appropriate focus handling, and a usable return to their trigger.

## Work in four passes

1. **Understand:** read the owning page, styles, controls, assets, and local guide. Establish the reader's job and the exact requested change.
2. **Compose:** preserve the intended hierarchy and geometry. For substantial new work, compare materially different arrangements before polishing one.
3. **Implement:** reuse the owning styles and controls. Keep route-specific tokens scoped. Read the relevant installed Next.js guide under `node_modules/next/dist/docs/` before writing framework code, as required by `AGENTS.md`.
4. **Verify:** inspect the rendered result and exercise the changed behavior. A source diff or static frame does not verify interaction or animation.

For UI changes, start the app from `apps/web` with `npm run dev` and inspect the relevant routes at desktop and 390px mobile width, including breakpoint transitions. Check full-page rhythm, overflow, keyboard focus, long content, and reduced motion. Check both themes only where supported. Run the appropriate typecheck and lint scripts, plus `git diff --check`; use focused behavior tests when logic changes warrant them.

For documentation-only changes, verify paths, links, source facts, and whitespace. Do not describe unperformed browser checks as completed validation.

## Avoid

- Generic oversized heroes, repeated promotional card grids, and decorative metric blocks.
- Tiny muted text used to compensate for excessive content.
- New colors or effects that compete with the project's focal object.
- Duplicated controls, fake loading, simulated AI generation, and unsupported claims.
- Removing a project's meaningful color, depth, or motion merely to make every route identical.
- Treating historical QA notes as more authoritative than current source and explicit user decisions.

## Implementation map

- `apps/web/app/page.tsx`: homepage content and order.
- `apps/web/app/page.module.css`: homepage tokens, layout, and states.
- `apps/web/app/card.module.css`: shared inset-card geometry.
- `apps/web/app/email-copy.tsx`: email copy and feedback.
- `apps/web/app/layout.tsx`, `globals.css`, and `site-config.ts`: font, global baseline, metadata, and identity.
- `apps/web/public/`: local visual assets.

Update the relevant guide when an intentional design decision changes. Keep guides focused on reusable rules and meaningful exceptions, not a diary of individual edits.
