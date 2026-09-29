# Inspirations design QA

**Final result: passed**

The current user-approved scope uses homepage typography, simplified fallback cards, and no sponsor placements. Every resource has a working preview. Historical source-comparison evidence below predates these requested changes.

## Findings

- **Resolved: missing previews.** Removed the list-view condition that hid previews for resources without images. All 130 entries now have preview panels: 31 original screenshots, 74 preview images recovered from the linked sites, and 25 resource-card fallbacks. Image errors also fall back to a card. The user explicitly approved the fallback treatment; unavailable original media is no longer an acceptance blocker for the current scope.
- **[P3] Globe is a static captured frame.** Its size, circular crop, and pixel treatment are preserved; the original animation is not reproduced.

## Comparison evidence

Source: https://www.designeer.xyz/, Inspiration route, light theme, list view, page top.
Implementation: http://localhost:3001/inspirations, same theme/view/scroll position.

Evidence directory: `/Users/matthieu/.codex/visualizations/2026/09/29/01a0ede9-805a-7fa3-83f9-ea2dd51c857d/`

- Source visual truth: `inspirations-reference-mobile.png`
- Implementation mobile: `inspirations-mobile.png`
- Implementation desktop: `inspirations-desktop.png`
- Full-view comparison, source left / implementation right: `inspirations-comparison.png`
- Focused typography, rows, and spacing comparison: `inspirations-comparison-detail.png`

Mobile CSS viewport: 390 × 844. Source raster: 390 × 844. Final browser capture returned 195 × 422 and was normalized to 390 × 844 before comparison. The resulting softness is a capture limitation, not a CSS font mismatch. Earlier implementation captures were also inspected at native 390 × 844. Desktop CSS viewport and screenshot: 1280 × 720, no density normalization. A new matching desktop reference capture was blocked by the source checkpoint; the mobile comparison is the primary direct fidelity evidence. Desktop rendering was inspected separately.

## Required fidelity surfaces

- **Fonts and typography:** Updated at the user's request to the homepage's Geist font through `--font-sans`, including all headings, labels, counters, controls, and dialog text. Removed the source font-face declarations and Arial overrides. Verified computed text styles resolve to Geist and checked desktop/mobile rendering with no horizontal overflow at 390px. Current typography evidence: `inspirations-geist.jpg` in the evidence directory. Earlier comparison screenshots show the original source-font version.
- **Spacing and layout:** Striped gutters, 960px desktop frame, 288px sidebar, sticky toolbar, compact rows, dashed dividers, sponsor bands, mobile bottom controls, and single-column mobile cards. Matched mobile sponsor/section rhythm and resource wrapping after correction. Short desktop viewports use a more compact sidebar so its footer remains accessible.
- **Colors and tokens:** Scoped light/dark palettes, muted descriptions, pale blue sponsor treatment, thin borders, and subtle shadows. Light and dark themes rendered without changing the surrounding portfolio.
- **Image quality:** All source icons are local. Downloaded screenshots retain their original crop. The globe uses a source frame. Unavailable media uses the user-approved fallback treatment described above. Standard interaction controls use existing Hugeicons assets or downloaded original SVGs.
- **Copy and content:** All 130 resource entries across Design Galleries, Interface Design, and Reading are preserved. Resource totals accurately reflect the actual catalogue (the source's displayed 122/78 totals were stale). UTM tracking parameters are removed from resource links.

## Comparison history

1. Initial functional test found native dialogs closing during React development effect cleanup. Changed dismissal handling to native `cancel`, then verified search, bookmarks, and resource previews stay open and dismiss correctly.
2. Initial combined mobile comparison found extra sponsor spacing and excessive text reservation for the save button, changing row wrapping. Reduced sponsor paragraph/link gaps, positioned the save action independently, and matched row padding and text width. The final full-view and focused comparison files above show the corrected layout.
3. Desktop inspection found short-height sidebar content crowding its footer. Added a compact spacing rule for desktop heights below 800px. The final desktop screenshot shows all navigation and sponsor/footer controls.

## Intentional adaptations

- Inspirations project branding and a link back to Matthieu's portfolio.
- Local saved resources instead of copying Designeer's account system.
- Other catalogue categories, source info, and sponsorship links lead to the original site; only the requested `/inspirations` page is implemented locally.
- Next.js development tooling can appear in screenshots; it is absent from production builds.

## Verification

- Homepage Inspirations card navigates to `/inspirations`; return link navigates home.
- Search returns Figma, handles no matches, and closes with Escape.
- Saved resource persists after reload; removal and empty state work.
- Grid toggle, resource preview, next-resource navigation, and random exploration work.
- Mobile menu section links align headings below the sticky header.
- Light/dark theme controls work.
- No horizontal overflow at widths 1280, 390, or 320px.
- No observed console errors or failed loaded images; every referenced local resource asset exists.
- Type checking, lint, production build, and whitespace checks pass.

## Implementation checklist

- [x] Add homepage project and dedicated route.
- [x] Reproduce the main responsive design and complete text catalogue.
- [x] Implement and verify primary interactions.
- [x] Correct mobile spacing and short-height sidebar.
- [x] Recover additional preview images and provide a preview for every resource; retain the user-approved fallback for unavailable media.

## Latest requested changes and verification

- Removed “Catalogue Entry”, “inspirations”, and the three decorative dots from fallback cards. Preserved the domain label, centered icon, resource name, and description.
- Removed top-content sponsorship, sidebar sponsor logos/link, and the floating sponsor popup, including their state and unused styles. The first catalogue section now starts directly below the toolbar; browser inspection found zero sponsor/Loops links.
- Moved mobile controls down to the bottom safe area after removing the popup.
- Preview panels support keyboard focus, retain a pointer path across the gap, avoid displaying a second preview for an unfocused row, and open below rows near the top of the viewport.
- Preview images use containment to preserve the full image. Downloaded assets were decoded and visually inspected as contact sheets before inclusion.
- Verified recovered Awwwards preview and Imageory fallback can expand; all 130 list rows have preview buttons. No observed console errors. Typecheck, lint, and whitespace checks pass after the final edits.
- Current screenshots: `inspirations-without-sponsors.jpg` and `inspirations-clean-fallback.jpg` in the evidence directory above. The latter shows the simplified cards in the actual grid.
