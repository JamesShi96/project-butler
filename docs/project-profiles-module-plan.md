# Project Profile System Module Plan

Status: Superseded proposal. This document preserves the original design discussion for Project Profile System. The current product source of truth is now:

- [docs/prd/main.md](prd/main.md)
- [docs/prd/features/project-profile-system.md](prd/features/project-profile-system.md)

If this proposal conflicts with the PRD files, the PRD files win.

## Purpose

Project Butler currently manages project memory with one general-purpose workflow. That works for many projects, but different project types need different document systems, status views, and end-session checks.

The proposed Project Profile System lets Project Butler adapt its management style to the project without forcing every project into the same PRD/document structure or a single rigid project category.

## Product Principle

Project Butler should not force users to learn a taxonomy before their project memory can be set up.

Project understanding should start from the user's natural description, then Project Butler should infer the management shape, ask only for missing high-value details, and propose a file system for confirmation.

The product flow should be:

```text
Free-form project description
→ AI summarizes project shape
→ AI asks targeted follow-up questions
→ AI proposes Required / Recommended / Optional document structure
→ User confirms or edits before files are created
```

Internally, project classification should still be based on management needs, not industry labels. The generated project profile should answer:

1. What is the project primarily delivering?
2. What extra complexity does the project need to manage?
3. Which documents are required, recommended, or optional for this specific project?
4. How deeply should Project Butler maintain those documents by default?

This leads to a composable model:

```text
Project Profile = Generated Project Shape + Optional Overlays + Document Tiers + Maintenance Preference
```

Generated Project Shape is Project Butler's synthesized understanding of what the user is trying to build or produce. It can borrow from reference archetypes but should not force the user into one fixed category.

Overlays are complexity modules. They answer: what extra management dimensions does this project need because of AI, data, research, design, compliance, clients, or multi-agent coordination?

## Product Goal

The goal is not to create a complete taxonomy of every possible project type. That would become long, fragile, and difficult to choose from.

The goal is to generate a useful project management shape from conversation:

- recommended document system,
- status focus,
- end-session checks,
- version style recommendation,
- and cross-tool memory behavior.

## Profile Builder Rule

Project Butler should not ask the user to pick one fixed primary type up front. It should ask the user to describe the project in their own words:

```text
What are you trying to do with this project?
You can describe it casually. No format needed.
```

Then Project Butler should summarize its understanding and ask targeted follow-up questions only for missing details.

Reference archetypes and overlays should guide the recommendation, but the final output should be project-specific:

```text
Generated Project Shape:
- AI agent SaaS MVP

Management risks:
- product scope drift
- prompt/eval drift
- UX state inconsistency
- release planning

Required:
- prd/
- ai-architecture/
- evals/

Recommended:
- tech-design/
- roadmap/
- failure-cases/
- releases/

Optional:
- design-system/
- user-research/
- feedback/
- datasets/
```

Default rules:

1. Required directories should usually be limited to 3-4.
2. Recommended directories should usually be limited to 5-6.
3. Optional directories may be listed but are not created unless selected.
4. Every Required or Recommended directory should have evidence or rationale.
5. Use stable directory names from the project-butler vocabulary where possible.
6. Ask for confirmation before files are created.
7. Recommend at most 2 overlays by default; ask before adding more complexity.

## Key Decision

AI / Agent / RAG should not be a mutually exclusive primary project type.

AI work can appear inside product projects, engineering projects, research projects, and client delivery projects. A user-facing AI agent product may need PRD, design system, research, roadmap, releases, prompts, evals, datasets, and failure cases. A RAG SDK may need architecture, API docs, compatibility, evals, datasets, and model notes, but not necessarily PRD or design system docs.

Therefore:

- Generated Project Shape defines the main delivery workflow.
- Overlays add specialized management dimensions.
- AI products may still need PRD/design/roadmap when their delivery shape is product-like.
- AI engineering systems may still need architecture/API/testing/compatibility when their delivery shape is engineering-like.

## Reference Archetypes

These archetypes are internal references, not a fixed user-facing selection list.

Project Butler can borrow from them to generate the final Required / Recommended / Optional document system. The user should not need to understand or choose the archetype names.

Each archetype separates documents into three tiers:

- **Required**: created by default because the profile does not work without it.
- **Recommended**: pre-selected by default, but the user can remove it before setup.
- **Optional**: created only when the user selects it, existing project evidence supports it, or an overlay requires it.

This keeps the first setup useful without creating an oversized empty document system.

### 1. Product Development

Delivery mode: ship a product, feature, platform, app, SaaS, website, or productized workflow.

Use when the main risk is unclear product scope, missing requirements, design readiness, roadmap drift, or weak feedback capture.

Profile document system:

```text
docs/
├── prd/
│   └── main.md              Required
├── tech-design/
│   └── main.md              Recommended
├── roadmap/                 Recommended
├── releases/                Recommended
├── design-system/
│   └── main.md              Optional, when UX or UI consistency is central
├── user-research/           Optional, when user interviews or research matter
└── feedback/                Optional, when real user feedback is tracked
```

Status focus:

- Current product focus
- PRD readiness
- Design readiness
- Engineering readiness
- Open product decisions
- Next best product step

End-session checks:

- Requirement changes
- UX decisions
- Tech design changes
- Feedback captured
- Roadmap or release implications

Recommended version style: Codename or Semantic.

### 2. Engineering / Infrastructure

Delivery mode: ship a technical system, library, SDK, CLI, backend service, infrastructure component, or internal engineering platform.

Use when the main risk is architecture drift, unclear API contracts, weak tests, compatibility issues, or operational fragility.

Profile document system:

```text
docs/
├── architecture/
│   └── main.md              Required
├── testing/                 Recommended
├── releases/                Recommended
├── api/                     Optional, for SDKs, services, CLIs, and public contracts
├── adr/                     Optional, when architecture decisions accumulate
├── compatibility/           Optional, when versions or breaking changes matter
└── runbooks/                Optional, when deployment, operations, or support matter
```

Status focus:

- Current technical focus
- Architecture decisions
- API or CLI contract changes
- Test coverage risks
- Compatibility risks
- Next best implementation step

End-session checks:

- Architecture changes
- API/CLI contract changes
- ADR updates
- Test strategy changes
- Compatibility or breaking-change risks

Recommended version style: Semantic.

### 3. Research / Knowledge

Delivery mode: produce research conclusions, analysis, reports, evidence maps, or a structured knowledge base.

Use when the main risk is weak evidence, unclear hypotheses, untracked sources, or conclusions that cannot be traced back to supporting material.

Profile document system:

```text
docs/
├── research-plan/
│   └── main.md              Required
├── findings/                Required
├── sources/                 Recommended
├── notes/                   Recommended
├── hypotheses/              Optional, when hypothesis tracking is useful
└── reports/                 Optional, when formal output reports are needed
```

Status focus:

- Research question
- Current hypothesis
- Evidence gathered
- Key findings
- Open questions
- Next best investigation

End-session checks:

- New sources
- Hypothesis changes
- Findings
- Evidence quality
- Unanswered questions

Recommended version style: Date.

### 4. Operations / Growth

Delivery mode: produce an operational outcome, campaign, growth experiment, metric movement, sales/marketing workflow, or recurring execution system.

Use when the main risk is unclear audience/channel focus, missing assets, untracked metrics, or experiments without retrospectives.

Profile document system:

```text
docs/
├── campaign-plan/
│   └── main.md              Required
├── metrics/                 Recommended
├── experiments/             Recommended
├── audience/                Optional, when segmentation matters
├── channels/                Optional, when multi-channel execution matters
├── assets/                  Optional, when creative or sales assets are tracked
└── retrospectives/          Optional, when experiment or campaign review matters
```

Status focus:

- Current campaign or workflow
- Audience/channel focus
- Assets needed
- Metrics
- Active experiments
- Next operational step

End-session checks:

- Campaign changes
- Audience/channel decisions
- Asset updates
- Metric updates
- Experiment results
- Retrospective items

Recommended version style: Date or Patch.

### 5. Content / Creative

Delivery mode: produce creative or content output such as videos, articles, courses, podcasts, scripts, brand assets, game narrative, or visual work.

Use when the main risk is unclear creative direction, draft sprawl, missing assets, untracked revisions, or weak publishing readiness.

Profile document system:

```text
docs/
├── creative-brief/
│   └── main.md              Required
├── revisions/               Recommended
├── publishing/              Recommended
├── scripts/                 Optional, for scripted output
├── outlines/                Optional, for structured long-form output
├── assets/                  Optional, when media or brand assets are tracked
└── references/              Optional, when inspiration or source material matters
```

Status focus:

- Current creative direction
- Draft state
- Assets needed
- Revision notes
- Publishing state
- Next best creative step

End-session checks:

- Creative direction changes
- Draft changes
- Asset updates
- Reference additions
- Revision notes
- Publishing implications

Recommended version style: Patch.

### 6. Business / Client Delivery

Delivery mode: deliver business or client-facing outcomes such as consulting work, proposals, reports, outsourced deliverables, stakeholder decisions, or internal management artifacts.

Use when the main risk is unclear scope, stakeholder misalignment, missing approvals, untracked meetings, or delivery risks.

Profile document system:

```text
docs/
├── brief/
│   └── main.md              Required
├── deliverables/            Required
├── scope/                   Recommended
├── decisions/               Recommended
├── stakeholders/            Optional, when multiple external parties are involved
├── meetings/                Optional, when meeting history matters
└── reports/                 Optional, when formal client or business reports are produced
```

Status focus:

- Current engagement focus
- Stakeholders
- Scope and deliverables
- Open decisions
- Risks/blockers
- Next delivery step

End-session checks:

- Scope changes
- Stakeholder updates
- Meeting notes
- Delivery risks
- Decisions
- Report updates

Recommended version style: Codename or Date.

### 7. Custom

Delivery mode: user-defined.

Use when the project does not fit the standard delivery modes or already has a strong management system that Project Butler should respect.

Profile document system:

```text
docs/
├── notes/                   Required by default, unless the user replaces it
├── decisions/               Recommended
├── outputs/                 Recommended
└── references/              Optional
```

Status focus and end-session checks should be user-defined.

Custom should not be an empty fallback. It should have a lightweight builder:

```text
What should Project Butler track?
- documents
- decisions
- tasks
- deliverables
- experiments
- stakeholders
- metrics
- releases

What document areas do you want?
- user-defined list
```

The result should still follow the same Profile Output Contract: document tiers, doc sections, status focus, end-session checks, maintenance preference, close modes, and confidence notes.

## Overlays

Overlays are complexity modules. They add specialized document sections, status focus, and end-session checks to the generated project shape.

An overlay should be enabled only when it materially changes what the assistant must remember, inspect, or ask the user to review. It should not be enabled just because a keyword appears in the project description.

### AI / Agent / RAG

Enable when the project has AI-specific state that must be tracked across sessions: prompts, evals, datasets, model/provider changes, RAG indexes, agent tools, tool-calling behavior, or failure cases.

Adds:

```text
docs/
├── ai-architecture/
│   └── main.md
├── prompts/
├── evals/
├── datasets/
├── agent-tools/
├── model-notes/
└── failure-cases/
```

Status additions:

- Current AI/agent/RAG focus
- Prompt/model changes
- Eval coverage
- Dataset/index state
- Tool-calling risks
- Failure cases
- Reproducibility risks

End-session additions:

- Prompt changes
- Eval results
- Model/provider changes
- Dataset/index changes
- Agent tool changes
- Failure cases discovered

### Data / Analytics

Enable when data sources, metrics, dashboards, pipelines, or data quality are central to project success.

Adds:

```text
docs/
├── data-sources/
├── metrics/
├── dashboards/
├── pipelines/
└── data-quality/
```

Focus:

- Data source freshness
- Metric definitions
- Pipeline state
- Dashboard changes
- Data quality risks

### Research-heavy

Enable when a non-research-shaped project still depends heavily on sources, evidence, findings, or open research questions.

Adds stronger research tracking:

```text
docs/
├── research-notes/
├── sources/
├── findings/
└── open-questions/
```

Focus:

- Evidence quality
- Open questions
- Research conclusions affecting product or engineering decisions

### Design-heavy

Enable when UX flows, design-system decisions, usability issues, or visual consistency are central risks.

Adds:

```text
docs/
├── design-system/
├── ux-flows/
├── visual-decisions/
└── usability-notes/
```

Focus:

- UX flow readiness
- Design system decisions
- Usability issues
- Visual consistency risks

### Security / Compliance

Enable when sensitive data, privacy, compliance, permission boundaries, or auditability materially affect the project.

Adds:

```text
docs/
├── threat-model/
├── security-decisions/
├── compliance/
├── privacy/
└── audits/
```

Focus:

- Sensitive data handling
- Permission boundaries
- Compliance requirements
- Security decisions
- Audit trail

### Multi-tool / Multi-agent

Enable when multiple AI assistants, tools, or agent roles need coordinated handoff and shared context.

Adds:

```text
docs/
├── tool-handoff/
├── agent-roles/
├── shared-context/
└── workflow-rules/
```

Focus:

- Which assistant owns which work
- Cross-tool handoff quality
- Shared context readiness
- Agent coordination risks

### Client-facing

Enable when external stakeholders, client approvals, delivery commitments, or client-facing updates are central to the work.

Adds:

```text
docs/
├── client-updates/
├── approvals/
├── stakeholder-feedback/
└── delivery-notes/
```

Focus:

- Client approvals
- Stakeholder feedback
- Delivery commitments
- External communication risks

## Composition Rules

When generating a project-specific profile from the user's description:

1. Start with the smallest document set that can support the inferred project shape.
2. Recommend at most 2 overlays by default.
3. If more than 2 overlays seem relevant, ask the user whether the extra complexity is really needed.
4. Add overlay directories only when they add a distinct management need.
5. Deduplicate overlapping directories, preferring stable project-butler vocabulary unless the project needs a more specific name.
6. Keep the recommended setup editable by the user.
7. Avoid creating every possible directory by default; recommend a focused set.
8. Prefer fewer directories with stronger status/end-session checks over many directories with weak usage.
9. Pre-select Recommended documents, but let the user remove them before setup.
10. Create Optional documents only when the user selects them, evidence supports them, or an overlay requires them.

Example:

```text
Generated Project Shape:
- AI agent SaaS MVP

Signals borrowed from:
- Product Development
- AI / Agent / RAG
- Research-heavy

Overlays:
- AI / Agent / RAG
- Research-heavy

Recommended document system:
Required:
- prd/

Recommended:
- tech-design/
- roadmap/
- releases/

Optional:
- design-system/
- user-research/
- feedback/

Overlay additions:
- ai-architecture/
- prompts/
- evals/
- datasets/
- agent-tools/
- failure-cases/
- findings/
```

## Profile Output Contract

Every resolved profile should produce the same kinds of outputs, even if the exact content differs by generated project shape and overlays.

```text
Resolved Profile
├── generated_project_shape
├── reference_archetypes_used
├── overlays
├── default_maintenance_preference
├── close_modes
├── required_directories
├── recommended_directories
├── optional_directories
├── recommended_doc_sections
├── status_focus
├── end_session_checks
├── update_depth_rules
├── version_style_recommendation
└── confidence_notes
```

The module should not only create document directories. It should shape how Project Butler thinks about project state:

- `DOCS.md` sections and `docs/` directories come from the resolved Required / Recommended / Optional document system.
- `status` uses profile-specific focus areas.
- `end session` first scans profile impact, then lets the user choose a close mode when meaningful.
- `UPDATE_LOG.md` uses the profile's version style recommendation as the default, still user-editable.
- `review` / rule candidates can include profile-specific recurring decisions.

## Profile Maintenance Model

Profile management must not assume every user wants high-cost, high-consistency document maintenance on every `end session`.

The profile system should support two related controls:

```text
Profile = Generated Project Shape + Overlays + Document Tiers + Default Maintenance Preference + Per-Session Close Mode
```

The default maintenance preference controls what Project Butler recommends by default. The per-session close mode controls what happens during the current `end session`.

### Default Maintenance Preference

The user can choose a default preference during setup and change it later.

#### Lite

For fast development, low token cost, and low interruption. Prefer Normal Close by default.

Use when:

- The user is exploring quickly.
- The project is early or disposable.
- The user wants memory continuity more than document consistency.

#### Standard

Recommended default for most projects. Run an impact scan, then offer Normal Close or Full Close when profile-impacting changes are detected.

Use when:

- The project is serious enough to maintain alignment.
- The user wants reminders without paying for deep consistency every time.
- The assistant should help prevent profile docs from drifting too far.

#### Deep

For high-consistency projects where token cost is acceptable. Prefer Full Close when important profile-impacting changes are detected.

Use when:

- The user is preparing a release, review, handoff, or serious milestone.
- The project needs strong document consistency.
- The user explicitly accepts higher token cost.

### Per-Session Close Modes

When the user says `end session` / `收工`, Project Butler should first capture facts and scan profile impact. If meaningful profile-impacting changes are found, show the user two choices:

```text
Profile impact detected:
- PRD: webpage analysis changed product scope.
- AI Architecture: webpage analyzer tool was added.
- Evals: new quality cases are likely needed.
- Design System: result/loading/error states may be affected.

Choose close mode:
1. Normal Close — save session, update handoff/TODO, preserve profile updates as pending.
2. Full Close — read affected profile docs and align project memory now.
```

If no meaningful profile-impacting changes are found, Project Butler can proceed with Normal Close without asking.

#### Normal Close

Normal Close is the low-friction daily path.

Behavior:

- Write session log.
- Update handoff.
- Update TODO.
- Update PROJECT.md and UPDATE_LOG.md when normal end-session rules require it.
- Capture pending profile updates with evidence.
- Do not proactively patch PRD, Design System, AI Architecture, Architecture, Roadmap, or other long-lived profile docs.
- Do not run deep consistency checks.

Typical output:

```text
Session saved.

Pending profile updates:
- PRD may need webpage analysis requirement. Evidence: user requested URL analysis.
- Evals may need new quality cases. Evidence: new AI capability added.

Run Full Close later if you want project docs aligned now.
```

#### Full Close

Full Close is the consistency path.

Behavior:

- Run the Normal Close baseline.
- Read only affected profile documents, not every document.
- Check whether affected PRD, Design System, Architecture, AI docs, Roadmap, Evals, or other profile docs are stale.
- Apply patch-level updates when evidence is clear.
- Ask before section rewrites.
- Never rewrite full documents automatically; propose document refreshes only.
- Produce a profile consistency summary.

Typical output:

```text
Full Close completed.

Updated:
- PRD requirements section
- AI Architecture tool-calling section
- Failure Cases log

Suggested rewrite:
- Design System result states are stale and need a section refresh.

Skipped:
- Roadmap, no release impact detected.
```

### Close Mode Safety Rules

- Patch-level updates may be applied during Full Close when evidence is clear.
- Section rewrites require explicit user confirmation.
- Full document rewrites are never automatic.
- Normal Close records pending profile updates instead of applying long-lived document patches.
- Full Close reads only affected profile documents.
- The user can override the default preference with commands such as `end session normal`, `end session full`, `正常收工`, or `全量收工`.

### Pending Updates

Pending profile updates should not all become TODO items.

- Use `session-handoff.md` for context debt and next-session pickup.
- Use `TODO.md` only when the pending update is a concrete task.
- Avoid adding a new review queue file in the first implementation.

## End Session Quality Controls

Profile-aware `end session` should not mean "read every document and rewrite everything." It should first analyze the session impact, then let the user choose whether this close is normal or full when meaningful profile changes are detected.

```text
1. Capture session facts.
2. Triage affected profile areas.
3. Produce a profile impact report.
4. Ask for close mode when needed: Normal Close or Full Close.
5. Apply close-mode-specific updates.
6. Defer unresolved items.
7. Summarize what was updated, pending, skipped, and why.
```

### Capture

Capture what actually happened in the session:

- user-requested changes,
- implementation changes,
- files touched,
- TODO changes,
- decisions made,
- failures discovered,
- docs created or modified.

### Triage

Use the resolved profile to classify affected areas.

For an AI Agent SaaS profile:

```text
Primary: Product Development
Overlays:
- AI / Agent / RAG
- Design-heavy
```

Possible affected areas:

- PRD
- Roadmap
- Releases
- Design System
- UX Flows
- Tech Design
- AI Architecture
- Prompts
- Evals
- Agent Tools
- Failure Cases

### Profile Impact Report

Before changing profile documents, Project Butler should produce an internal impact report. The report may be summarized to the user, but every suggested or applied update should trace back to it.

```text
Profile Impact:
- Area: PRD
  Impact: product scope changed
  Evidence: user requested webpage analysis
  Confidence: high
  Normal Close action: preserve as pending profile update
  Full Close action: patch PRD requirements if evidence is still valid after reading PRD

- Area: Evals
  Impact: new benchmark likely needed
  Evidence: new AI capability added
  Confidence: medium
  Normal Close action: add concrete TODO if behavior is defined
  Full Close action: inspect eval docs and add/update eval notes
```

### Evidence Requirement

Every suggested or applied profile update should include evidence. Without evidence, Project Butler should not patch profile documents.

Example:

```text
PRD update suggested because:
- User requested a new webpage analysis capability.
- This changes user-facing product scope.
```

Example:

```text
AI Architecture update suggested because:
- The agent gained a new webpage analyzer tool.
- Tool input/output and failure behavior changed.
```

### Close Mode Prompt

If profile-impacting changes are detected and the user did not already specify `normal` or `full`, Project Butler should ask:

```text
本次可能影响：
- PRD：新增网页分析能力，影响产品范围
- AI Architecture：新增 webpage analyzer tool
- Evals：可能需要新增质量评测
- Design System：可能需要 loading/error/result states

请选择收工方式：
1. 正常收工：保存日志、handoff、TODO，把长期文档更新放入 pending
2. 全量收工：读取受影响文档并立即对齐项目资料
```

The prompt should be skipped when:

- the user explicitly says `正常收工`, `normal close`, `end session normal`, or equivalent,
- the user explicitly says `全量收工`, `full close`, `end session full`, or equivalent,
- no meaningful profile-impacting changes are detected.

### Close-Mode-Specific Sync

The same session should produce different behavior depending on close mode.

Normal Close:

```text
Capture + triage + pending updates only.
```

Full Close:

```text
Triage + affected document reads + consistency check + patch/section rewrite proposals.
```

### Pending Updates

If the user does not want to handle profile updates now, Project Butler should not force them. It should preserve the work as pending updates.

Default locations:

- `session-handoff.md` for context debt and next-session pickup,
- `TODO.md` only for concrete execution tasks.

Avoid adding a new review queue file in the first implementation.

Example pending TODOs:

```markdown
- [ ] Update PRD for webpage analysis feature
  Owner: Human | Deadline: TBD | Dependencies: feature scope confirmation

- [ ] Add eval cases for webpage analysis quality
  Owner: AI | Deadline: TBD | Dependencies: tool behavior finalized
```

### Quality Summary

End session should summarize profile sync quality:

```text
Profile Sync:
- Close Mode: Normal
- Updated: handoff, TODO, session log
- Pending: PRD, Design System, Evals
- Skipped by mode: AI Architecture deep patch
```

For Full Close:

```text
Profile Sync:
- Close Mode: Full
- Updated: PRD, AI Architecture, Failure Cases
- Pending: Evals
- Skipped: Roadmap, Releases
- Rewrite proposal: Design System result states
```

## Profile Update Depth

Low-friction updates should be the default, but major changes must still be handled when needed.

The update depth has three levels:

Normal Close records these as pending updates. Full Close may apply patch-level updates and may propose section or document rewrites under the safety rules above.

### 1. Append / Patch

Default for normal changes.

Use for:

- new feature notes,
- requirement additions,
- prompt changes,
- failure cases,
- eval TODOs,
- small architecture notes.

Example PRD patch:

```markdown
Change Log / 2026-06-04 — Webpage Analysis Agent

- Added agent capability to analyze webpage content.
- User-facing requirement: user can submit a URL and receive structured insights.
- Open question: should analysis run synchronously or in background?
```

### 2. Section Rewrite

Use when a section has become stale or has accumulated several patches.

Examples:

- PRD `Requirements` no longer matches active implementation.
- AI Architecture `Agent Tools` section needs consolidation.
- Design System interaction states need a structured refresh.

Section rewrite should be proposed, not silently applied.

Example:

```text
Section rewrite suggested.

Document: AI Architecture
Section: Agent Tools
Reason:
- 3 tool changes accumulated across recent sessions.
- Current section no longer describes the active tool contract.

Proceed?
```

### 3. Document Rewrite / Refactor Proposal

Use only for major direction changes.

Triggers:

- user explicitly says the direction changed,
- product scope changed substantially,
- architecture moved to a different model,
- implementation clearly exceeds or contradicts PRD/Architecture,
- the same document is repeatedly marked stale,
- several pending updates affect the same core assumptions.

Document rewrite should never happen automatically.

Example:

```text
Major document refresh suggested.

Reason:
- PRD scope changed in 4 areas.
- Current PRD no longer matches implementation direction.
- Multiple pending patches affect the same section.

Suggested action:
- Rewrite PRD sections: Problem, Core Workflows, Requirements, Open Questions.

Proceed?
```

## Initialization Flow Proposal

Replace the current document-type-first setup with a conversational profile builder. The user-facing language should avoid taxonomy jargon and should not force the user to choose from fixed project types.

### Step 1: Open Intake

Ask one low-pressure question:

```text
What are you trying to do with this project?
You can describe it casually. No format needed.

Example:
"I want to build an AI agent that analyzes webpages and gives marketing recommendations. It is an early MVP."
```

The assistant should infer the project shape from the user's answer instead of asking the user to name a profile.

### Step 2: AI Summary

Project Butler should summarize its understanding before asking more questions:

```text
My understanding:
- You are building an AI agent product / SaaS.
- Current stage: early MVP.
- Main outputs: runnable product, agent behavior, prompts/evals, failure cases, and later release notes.
- Likely memory needs: product scope, AI architecture, eval coverage, tool behavior, and next release steps.
```

### Step 3: Adaptive Clarification

Ask only the missing high-value questions. Prefer 2-4 targeted questions, not a long form.

For an AI Agent project, examples:

```text
I need to confirm a few things:

1. Is this for real users, an internal tool, or a research prototype?
2. Do you expect prompts / agent tools / evals to change often?
3. Do we need to track user feedback, customer delivery, compliance, or design states?
4. Should Project Butler optimize for fast saves or stronger document consistency?
```

For an SDK or engineering project, ask about API contracts, testing, compatibility, release process, and operational runbooks.

For a client delivery project, ask about stakeholders, scope, approvals, meetings, and deliverables.

For a research project, ask about sources, hypotheses, evidence quality, reports, and reproducibility.

Project Butler may internally use these reference signals:

```text
Reference archetypes:
- Product Development
- Engineering / Infrastructure
- Research / Knowledge
- Operations / Growth
- Content / Creative
- Business / Client Delivery
- Custom

Complexity overlays:
- AI / Agent / RAG
- Data / Analytics
- Design-heavy
- Research-heavy
- Security / Compliance
- Client-facing
- Multi-tool / Multi-agent
- None
```

Ask the default maintenance preference as a simple cost/quality choice:

```text
Default maintenance preference?
- Lite: prefer fast normal closes, minimal document sync, low token cost
- Standard: recommended, scan impact and ask normal vs full when profile docs are affected
- Deep: prefer full close for important profile-impacting changes, higher token cost
```

### Step 4: Profile Proposal

Then Project Butler proposes a project-specific setup:

```text
Generated Project Shape:
- AI agent SaaS MVP

Reference signals:
- Product Development (high)
- AI / Agent / RAG (high)
- Design-heavy (optional, medium)

Overlays:
- AI / Agent / RAG

Management risks:
- product scope drift
- prompt/eval drift
- agent tool behavior drift
- failure cases getting lost

Default Maintenance Preference: Standard

Recommended document system:
Required:
- prd/
- ai-architecture/
- evals/

Recommended:
- tech-design/
- roadmap/
- failure-cases/
- releases/

Optional:
- design-system/
- user-research/
- feedback/
- datasets/

Use this setup? You can add or remove sections before files are created.
```

The initialization flow should make cost/quality tradeoffs explicit:

```text
Lite preference is best if you want fast development and simple continuity.
Standard preference is best for most projects.
Deep preference is best when project-document consistency matters and you accept higher token usage.

During end session, Project Butler can still ask:
- Normal Close: save now, preserve profile updates as pending.
- Full Close: align affected project docs now.
```

The selected maintenance preference should remain changeable later. The user can also override close mode per session.

Supported future user intents:

```text
switch profile maintenance to lite
switch profile maintenance to standard
switch profile maintenance to deep
end session normal
end session full
正常收工
全量收工
full profile sync
```

These are proposal-level intents only; they should not be implemented until the product design is accepted.

## Profile Evidence

Profile recommendations should be explainable. Project Butler should show why it recommends a generated project shape, document tier, or overlay.

Evidence sources can include:

- user description from initialization,
- existing file names,
- existing document names,
- TODO items,
- session logs or handoff notes,
- package/dependency hints if available,
- recurring words in recent work such as PRD, roadmap, prompt, eval, API, campaign, stakeholder, or release.

Example evidence for Product Development:

```text
Evidence:
- User described the project as an AI assistant SaaS.
- Existing notes mention onboarding, roadmap, and user feedback.
- TODOs include feature scope and release planning.
```

Example evidence for AI / Agent / RAG overlay:

```text
Evidence:
- TODOs mention prompt evals and agent tools.
- Existing files mention RAG and model behavior.
- Recent work discussed failure cases and tool calling.
```

Evidence should be used to support recommendations, not to silently decide for the user.

If evidence is weak:

- do not auto-enable low-confidence overlays,
- ask the user to choose,
- or list the overlay as optional.

## Profile Confidence

Project Butler should not pretend profile generation is always correct. It should show a confidence label whenever it recommends a generated project shape, document tier, or overlay.

Suggested labels:

- High: project description directly matches the delivery mode or complexity module.
- Medium: project description implies the profile but could reasonably fit another one.
- Low: profile is a weak guess and should be presented as a question, not a recommendation.

If primary confidence is low, Project Butler should ask the user to choose directly. If overlay confidence is low, omit the overlay from the default recommendation and list it as optional.

## Example Profiles

### AI Agent SaaS

```text
Primary: Product Development
Overlays:
- AI / Agent / RAG
- Design-heavy, only if UX/design-system complexity is central
```

Needs PRD, design system, user feedback, roadmap, AI architecture, prompts, evals, agent tools, and failure cases.

Example work session:

```text
User keeps extending the agent:
"Add webpage analysis so the agent can inspect a URL and generate recommendations."
```

Profile impact triage:

```text
Affected areas:
- PRD: new user-facing capability
- Design System: result/loading/error states
- AI Architecture: new webpage analyzer tool
- Prompts: possible instruction change
- Evals: new quality benchmark needed
- Failure Cases: timeout / inaccessible page / bad analysis
```

Close mode prompt:

```text
Profile impact detected:
- PRD: new user-facing capability
- Design System: result/loading/error states
- AI Architecture: new webpage analyzer tool
- Evals: new quality benchmark needed
- Failure Cases: timeout / inaccessible page / bad analysis

Choose close mode:
1. Normal Close — save session and preserve profile updates as pending.
2. Full Close — read affected profile docs and align them now.
```

Normal Close:

```text
Session saved.

Pending profile updates:
- PRD may need webpage analysis requirement.
- Evals may need new quality cases.
- Design System may need result/error states.
```

Full Close:

```text
Full Close completed.

Updated:
- Handoff
- TODO
- PRD requirements section
- AI Architecture tool-calling section
- Failure Cases log

Suggested rewrite:
- Design System result states are stale and need a section refresh.

Pending:
- Evals: add quality benchmark cases after tool behavior is finalized.
```

This is the intended product behavior: Project Butler should not interrupt feature exploration, but it should prevent profile memory from silently falling behind.

### RAG SDK

```text
Primary: Engineering / Infrastructure
Overlays:
- AI / Agent / RAG
- Data / Analytics
```

Needs architecture, API docs, ADRs, testing, compatibility, datasets, evals, model notes, and data-quality tracking.

### Model Evaluation Research

```text
Primary: Research / Knowledge
Overlays:
- AI / Agent / RAG
```

Needs research plan, sources, hypotheses, findings, datasets, evals, model notes, and failure cases.

## Non-Goals For First Implementation

- Do not create separate project-butler sub-products.
- Do not make every profile a hard-coded workflow.
- Do not force a single project type when the project is mixed.
- Do not create excessive directories without user confirmation.
- Do not replace the existing document archiving system; profiles should feed it better defaults.
- Do not treat overlays as a checklist where more is better.
- Do not auto-enable low-confidence overlays.
- Do not build a full intelligent project-management engine in the first version.
- Do not run Full Close by default without either user intent or a close-mode prompt.
- Do not rewrite PRD, Architecture, Design System, or other long-lived docs without explicit confirmation.
- Do not create every Recommended or Optional document directory without user confirmation.

## Scope Priority

The profile system should remain skill-sized. It should not become a full SaaS project management platform.

### P0: Required For First Design

- Conversational Profile Builder model.
- Reference archetypes as internal guidance, not user-facing fixed choices.
- Maximum 2 default overlays.
- Profile Evidence.
- Profile Confidence.
- Minimalism rule.
- Profile Output Contract.
- Required / Recommended / Optional document tiers for each generated profile.
- Default Maintenance Preference: Lite / Standard / Deep.
- Per-session Close Mode: Normal Close / Full Close.
- Profile Update Depth: Patch / Section Rewrite / Document Rewrite Proposal.
- End Session Quality Controls.

### P1: Lightweight First-Version Additions

- Custom Profile Builder, simplified.
- Profile never changes automatically.
- User can switch maintenance preference later.
- Single-session close-mode override such as `end session normal`, `end session full`, `正常收工`, or `全量收工`.
- Future hooks for review queue, risk flags, and profile evolution.

### P2: Future Ideas Only

- Profile-specific risk flags.
- Unified review queue integration.
- Profile evolution / drift detection.
- Profile-specific next-step logic.
- Deep dependency/package signal scanning.
- Automated stale-document scoring.

P2 items may be valuable, but they should not drive the first version because they increase judgment complexity, token cost, and the risk of false positives.

## Open Questions

1. Should overlays be single-select or multi-select? Current recommendation: multi-select.
2. Should Project Butler generate the profile from a free-form project description? Current recommendation: yes, summarize understanding and ask targeted follow-up questions before proposing files.
3. Should profile configuration be stored in `CLAUDE.md`, `PROJECT.md`, or a separate metadata block? Current recommendation: start in generated project rules / `CLAUDE.md`; avoid adding a new file unless needed.
4. Should status output become profile-specific immediately? Current recommendation: yes for product-level design, but implementation can phase it in.
5. Should document type names be localized or stable English directory names? Current recommendation: stable English directory names, localized display names.
6. Should more than 2 overlays ever be recommended by default? Current recommendation: no; ask for explicit user confirmation.
7. Should maintenance preference default to Standard? Current recommendation: yes.
8. Where should pending profile updates be stored? Current recommendation: start with `session-handoff.md` and `TODO.md`; avoid a new review queue file until the design is accepted.
9. Should Full Close be offered every time? Current recommendation: no; offer it only when profile-impacting changes are detected or the user explicitly asks.
10. Should Recommended documents be pre-selected by default? Current recommendation: yes, but users can remove them before setup.

## Recommended First Slice

This is a future implementation slice after the product design has been reviewed and accepted.

First implementation should support:

1. Open natural-language project intake.
2. AI summary of inferred project shape.
3. Adaptive clarification questions.
4. Required / Recommended / Optional document proposal.
5. Default Maintenance Preference selection.
6. User confirmation and editing of recommended sections.
7. Normal Close / Full Close end-session triage design.
8. AI agent SaaS as the first high-value generated profile example.

This keeps the module useful without turning it into a large taxonomy project.
