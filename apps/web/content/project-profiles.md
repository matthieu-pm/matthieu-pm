# Project descriptions

Repository-based descriptions reviewed on 10 November 2026. These profiles cover the six projects listed on Matthieu's homepage. They explain the implementation and product choices visible in the project folders; they are not an assertion that every optional integration or feature is enabled on a public deployment. Product decisions below are supported by project documentation or by the implemented flow. No usage, revenue, learning-outcome, or research-result claims are implied.

## My collection

Website: https://matthieu.pm/inspirations

### Product and audience

My collection is a curated directory for designers, product builders, and design engineers. It brings together interface references, component libraries, development and AI tools, visual resources, utilities, and people worth following. The purpose is to help a visitor find something useful, understand its role, inspect a preview, and open the original resource. A separate My stack section shows tools Matthieu uses.

### Technology and architecture

The collection lives inside the matthieu.pm Bun and Turborepo monorepo. The web application uses Next.js 16 App Router, React 19, TypeScript, CSS Modules, shared UI components, and Geist typography, and is hosted on Vercel. Resource records are maintained in local JSON catalogues and assembled by a typed catalogue module. Each record carries a name, description, destination, and optional icon and preview. Navigation and counts derive from this data. A persistent client-side shell manages browsing controls and dialogs across category routes; local preferences keep view and sound choices consistent.

The same catalogue data feeds the public read-only MCP server. Its collection search supports keywords, categories, pagination, and original source links. Separate tools search and read published writing and skill guides. WebMCP exposes those read operations and bounded site navigation to compatible browsers. Markdown content negotiation and the LLM text exports provide additional text interfaces. These adapters reuse the site's data and published-content list rather than maintaining a separate catalogue. The collection does not need a user-account system or application database.

### Features

- Categories for inspiration, components, build tools, visuals, utilities, and designers.
- Global resource search, grouped sections, category navigation, and grid/list views.
- Resource artwork, expanded previews, external destinations, and useful fallbacks when media is missing.
- My stack previews, light/dark appearance, optional interaction sounds, and responsive navigation.
- Keyboard alternatives for previews and dialogs, Escape dismissal, focus restoration, and reduced-motion handling.
- A recognizable interactive glass-triangle identity and animated artwork, with source and licence notices retained.
- Read-only discovery through MCP, WebMCP, Markdown, and the full-text export.

### Product decisions

The content is curated rather than automatically scraped: short descriptions explain what each resource helps someone do. Categories follow function, and a resource can belong to more than one category; global search deduplicates destinations. Grid and list are two ways to browse the same records, so changing presentation does not change the resource set. Dense, restrained catalogue typography keeps scanning efficient, while expressive artwork gives the directory an identity. Preview and sound remain optional aids to exploration. Accounts, bookmarks, and submission workflows are outside the current browsing product. External sites remain references; the agent interfaces do not fetch them on the visitor's behalf.

## Atlas

Website: https://atlasapp.fr

### Product and audience

Atlas turns study materials into structured exam practice. It began around SKEMA Business School courses and lets learners upload their own documents, generate courses and lessons, practise questions at different difficulty levels, and see where they need more work. The core loop connects a learner's source material to repeated practice and visible progress.

### Technology and architecture

The application uses Next.js 16 App Router, React 19, TypeScript, Bun, Tailwind CSS, shadcn/ui and Radix components, Framer Motion, and Recharts. Clerk supplies authentication. Convex is the current application backend and file-storage layer: its schema contains generated courses, lessons and questions, progress, files, token-usage logs, folders, tags, sharing, friendships, and study groups. Earlier PostgreSQL code and README references remain in the repository, but the current generation route and frontend provider use Convex.

Authenticated Next.js API routes coordinate document extraction and AI generation. PDF, DOCX, PPTX, and text inputs are converted to text; the generation pipeline analyzes the course structure, divides it into lessons, generates questions, validates the structured result, and persists the course in Convex. OpenAI's Responses API handles generation, with separate configurable defaults for course analysis and question generation. The default question strategy requests all difficulties together; incomplete or invalid results can fall back to per-difficulty generation. Usage checks and plan limits sit before generation, and the interface receives progress updates while work runs.

### Features

- Document uploads and AI-generated courses organized into lessons.
- Easy, medium, and hard practice, with explanations and structured single-choice, multiple-selection, and true/false question support in the generation model.
- Randomized quiz order, course progress, final tests, flashcard progress, XP, levels, and streaks.
- Analytics for accuracy, difficulty, course progress, weak areas, and recent activity.
- Folders, tags, file management, and account/usage settings.
- Course-sharing links, optional passwords and cloning permissions, friends, study groups, and leaderboards with privacy controls.
- English, French, Spanish, Italian, Portuguese, and Chinese interface translations.

### Product decisions

The generation prompts explicitly constrain questions, answers, and explanations to the uploaded material. This keeps practice tied to the learner's course rather than a generic subject summary; it is a generation constraint, not a guarantee that model output is error-free. Difficulty levels and explanations support repeated practice, while analytics turn results into a next study action. Progress and social features give learners reasons to return without replacing the study task. Sharing and cloning make a generated course reusable, with controls over access and copying. Separating analysis from question generation and using a validated fallback balances generation cost, latency, and completeness. Storage and token allowances make expensive generation visible and bounded. No measured improvement in grades or learning outcomes is claimed.

## Atrium

Website: https://atriumcrm.com/

### Product and audience

Atrium is an AI-oriented CRM for revenue teams. It connects companies, contacts, deals, communication, enrichment, and follow-up work in one workspace. Its product direction is to make customer data actionable: users can structure the information their business needs, inspect the relevant context, and move from a record or segment to the next task without assembling that context across separate tools.

### Technology and architecture

The application uses Next.js 16 App Router, React 19, TypeScript, and Bun. Clerk manages identity and organizations; Convex stores workspace data and supplies reactive queries and mutations. An oRPC layer supports server operations. The interface uses Tailwind CSS, shadcn/ui and Radix primitives, dnd-kit for reordering and drag/drop, React Flow for workflow surfaces, Recharts for reporting, and next-intl for localization.

The CRM model includes standard companies, contacts and deals, explicit relationships, custom attributes, custom objects, lists, and saved views. Attribute definitions and per-record values support business-specific schemas without turning every variation into a new hard-coded screen. Organization membership scopes workspace operations.

Pulse is the assistant entry point into that model. Its default execution path routes requests to specialists for CRM reads, CRM actions, research and enrichment, outreach, campaigns, lists/views, reporting, workflows, and record resolution. Specialists share grounded lookup helpers, scoped tools, handoffs, and persisted conversation state. The model layer supports configurable selection and routing; current Pulse model definitions use OpenAI routes, while Anthropic integration code also remains in the application. Provider, enrichment, communication, and billing integrations require their own configuration.

### Features

- Editable company and contact tables, custom fields, column ordering and visibility, filtering, saved views, and bulk operations.
- Deal pipelines with configurable stages and cards, inline editing, related-record lookups, and saved pipeline views.
- Custom objects with their own attributes and working views; lists for focused segments of a single object type.
- CSV import, duplicate-aware contact import, CSV/Excel export, archiving, and restore.
- AI attributes for classification, summarization, research, and custom prompts, including record-variable interpolation and bulk generation.
- Company/contact enrichment adapters, notes, activities, email/calendar context, campaigns, and email templates.
- Pulse-assisted record retrieval, proposed actions, outreach, reporting, workflow creation and execution, and duplicate-resolution workflows.
- Workspace membership, roles, account settings, and AI-usage tracking.

### Product decisions

Objects define record types; lists define working sets. Keeping those concepts separate lets teams adapt their workflow without fragmenting the underlying data. Related-record attributes put context in the table or pipeline where a decision is made. AI is connected to the CRM's records and actions rather than limited to free-form chat. Specialist routing gives distinct tasks explicit tool and context boundaries. Record resolution prepares and previews a merge; approved mutations are handed to the CRM-action specialist. Archiving provides a recoverable way to remove records from active work. Configurable views let different teams work over the same data in the form they need.

The code documents concrete limits: reporting changes require structured configuration; workflow edits need a grounded target and structured changes; some list/view actions depend on active UI context; direct deal enrichment is not supported by the enrichment specialist. Integration availability and enabled workflows depend on the workspace configuration.

## Carbon

Website: https://carbonhq.sh

### Product and audience

Carbon is a desktop home for coding agents. It puts multiple agent conversations beside their working directories, Git changes, pull requests, issues, and browser sessions. The intended user is a builder coordinating several coding tasks who needs to understand what each agent is doing and inspect its result. Carbon is based on Dray by yogesharc under Apache License 2.0; the repository records that upstream foundation and its third-party credits.

### Technology and architecture

The desktop application combines a React 19, TypeScript, and Vite renderer with a Tauri 2/Rust backend and Tokio-based asynchronous work. It wraps coding-agent CLIs, including Claude Code, Codex, fx, and pi, rather than implementing a model service in the portfolio website. Provider-specific harnesses adapt agent output and control flows to a shared conversation interface. The repository also contains a standalone Rust CLI, shared protocol types, a Next.js marketing site, and documentation.

The native backend owns processes, local files, Git operations, and services needed before the frontend exists. Sessions are persisted as JSONL event transcripts with a JSON session index; settings, drafts, attachments, and browser profiles have separate local stores. A local socket lets the Carbon CLI communicate with the running application. Remote-server support extends sessions to another machine, including Linux, and the embedded Chromium browser gives a session its own browsing context. Local transcription uses transcribe.cpp and downloaded speech models. GitHub and Linear integrations connect code and issue work to the conversation.

### Features

- Multiple sessions with agent/model selection, persistent conversation history, attachments, and saved task drafts.
- Per-session Git worktrees, branch selection, changes/diff inspection, pull-request context, and issue panels.
- Embedded browser tabs that can be prepared before a task and carried into the session.
- CLI operations for listing, creating, and messaging sessions and coordinating work between agents.
- Remote servers, browser automation commands, and development-server sharing.
- MCP server configuration, skill management, contextual mentions, and visible tool-permission prompts.
- Local dictation, interface/font preferences, subscription-usage indicators where providers expose them, and beta-update support.

### Product decisions

The session is the unit of work: conversation, branch, worktree, browser, and review context stay together. Separate worktrees make parallel tasks easier to inspect and reduce accidental interference between branches. Existing agent CLIs and their configurations remain the execution foundation, while Carbon supplies a consistent desktop workspace around them. Local transcript storage keeps work resumable and inspectable without requiring Carbon to host conversations; agent providers and explicitly used integrations still receive the requests needed for their services. The CLI makes coordination available to agents as well as people. Local speech processing keeps dictation audio on the machine.

Release status and boundaries matter: the repository records a macOS beta release. Pages/Spaces code is feature-gated and disabled by default, so it should not be presented as a generally available feature. Provider capabilities and edit/replay behavior vary; for example, latest-prompt replay is restricted to eligible text-only Codex turns.

## Forge

Website: https://app.forgenow.tech/

### Product and audience

Forge is an issue-tracking and agent workspace for software teams. It connects incoming work, personal execution, team planning, documents, and agent-assisted actions in a shared product available through the web and a macOS host. The central idea is that an agent should work with the same issues and workspace context as the team, while people retain a clear view of proposed changes and their results.

### Technology and architecture

The current application uses TanStack Start and Router, React, TypeScript, Vite, Tailwind CSS, shadcn/ui/Base UI components, and Tiptap editing. A Bun/Turborepo workspace separates the application, shared packages, and services. Better Auth manages authentication and organizations. Neon Postgres and Drizzle hold canonical product data; a contract-first oRPC layer and OpenAPI 3.1 describe the public API. The Electron Forge macOS shell hosts the same renderer and brokers the official local Codex app-server.

Authenticated server commands own issue creation and editing, membership checks, relations, revisions, and retry receipts. Bounded authorized queries supply team and personal issue views; client caches are projections of server state rather than a second authoritative database. Legacy browser data has a resumable import path. Revision checks support visible conflict resolution. Durable PostgreSQL jobs provide identity, leases, checkpoints, retry budgets, and recovery, while the Workflow SDK handles application-owned durable business workflows.

Agent execution runs through a separate EVE service. Product capabilities remain behind the application authorization boundary, and material writes require approval and idempotency. Generated code runs in isolation without application or model-provider credentials. Provider eligibility, usage accounting, and spending controls are explicit policies rather than assumptions made by the renderer.

### Features

- Inbox triage, My Issues tabs, team issue views, filters, ordering, and paginated queries.
- Issue detail editing, statuses, priorities, assignees, labels, sub-issues, relationships, comments, activity, reactions, subscriptions, and attachments.
- Workspace/team planning surfaces for projects, cycles, initiatives, saved views, documents, and templates, subject to their owning rollout gates.
- A full Forge conversation workspace and a compact Ask Forge panel over the current page, with thread history and approval cards.
- Meeting transcript, recap, note, and follow-up surfaces, with native import dependent on provider OAuth and scheduled synchronization.
- Scoped API credentials, documented API contracts, and idempotent resource creation.
- Shared-renderer macOS integration and a local Codex broker; configured cloud execution uses the separate runtime.

### Product decisions

Human edits and agent actions use the same canonical product services so permissions, validation, history, and retries have one source of truth. My Issues is derived from the authenticated actor's assignments, authorship, and subscriptions, rather than a separate personal task database. Approval is attached to the action and its authority; a chat response alone is not evidence that a mutation happened. Durable receipts and transactional commands make retries safer, while explicit conflicts protect concurrent editing. Sharing the renderer keeps the desktop and web product aligned instead of maintaining two independent interfaces. Server feature gates keep unfinished or unqualified integrations from looking available.

The repository labels the current build unreleased. Some modules have implemented server-backed paths but require rollout and deployment qualification. Signals and Reviews are restricted to explicitly granted, fictional read-only previews. Inbound external MCP is documented as gated work. Resources, Loops, and other optional modules should not be described as universally enabled merely because their code exists. Provider qualification and hosted acceptance are separate from local or fixture tests.

## Researchie

Website: https://survey.matthieu-pm.chatgpt.site

### Product and audience

Researchie presents a research questionnaire as a conversation. It supports exploratory work on how people use AI assistants, judge outcomes, check and repair results, and set boundaries for delegation. Participants move through one question at a time using inline choices or written replies; researchers receive structured, versioned responses for needs discovery and scenario design.

### Technology and architecture

The implementation uses React, TypeScript, shadcn/ui and Radix-based components, Tailwind CSS, Next-compatible App Router source, and a Vinext/Vite execution setup. Cloudflare D1 stores data through Drizzle's SQLite schema. The hosted Sites environment supplies researcher authentication; participant response links can be used without an account.

A versioned questionnaire in `lib/survey.ts` defines question wording, answer types, and deterministic branching. The conversational component renders the current eligible question, while the survey API validates and persists responses. The schema separates studies, survey responses, sessions, and optional publication-update contacts. Participant mutations use a random response token whose hash is stored on the server. A browser-tab session retains the token for resume and withdrawal. Researcher access controls listing and export. The protocol and complete instrument document what each question is intended to establish.

### Features

- Consent, recent-task recall, intended success, checking, correction and recovery, effort, consequences, control, delegation, and priorities in one linked questionnaire.
- Different paths for participants with a recalled task, those who cannot recall one, and those who have not used AI.
- Conditional follow-ups, optional skips, inline choices, written answers, and answer review before submission.
- Autosave and same-tab resume; reopening an earlier answer resets later answers so branch conditions remain consistent.
- Participant answer downloads and withdrawal, researcher participant links, and CSV/JSON export.
- Separate preview responses excluded from normal exports, versioned records, and event history for interpretation.
- Optional, separately consented publication-update email signup, stored apart from survey exports and deleted with a withdrawn response.

### Product decisions

The chat presentation makes a structured form approachable, while fixed wording and deterministic branches keep the research instrument reviewable and comparable. Follow-ups stay anchored to one recalled task before asking broader preferences, which helps preserve the participant's own account. Earlier-answer edits invalidate later answers rather than silently retaining responses to an inapplicable branch. Account-free participation reduces entry friction; authenticated researcher access keeps management and export separate from participation. Notification consent is separate from research participation and does not change the survey answers.

This is a conversational survey, not a live generative interviewer. The protocol identifies it as an owner-private pilot: recruitment information and retention arrangements require finalization before broader recruitment. Recalled behavior and self-reported effort do not establish observed performance, causal effects, predictive validity, or validated trust scores. Event timing includes interruptions. The tab-scoped resume token can be lost when the tab closes. Publication-update email delivery is not automated. These boundaries are part of the product and research design, not measured study findings.
