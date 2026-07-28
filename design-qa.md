# Design QA

## Visual truth

- Reference: `/var/folders/j2/gzj18t_x2251dx_cnqdcscm80000gn/T/codex-clipboard-8684b485-5462-4478-99e6-d41331e511e8.png`
- Reference size: 642 × 488 px
- Local preview: `http://127.0.0.1:3001`
- Desktop viewport reviewed: 1280 × 720 px
- Project-card evidence: `tmp/design-qa/project-cards-comparison.png`
- Number-card evidence: `tmp/design-qa/number-cards-after.png`
- Mobile evidence: `tmp/design-qa/number-cards-mobile-after.png`

## Fidelity surfaces

- Layout and spacing: passed. Capability and impact rows remain plain; only the small numbered cards receive the secondary shell.
- Shape: passed. Number cards use a 12 px outer radius and a distinct 8 px inner radius, scaled to their 50 × 58 px size.
- Surface and depth: passed. Number cards use a 3 px inset, warm secondary background, fine inner border, and restrained outer shadow matching the project-card treatment.
- Typography and content: passed. Existing type scale, weights, numbering, and project content remain unchanged.
- Responsive behavior: passed at 390 × 844 px. Number cards preserve their dimensions and layered inset while adjacent copy wraps without clipping.
- Accessibility: passed. Decorative shells are CSS-only, preserve semantic articles and links, and do not add focus targets.

## States reviewed

- Default project cards
- Project-card hover and focus styling
- Capability number cards
- Selected-impact number cards
- Browser console errors: none

## Iteration history

1. Added the layered shell to project cards.
2. Increased the inner shell size and separated the radii to 18 px outer / 12 px inner after review.
3. Initially applied the treatment to the full capability and impact rows.
4. Corrected the scope after review: rows are plain again, and the layered treatment now applies only to their numbered cards.

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Validation

- ESLint: passed
- TypeScript: passed
- `git diff --check`: passed
- Rendered shell count: 2 project cards and 9 numbered cards

## Final result

passed
