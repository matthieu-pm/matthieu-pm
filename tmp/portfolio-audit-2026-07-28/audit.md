# Portfolio audit — 2026-07-28

## Scope

Combined UX, visual-design, recruiter-readiness, and screenshot-level accessibility review of the current one-page portfolio at `http://127.0.0.1:3001/`.

## Overall rating

8.4/10 for a startup PM or Design Engineer application.

## Steps

1. First impression — strong
   - Clear hybrid positioning and credible context.
   - The introduction is polished but still dense for a five-second recruiter scan.
   - Evidence: `01-first-impression.jpg`.

2. Projects and skills — good
   - Distinctive, consistent card treatment and a focused project set.
   - Project descriptions do not yet expose role, scope, or measurable outcomes.
   - `/skills` labels look interactive but are rendered as static articles.
   - Evidence: `02-proof-sections.jpg`.

3. Impact and contact — strong
   - Quantified impact is the strongest recruiter-facing section.
   - The contact path is obvious and offers both email and résumé actions.
   - Impact claims would be more convincing with a visible connection to projects or roles.
   - Evidence: `03-impact-and-contact.jpg`.

4. Mobile first impression — good
   - Readable reflow, stable hierarchy, and no visible clipping.
   - The introduction consumes most of the first mobile viewport before proof appears.
   - Evidence: `04-mobile-first-impression.jpg`.

## Strengths

- Strong visual restraint and consistency.
- Clear PM + Design Engineer positioning.
- Good semantic heading order and descriptive project-link names.
- Quantified impact and a straightforward contact path.
- Mobile typography remains readable.

## Highest-impact opportunities

1. Add one short proof line to each project: your role, what shipped, and one outcome.
2. Make the agent-skill rows clickable or remove the path-like styling.
3. Reintroduce a compact experience bridge or add company attribution to project and impact evidence.
4. Tighten the mobile introduction by one or two lines so project proof appears sooner.

## Accessibility limits

- Screenshots and DOM structure support the hierarchy and readability findings.
- Full keyboard order, screen-reader behavior, zoom behavior, and exact contrast compliance were not exhaustively tested.
