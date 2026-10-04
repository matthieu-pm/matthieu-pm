# Design the Product Bet showcase

Read the [website guide](../../../../../design.md) first. This guide owns `/skills/product-bet`.

## Reader's job and identity

Help a product manager, founder, or product engineer understand how the skill turns an idea into a bounded investment decision, inspect an example, and install it. The page should feel practical, explicit about uncertainty, and easy to audit.

The distinctive object is the transformation from an unbounded idea to a testable bet. Preserve the example's problem, investment boundary, riskiest assumption, first test, and conditional recommendation. A polished presentation must not make exploratory evidence appear conclusive.

## Composition

Use the shared 644px editorial column with compact home/copy-link controls. Lead with `/product-bet`, its benefit statement, intended audience, and the installation command. Keep the example link close to this introduction.

Follow with the Before/After demonstration and the supporting decision material, including alternatives and outcome-dependent next steps. Give readers enough detail to understand the reasoning without turning every fact into a separate card. Preserve the source and installation destinations supplied by the page.

## Visual baseline

- Canvas `#fcfcfc`, ink `#1f1f1f`, secondary prose `#6b6b6b`; Geist Sans at 16px/1.5.
- Desktop page padding is 64px vertically and 24px horizontally; content is at most 644px wide.
- The title is 36px/1.2 at weight 500; the lead is 24px/1.4 with a 570px maximum measure.
- Neutral 36px circular header controls, inset installation surfaces, fine borders, and restrained shadows connect it to Great UI and the portfolio.
- Use the local `showcase.module.css`. The page is currently light-only.

The example artifact can use compact labels, a status badge, and aligned fact rows because those express a decision's structure. Do not spread badges and colored panels across ordinary prose. Preserve equal type treatment for peer alternatives and outcomes.

## Example and evidence rules

The current idea concerns AI-generated weekly summaries. The shaped example proposes a human-reviewed concierge test for five opted-in managers, with one setup week, one owner, and two weekly cycles. These are illustrative commitments within the example, not real customer results or a general guarantee.

Preserve the distinction between supported, unsupported, harmful, invalid, and inconclusive outcomes. Each leads to a different next action. Do not collapse uncertainty into a pass/fail score or use a green recommendation to imply evidence the page does not have.

Keep alternative approaches comparable, including retaining the current workflow. Use concise rows and concrete tradeoffs. If adding quantitative claims, show their source, unit, period, and comparison basis near the claim.

## Interaction contracts

`BetDemo` starts in Before. Its two buttons select the raw idea or shaped bet, expose `aria-pressed`, and control the same live preview. This is a prewritten comparison, not a live AI generation interface. Keep state changes direct and the toolbar stable.

The install and page-link copy controls have idle, copied, and error states. Successful feedback resets after 2,500ms. Preserve accessible status text, repeated-click timing, and a clear failure message. Do not show success when copying fails.

Tooltips support recognition; they must not be necessary to understand the main action. Keep them near their trigger and usable with keyboard focus. Avoid unnecessary explanatory captions that repeat visible UI.

## Responsive behavior and accessibility

Retain the local responsive rules and the root guide's readable type and focus requirements. Long commands should wrap without losing their literal copy value. Fact rows and alternatives should reflow without breaking label/value relationships. Keep both Before and After usable at narrow widths and with reduced motion.

## Verification for future changes

Inspect both example states on desktop and 390px mobile. Verify toggling, focus, copy success/error handling, tooltip placement, and long-command wrapping. Check that revisions preserve every example qualifier and all five outcome branches. Any animation must preserve a readable result under reduced motion.

## Source map

- `page.tsx`: narrative, example artifact, alternatives, outcome rules, metadata.
- `controls.tsx`: `BetDemo`, copy controls, feedback, installation links.
- `showcase.module.css`: layout, artifact surfaces, tooltips, and responsive states.
