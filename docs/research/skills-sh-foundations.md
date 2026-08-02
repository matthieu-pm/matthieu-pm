# skills.sh foundations for PM × design-engineering skills

Research checked on 2026-08-01 against skills.sh listings and the linked source repositories. The strongest source is [product-on-purpose/pm-skills](https://www.skills.sh/product-on-purpose/pm-skills): it is a coherent, Apache-2.0 PM library whose skills use a repeatable `SKILL.md` + template + worked-example structure. Its atomic artifacts are better raw material than importing one broad “product manager” persona.

## Ranked recommendations

### 1. `shape-product-bet`

Best foundation: combine these exact skills from **product-on-purpose/pm-skills**:

- [`define-problem-statement`](https://www.skills.sh/product-on-purpose/pm-skills/define-problem-statement) — segment-specific problem framing, evidence, business context, baselines/targets, constraints, and open questions ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/define-problem-statement/SKILL.md)).
- [`define-opportunity-tree`](https://www.skills.sh/product-on-purpose/pm-skills/define-opportunity-tree) — traces a measurable outcome through evidenced customer opportunities to multiple solutions and assumption tests ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/define-opportunity-tree/SKILL.md)).
- [`define-prioritization-framework`](https://www.skills.sh/product-on-purpose/pm-skills/define-prioritization-framework) — filters RICE, ICE, MoSCoW, Weighted Scoring, and Kano by data availability; compares divergent rankings and refuses fabricated scores ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/define-prioritization-framework/SKILL.md)).
- [`develop-solution-brief`](https://www.skills.sh/product-on-purpose/pm-skills/develop-solution-brief) — a one-page bridge from problem to proposed solution, limited to essential capabilities, measurable outcomes, explicit trade-offs, risks, and next actions ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/develop-solution-brief/SKILL.md)).

What to reuse: evidence-versus-assumption discipline, “problem before solution” routing, multiple options, transparent prioritization, success metrics, trade-offs, and scope boundaries.

Caveat: these source skills produce separate artifacts. The new skill should add the missing synthesis step: one decision-ready **bet** with alternatives considered, smallest valuable scope, validation plan, and explicit kill criteria. Do not simply concatenate four templates.

### 2. `prototype-to-learn`

Best foundation: the **product-on-purpose/pm-skills** Design Sprint pair:

- [`tool-design-sprint-prototype-plan`](https://www.skills.sh/product-on-purpose/pm-skills/tool-design-sprint-prototype-plan) locks the learning target, storyboard-derived scope, fidelity bar, build roles, Five-Act interview script, trial-run gate, and participant plan ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/tool-design-sprint-prototype-plan/SKILL.md)).
- [`tool-design-sprint-test-and-score`](https://www.skills.sh/product-on-purpose/pm-skills/tool-design-sprint-test-and-score) captures behavioral observations, attributed quotes, a customer-by-question scorecard, patterns, independent “hot takes,” and a build/iterate/pivot/stop decision ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/tool-design-sprint-test-and-score/SKILL.md)).

For the actual interface craft, borrow the bounded browser-QA loop and design-context loading from [`impeccable`](https://www.skills.sh/pbakaus/impeccable/impeccable) by **Paul Bakaus / pbakaus/impeccable** ([source `SKILL.md`](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md)).

What to reuse: prototype fidelity as a function of the decision, realistic data/copy, trial run before research, non-leading tasks, behavioral observation, and a forced next decision.

Caveat: `tool-design-sprint-prototype-plan` explicitly **does not build the prototype**. Your skill’s differentiator should be joining planning, implementation, browser verification, and learning synthesis into one bounded workflow; `impeccable` contributes craft but not research rigor.

### 3. `instrument-product`

Best foundation: three exact **product-on-purpose/pm-skills** skills:

- [`measure-instrumentation-spec`](https://www.skills.sh/product-on-purpose/pm-skills/measure-instrumentation-spec) starts with decisions/questions, then defines events, exact triggers, typed properties, user properties, PII handling, and a QA checklist ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/measure-instrumentation-spec/SKILL.md)).
- [`measure-experiment-design`](https://www.skills.sh/product-on-purpose/pm-skills/measure-experiment-design) defines one falsifiable hypothesis, control/treatment, one primary metric, secondary and guardrail metrics, sample size, duration, allocation, and precommitted win/loss/inconclusive criteria ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/measure-experiment-design/SKILL.md)).
- [`measure-dashboard-requirements`](https://www.skills.sh/product-on-purpose/pm-skills/measure-dashboard-requirements) frames dashboards around decisions, with metric formulas, sources, segments, latency, thresholds, permissions, and acceptance criteria ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/measure-dashboard-requirements/SKILL.md)).

What to reuse: question → metric → event → implementation QA → experiment/readout traceability, plus privacy and guardrails.

Caveat: the sources stop at specifications. The new skill should validate the actual implementation against the spec and include a compact metric tree; otherwise it demonstrates documentation more than product ownership.

### 4. `synthesize-discovery`

Best foundation: [`discover-interview-synthesis`](https://www.skills.sh/product-on-purpose/pm-skills/discover-interview-synthesis) by **product-on-purpose/pm-skills**. It profiles participants, tags recurring themes, requires attributed verbatim evidence, turns observations into “why” insights, ties recommendations back to evidence, assigns confidence, protects PII, and records sample limitations ([source `SKILL.md`](https://github.com/product-on-purpose/pm-skills/blob/main/skills/discover-interview-synthesis/SKILL.md)).

Useful secondary reference: [`summarize-interview`](https://www.skills.sh/tarunccet/pm-skills/summarize-interview) by **tarunccet/pm-skills**, which structures a single interview around Jobs to Be Done, satisfaction, evidence, and action items ([source repository](https://github.com/tarunccet/pm-skills)).

What to reuse: traceability from source → observation → theme → insight → recommendation, confidence labels, contradictions, and explicit research limitations.

Caveat: the strongest source assumes several interviews and tends toward a report. Your skill should also accept support tickets, sales notes, and mixed evidence; preserve one-off contradictions and weak signals instead of hiding them behind frequency thresholds.

### 5. `design-production-qa`

Best foundation: [`ui-doctor`](https://www.skills.sh/iress/design-system/ui-doctor) by **Iress / iress/design-system**. It combines component-system compliance, WCAG accessibility, Nielsen usability heuristics, cognitive load, progressive disclosure, severity, prioritized recommendations, and reusable checklist/report references ([source `SKILL.md`](https://github.com/iress/design-system/blob/main/.agents/skills/ui-doctor/SKILL.md)).

Add two narrower sources:

- [`web-design-guidelines`](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) by **Vercel / vercel-labs/agent-skills** for a current, terse `file:line` correctness review against a maintained guideline set ([source `SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)).
- [`impeccable`](https://www.skills.sh/pbakaus/impeccable/impeccable) for visual craft, responsive inspection, reduced-motion/contrast/overflow checks, and a bounded screenshot → fix → confirmation loop ([source `SKILL.md`](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md)).

What to reuse: multiple QA axes, evidence attached to exact locations, severity and priority, incumbent design-system context, desktop/mobile inspection, and a finite verify-after-fix pass.

Caveat: `ui-doctor` is IDS-specific, `web-design-guidelines` is principally static/code review, and `impeccable` is deliberately opinionated about taste. Generalize the checks, add live interaction/state testing and performance evidence, and keep “audit only” separate from “audit and fix.”

## Build order

Start with `shape-product-bet`, then `prototype-to-learn`, then `instrument-product`. Together they express the strongest portfolio story: frame a consequential decision, materialize the smallest credible test, and measure whether it worked. Build `synthesize-discovery` next as the evidence engine feeding bets, then `design-production-qa` as the delivery-quality layer.

The key design choice is orchestration, not coverage. skills.sh already has good atomic PRD, research, analytics, and UI-audit skills; your new skills become distinctive by carrying one decision across those boundaries while preserving evidence and producing an inspectable artifact at every handoff.
