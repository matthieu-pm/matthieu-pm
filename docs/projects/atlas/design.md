# Design Atlas's portfolio presentation

Read the [website guide](../../../design.md) first.

## Scope and reader's job

Help a portfolio visitor recognize Atlas as an AI-powered MCQ exam-practice project and open it. This repository contains its homepage card, local logo, and external destination. It does not contain Atlas's application source, so this guide defines that presentation only. Application-wide colors, typography, learning flows, and states must be documented in Atlas's own project from its actual implementation.

## Composition

Keep Atlas in the homepage Projects grid as a single linked card, with the local mark above its name and a short description below. Its peers are OKLCH and Inspirations. Match their label typography, spacing, card geometry, and interaction weight.

The current destination is `https://atlasapp.fr`, as configured in the homepage source. Preserve the external-link behavior unless the requested change explicitly changes navigation. The card should not look like an embedded or locally hosted exam interface.

## Visual baseline

- Use `/logos/atlas.svg`, rendered at 80 × 80px within the card's flexible visual area. Preserve the artwork and aspect ratio.
- Inherit the homepage card's 18px radius, 4px inset shell, warm neutral surround, and white inner surface.
- Use 26px card padding, a 16px weight-500 name, and a 16px/24px muted description.
- Keep the card's two-column desktop and single-column mobile behavior. Preserve the current minimum heights of 238px and 250px respectively.
- The logo is decorative within the link because the project name is visible. Do not repeat its name unnecessarily for screen readers.

## Language and evidence

The current description is “AI-powered MCQ exam practice.” Keep new copy brief and specific to verified product capabilities. Do not claim higher grades, personalized pedagogy, adoption, or measured learning outcomes without evidence. Use authentic application screenshots only when supplied or inspected for a requested expansion.

## Interaction and verification

The entire card is a real link with the same subtle hover lift and visible keyboard focus as its peers. Keep a usable touch target and avoid nested interactive controls inside the link.

For presentation changes, inspect the complete Projects grid at desktop and 390px mobile. Check optical logo balance, wrapping, focus, and the configured destination. Do not report the external app's behavior as verified from inspecting its portfolio card.

## Source map

- `../../../apps/web/app/page.tsx`: card copy, logo, and destination.
- `../../../apps/web/app/page.module.css`: grid and card content layout.
- `../../../apps/web/app/card.module.css`: shared surface geometry.
- `../../../apps/web/public/logos/atlas.svg`: project mark.
