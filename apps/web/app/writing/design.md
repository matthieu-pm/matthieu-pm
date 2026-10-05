# Design the Writing section

Read the [website guide](../../../../design.md) first. This guide owns the shared article design at `/writing/[slug]`.

## Reader's job and editorial identity

Help a reader learn a practical idea and apply it. Use approachable explanations, realistic examples, and exercises where choosing or rewriting makes a lesson clearer. Preserve Matthieu's byline and the distinction between instructional examples and observed product evidence.

| Article route | Teaching emphasis |
| --- | --- |
| `/writing/ux-writing` | Interface language, context, clarity, consistency, and accessibility; includes interactive exercises |
| `/writing/ai-design-engineer` | Briefing, exploring directions, building small slices, evaluating the rendered result, and polishing |
| `/writing/ai-product-manager` | Supplying context, verifying synthesis, challenging assumptions, improving artifacts, and recording decisions |

All articles share one shell. The two AI articles currently use concise prose and workflow steps; they do not need the UX-writing article's full exercise structure unless their content earns it.

## Composition and rhythm

Use the 644px column with home/copy-link controls, title, descriptive lead, and byline. A fine rule ends the header. Alternate open explanatory prose with examples, exercises, or structured steps according to what the reader is learning.

Keep exercise instructions, controls, and feedback in the same group. Use framed surfaces for interactive practice or a genuine comparison, not every prose section. Each section should answer a new question; avoid repeating the same takeaway in a heading, card, caption, and conclusion.

## Visual baseline

| Role | Current value |
| --- | --- |
| Canvas / primary / secondary | `#fcfcfc` / `#1f1f1f` / `#6b6b6b` |
| Rule / surface | `#e3e3e0` / `#f6f6f4` |
| Body | Geist Sans, 16px/1.5 |
| Title | `clamp(38px, 8vw, 58px)`, weight 500, line height 1.02 |
| Lead | 21px/1.45, maximum width 590px |
| Section heading | 23px/1.3, weight 500 |
| Desktop padding | 64px vertically, 24px horizontally |
| Prose rhythm | 80px between prose sections; 14px from heading/text to subsequent direct paragraphs |

Use `article.module.css` and the existing shared card composition. Large titles are appropriate for article identity; do not import that scale into homepage navigation or exercise labels. Keep section rhythm responsive to content density. The article shell currently uses a light theme only.

## Writing and teaching rules

Use the root sentence-case rules for new headings and labels while preserving literal source titles where required. Explain unfamiliar terms on first use. Favor concrete situations, task-oriented actions, and helpful error language over abstract advice.

When adapting a supplied course or research source, preserve the meaning, attribution, limits, and relevant examples. Rewrite substantively when asked to make the text distinct. Do not invent statistics, research findings, or capabilities to strengthen a lesson.

Keep learning feedback specific: explain which detail made a choice useful, incomplete, or misleading. The rewrite exercise lets readers compare their own wording with an example and review criteria; it does not grade their text. Preserve this distinction instead of presenting keyword matches as a writing-quality score. Label fictional research excerpts as practice material.

## Exercises and state

`ux-writing-lab.tsx` owns the interactive exercises: microcopy mapping, good/bad choices, rewriting, action matching, tone, error construction, consistency, flow auditing, user language, and accessibility.

Preserve the distinction between editing, selecting, checking, and seeing feedback. Keep a user's text available while they revise it. Feedback should stay associated with the current answer; when an answer changes, avoid showing stale evaluation as if it describes the new one. Make retry behavior clear and keep exercises independent.

Use native inputs and buttons with accessible names, visible selected states, and textual feedback. Do not rely on red/green alone. Keep the article usable without completing exercises, signing in, or submitting personal information.

## Responsive behavior and motion

Keep comfortable text sizes and page gutters. Stack comparison cards and exercise controls when they no longer fit; preserve the reading order from instruction to input to feedback. Avoid clipped textareas and feedback that forces the entire document to scroll horizontally.

Motion is subordinate to reading. Keep focus and copy feedback prompt and discreet. Respect reduced motion and avoid making lessons appear only after decorative reveal sequences.

## Verification for future changes

Check all three slugs when changing shared CSS or controls. Inspect long headings and full-page rhythm on desktop and 390px mobile. For exercise changes, try unanswered, correct, incorrect, revised, and repeated submissions, plus keyboard navigation and long free-text input. Verify the copied article URL and feedback duration. Content edits should be checked against their actual supplied sources.

## Source map

- `[slug]/page.tsx`: article registry, metadata, narrative, exercise placement, and slug handling.
- `article.module.css`: shared typography, layout, surfaces, and exercise styling.
- `article-controls.tsx`: home navigation and page-link copying.
- `ux-writing-lab.tsx`: exercise content, state, and evaluation rules.
