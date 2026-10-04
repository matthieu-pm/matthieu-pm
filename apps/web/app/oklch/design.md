# Design the OKLCH guide

Read the [website guide](../../../../design.md) first. This guide owns `/oklch` and its color demonstrations.

## Reader's job and identity

Help designers and developers understand lightness, chroma, hue, CSS syntax, gradients, and gamut by seeing the effects directly. The defining object is a working color example beside a readable explanation. Preserve the reference-like navigation and article structure.

The route is presented in the portfolio as `oklch.sh`. Its existing visual foundation comes from oklch.fyi, with Geist typography and locally maintained educational copy. Preserve attribution and technical meaning. Current source is authoritative where older reference-capture notes describe copy that has since changed.

## Composition

Keep the desktop navigation rail, compact top header, and centered article. The established desktop geometry uses a 224px sidebar, approximately 65px header, and 692px article area. On narrow screens, use the existing mobile navigation dialog and let controls stack.

Keep explanations, swatches, numerical values, and their controls together. Use full-width demonstration surfaces within the article rather than isolated result cards. The brightness comparison needs equal treatment for HSL and OKLCH; neither side should receive a larger sample simply to make it seem better.

## Visual system

- Geist Sans owns interface and prose. `GeistMono.variable` supplies `--font-geist-mono` for formulas and color values.
- `reference.css` supplies the scoped reference foundation; `oklch.css` owns local controls and refinements. Keep all custom styles under `.oklch-page`.
- Reuse the route's `--color-gray-*`, `--color-preview-bg`, `--color-preview-border`, and shadow roles. Do not substitute the homepage's palette or create a competing global theme.
- The light/dark/system controls are intentional. Preserve their selected states and shared desktop/mobile preference.
- Spectrum artwork, colored swatches, and gradients explain color. They are functional visual evidence, not accents to spread into unrelated controls.
- Brightness and chroma containers use 12px radii; nested chroma artwork uses an 8px radius. Preserve the existing slider treatments and numerical alignment.

Use genuine local color artwork and the existing icon paths. Preserve the signature's light/dark treatment and its aspect ratio.

## Demonstration contracts

| Demonstration | State and behavior to preserve |
| --- | --- |
| Brightness comparison | Lightness starts at 50%; range 0–100, step 1. One slider updates all swatches and eight displayed color formulas. |
| Swatch text | `contrastingText()` rotates text hue through one full turn as lightness changes and switches the text-lightness branch at 40%. Preserve the threshold and gamut-limited OKLCH chroma. |
| Chroma chart | Lightness starts at 65%; range 0–100, step 1. Recalculate the chart and sRGB/Display-P3 boundaries from the same state. |
| Gamut encoding | Solid and dashed boundaries distinguish the gamuts; the accessible chart description includes current lightness. |

`color-math.ts` owns conversions and gamut calculations. Keep calculations at full precision and format only for display. Never replace real boundaries with decorative curves. The text-color heuristic is existing demo behavior, not proof of WCAG contrast at every setting; verify contrast separately when making accessibility claims.

## Controls and responsive behavior

Preserve native range-input keyboard behavior, visible labels or accessible names, current outputs, and focus indicators. At widths up to 639px, swatches become two columns and the formula groups stack.

The mobile menu is an opaque page-colored dialog. Keep navigation readable, dismissible with Escape, and independent of a blurred article backdrop. Theme selection and feedback should behave consistently between desktop and mobile.

Feedback prepares an email draft; it is not a replicated private submission service. External tools and account destinations remain external links. Describe actions honestly and do not add fake submission or authentication states.

## Writing

Move from an observed effect to its explanation, then syntax or implementation detail. Explain terms on first use, retain exact units and model names, and keep source links near the material they support. Rewrite source-derived prose substantively while preserving facts. Avoid em dashes in new article copy.

## Verification for future changes

Inspect desktop and 390px mobile in light and dark themes. Exercise the menu, feedback, theme persistence, slider endpoints, arrow keys, and values around the 40% text threshold. Check formulas and chart descriptions against the displayed state. For color-math changes, verify known conversions and gamut endpoints as well as rendering. Check overflow without relying on the route's existing clipping rule to conceal layout errors.

## Source map

- `page.tsx`: metadata, Geist Mono, and page assembly.
- `reference-content.tsx`: article, navigation content, and local artwork.
- `reference.css`, `oklch.css`: reference foundation and route refinements.
- `page-controls.tsx`: theme, navigation, and feedback.
- `color-demos.tsx`, `color-math.ts`: state, rendering, and calculations.
- `opengraph-image.tsx`: social-preview composition.
