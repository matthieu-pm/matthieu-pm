# Design Inspirations

Read the [website guide](../../../../design.md) first. This guide covers `/inspirations` and every `/inspirations/[category]` route.

## Reader's job and identity

Help a designer or builder find a useful tool, reference, component library, or creator, inspect it, and follow its link. The experience is a curated directory with a recognizable animated identity. Browsing should stay quick even as the catalogue grows.

Preserve the restrained catalogue typography, dashed structural rules, compact resource rows, and expressive artwork. The glass triangle and globe belong to this project's identity; they are deliberate exceptions to the quieter portfolio shell.

## Composition and navigation

The desktop frame is 960px wide with a 288px sticky sidebar and a flexible catalogue column. The sidebar contains identity and category navigation. The main area combines sticky controls, section navigation, and grouped resources. Keep the shared shell mounted across category navigation so artwork and toolbar state retain continuity.

Search occupies the first toolbar group. View, sound, theme, and exploration controls retain their existing boundaries. Grid and list views are alternate representations of the same collection, with consistent destinations and previews.

The catalogue IDs are `inspiration`, `components`, `build`, `visuals`, `utilities`, and `designers`. Their labels and counts come from `catalogues.ts`. Derive counts from data rather than copying them into prose or markup.

## Visual baseline

Values are scoped to `.page` in `inspirations.module.css`.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas / `--paper` | `#fff` | `#000` |
| Text / `--ink` | `#000` | `#fff` |
| Secondary / `--secondary` | `#616161` | `#9e9e9e` |
| Rule / `--line` | `#e0e0e0` | `#1f1f1f` |
| Field / `--field` | `#f5f5f5` | `#1a1a1a` |
| Surface / `--surface` | `#fff` | `#0d0d0d` |
| Accent / `--accent` | `#477f91` | `#73bdd8` |

The base type is Geist Sans at 13px/1.4, the wordmark is 18px, and the shared item radius is 10px. This is a dense directory; preserve compact scanning without shrinking descriptions further. Reuse selected-row and navigation surfaces. Keep a clear distinction between selection, hover, and keyboard focus.

Existing uppercase kicker styling is a legacy discrepancy with the root sentence-case rule. Do not reproduce it in new content; resolve it when that component is in scope.

## Resource content and assets

Each record has `name`, `description`, `href`, `icon`, and `preview`; icon and preview may be null. Descriptions should say what the resource helps someone do. Preserve official names and usable destination links.

Assign categories by function. A resource may deliberately belong to more than one category; global search deduplicates destinations. Keep section IDs unique within their catalogue. Use actual local icons and screenshots where available, and a useful fallback when an asset is missing or fails. Do not invent a preview to fill an empty slot.

Prefer the existing list's alignment of icon, name, description, and action. In grid view, preserve a coherent preview ratio and comparable card treatment. Do not give one peer extra visual weight because its source artwork is more saturated.

## Interaction, motion, and sound

Resource links, expanded previews, search, category navigation, and browser history must agree about the active context. Preserve keyboard-accessible alternatives to hover previews and accessible names for icon controls. Modal search and preview need Escape dismissal and correct focus restoration.

Keep the glass triangle's pointer, drag, and keyboard behavior. Avoid a decorative dotted outline around the artwork; provide a deliberate visible keyboard-focus treatment when adjusting focus behavior. Preserve the existing artwork and source/license notices in `glass-triangle/`.

Section entrances currently use 1,100ms with `cubic-bezier(0.25, 0.46, 0.45, 0.94)` and an index-based 400ms stagger. That measured pace is part of this route. Do not replace it with a generic fast reveal. Reduced motion must remove entrance delays and nonessential motion while keeping every resource available.

Keep sound optional through the existing control. Sound must not be the only feedback for an action. Do not introduce saving, bookmarks, accounts, or a suggestion workflow as incidental catalogue polish.

## Footer and responsive behavior

Keep `Curated by Matthieu` linked to `https://matthieu.pm`. `Inspired by Designeer` belongs at the left of the main footer action row, with `Back to top` at its other end. Preserve this row structure rather than placing the attribution in a separate decorative column.

The principal responsive transitions are at 1023px and 639px. Recompose the sidebar into the existing mobile navigation, preserve toolbar access, and adapt previews to the viewport. Test short desktop heights as well as narrow widths; the sticky sidebar must not make navigation unreachable.

## Verification for future changes

Check every affected category, list/grid switching, search results and empty results, missing preview fallback, preview dismissal, history navigation, theme preference, and sound controls. Inspect desktop and 390px mobile in light/dark, with keyboard and reduced motion. For catalogue edits, check record shape, category counts, link destinations, and local asset loading. For motion changes, watch playback and interaction, not just screenshots.

## Source map

- `layout.tsx`, `inspirations.tsx`: persistent shell, controls, dialogs, catalogue rendering, footer.
- `inspirations.module.css`: tokens, layout, interaction states, and motion.
- `catalogue.json`, `data/*.json`, `catalogues.ts`: records, categories, navigation, and counts.
- `inspirations-orb.tsx`, `glass-triangle/`: artwork and rendering.
- `use-item-sounds.ts`: optional sound behavior.
- `../../public/inspirations/`: local icons, previews, and sound assets.
