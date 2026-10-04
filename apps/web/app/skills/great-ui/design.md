# Design the Great UI showcase

Read the [website guide](../../../../../design.md) first. This guide owns `/skills/great-ui`; `/skills/better-ui` redirects here.

## Reader's job and identity

Help a builder understand what the Great UI agent skill improves, try the details, and copy its installation command. The page itself should demonstrate the craft it teaches: consistent geometry, optical balance, contextual state changes, and purposeful motion.

Preserve attribution to Better UI and Emil Design Engineering. The showcase explains their combined value without replacing their source instructions or implying invented capabilities.

## Composition

Use the 644px editorial column on the portfolio's light canvas. Begin with home/copy-link controls, the `/great-ui` title, a short benefit statement, source context, and installation. Follow with the static/motion interface comparison, radius lab, craft details, source links, and the repeated installation action at the end.

The demos carry the argument. Keep explanatory text close to its example and avoid adding an extra marketing hero or a prompt editor. The final install block is a useful action after inspection, not a second explanation of the skill.

## Visual baseline

| Role | Current treatment |
| --- | --- |
| Canvas / ink / muted prose | `#fcfcfc` / `#1f1f1f` / `#6b6b6b` |
| Page padding | 64px vertically, 24px horizontally on desktop |
| Body | Geist Sans, 16px/1.5 |
| Page title | 36px, weight 500, line height 1.2 |
| Lead | 24px/1.4, up to 570px wide |
| Header controls | 36px circles, neutral fill, subtle press response |
| Install surface | 18px outer radius with a 14px inner command row |

Use the owning `showcase.module.css`; preserve the warm neutral shells, white inner surfaces, restrained shadows, and existing accent roles. Color in command syntax and the demos should stay local. The page currently has a light theme only.

## Interface comparison

The two panels contain the same family of controls and comparable visual geometry. Both are polished; the comparison isolates static versus animated state changes. Keep the static panel static while retaining working buttons. Do not blur it, reduce its quality, or animate it to exaggerate the other side.

Preserve period selection, play/pause count behavior, copy, follow, and notification states. These are demonstrations with local state, not a connected analytics or social product. Keep accessible button names aligned with their current action and confirm copy near its trigger.

Motion should explain continuity: icon swaps, state labels, counters, presses, and selection. It must be interruptible, responsive to repeated input, and removable with reduced motion. Do not turn a local motion refinement into changes to the surrounding shell or the static panel.

## Geometry lab

Keep the invariant `outer radius = inner radius + padding`. Initial values are inner radius 12px and padding 8px, giving outer radius 20px. The current ranges are outer radius 4–40px, inner radius 0–24px, and padding 4–16px.

The outer-radius control adjusts the other values within their valid ranges. Preserve this dependency instead of allowing three unrelated numbers to contradict the diagram. Labels, numeric outputs, range tracks, and the preview must update together.

Keep the nested geometry illustration visually separate from its controls and outer demo shell. An edit to the illustration's border or fill should not unintentionally recolor the entire lab. Maintain sufficient contrast to distinguish every layer without redundant outlines.

## Responsive behavior and accessibility

Use the existing 680px mobile breakpoint. Let the comparison and lab reflow in their established order, retain readable labels, and wrap installation commands without breaking copying. Preserve visible focus, native range keyboard behavior, and non-color state cues.

## Verification for future changes

Check static and motion panels independently at desktop and 390px. Exercise every state, repeated copy, counter play/pause, and reduced motion. Test all three radius controls at their endpoints and confirm the invariant after each change. Watch animated playback; a static screenshot cannot prove the intended comparison.

## Source map

- `page.tsx`: narrative, source attribution, installation placement.
- `controls.tsx`: `InterfaceLab`, `DemoCanvas`, `RadiusLab`, header and install controls.
- `showcase.module.css`: component geometry, surfaces, state styling, motion, responsive rules.
