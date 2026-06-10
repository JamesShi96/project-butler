# Project Profile System PRD

Status: Draft
Last updated: 2026-06-08
Parent PRD: [../main.md](../main.md)
Source proposal: [../../project-profiles-module-plan.md](../../project-profiles-module-plan.md)

## Product Definition

Project Profile System lets Project Butler generate and maintain a project-specific memory structure from the user's natural description of the project.

It replaces fixed project-type selection with a conversational profile builder:

```text
Free-form project description
→ AI summarizes project shape
→ AI asks targeted follow-up questions
→ AI proposes Required / Recommended / Optional document structure
→ User confirms or edits before files are created
```

## User Problem

Users often know what they are building, but they do not know which project-management template they need.

If Project Butler asks users to choose between fixed categories like Product, Engineering, Research, Operations, or Client Delivery, users may pick poorly or overfit their project to the available categories.

The deeper problem is that AI-assisted projects need stable reference points. Without a PRD, architecture document, roadmap, eval plan, research plan, or equivalent baseline, AI agents tend to solve the immediate request while drifting away from the larger project.

## User Outcome

The user describes the project in normal language. Project Butler turns that into:

- a generated project shape,
- a small Required document set,
- removable Recommended documents,
- non-created Optional documents,
- a machine-readable project profile,
- profile-aware `status`,
- profile-aware `end session`,
- and a bounded Full Close / Foundation Repair path when project reference docs drift or are missing.

## Confirmed Product Decisions

These decisions are confirmed by the 2026-06-08 three-stage simulation review.

1. **Initialization is Foundation Setup, not Full Close.**
   New projects need baseline reference docs, not a document-alignment pass.

2. **Required directories are capped at 3-4 by default.**
   Recommended directories are capped at 5-6 by default.

3. **Machine-readable profile state is split by lifecycle.**
   `.claude/project-profile.json` is the stable profile configuration. `.claude/profile-pending.json` is the dynamic pending queue.

4. **Pending profile updates have a lifecycle.**
   Repeated pending items become profile debt.

5. **`seen_count >= 3` escalates a pending item to profile debt.**
   Profile debt should surface in `status` and `end session`.

6. **Core `main.md` docs are stable baseline + index.**
   Detailed feature, module, initiative, case, and decision changes should move to sub-docs.

7. **Full Close update priority is `Append > Branch > Patch > Rewrite`.**
   Branching into sub-docs is preferred over expanding or rewriting stable main docs.

8. **Large-project Full Close requires a Scope Plan.**
   The plan must list files Project Butler will read, files it may change, and files it will not touch.

9. **Document policy metadata is canonical in `.claude/project-profile.json`.**
   Markdown front matter is optional and human-facing. If JSON and Markdown disagree, `project-profile.json` wins.

10. **Full Close may auto-apply safe patch-level updates.**
   Auto-apply is allowed only when the file is in scope, the section is unprotected, policy allows the update, evidence is clear, and the change is append/branch/active-section patch only.

11. **Document policy changes require confirmation.**
   Changes to status, owner, update policy, protected sections, or document role affect future permissions and must not happen silently.

12. **Full Close confirms boundaries, not every safe edit.**
   The user should approve the Scope Plan and high-risk changes, then Project Butler should batch safe updates inside that boundary without repeated prompts.

13. **Review queue escalation is profile debt, not ordinary TODO.**
   Repeated or decision-heavy pending items should be escalated when they indicate unresolved product, architecture, roadmap, or operating-model decisions.

14. **Stale-document detection must be evidence-based.**
   Project Butler should flag stale docs only when project reality conflicts with documented reality, and it must cite the evidence.

## Core Concepts

### Conversational Profile Builder

Project Butler should ask one low-pressure first question:

```text
What are you trying to do with this project?
You can describe it casually. No format needed.
```

Then it summarizes understanding and asks only 2-4 targeted follow-up questions.

Users should not need to learn Project Butler's taxonomy.

### Reference Archetypes

The following are internal references, not user-facing choices:

- Product Development
- Engineering / Infrastructure
- Research / Knowledge
- Operations / Growth
- Content / Creative
- Business / Client Delivery
- Custom

Project Butler can borrow from these archetypes but should generate a project-specific structure.

### Overlays

Overlays add complexity dimensions:

- AI / Agent / RAG
- Data / Analytics
- Design-heavy
- Research-heavy
- Security / Compliance
- Client-facing
- Multi-tool / Multi-agent

AI / Agent / RAG is not a mutually exclusive project type. It can attach to product, engineering, research, delivery, or other project shapes.

### Document Tiers

Every generated profile separates documents into:

- **Required**: created by default because the project lacks a core reference without it.
- **Recommended**: pre-selected by default but removable before setup.
- **Optional**: shown but not created unless selected, evidence-supported, or required by an overlay.

Guardrails:

- Required directories should usually be limited to 3-4.
- Recommended directories should usually be limited to 5-6.
- Optional directories can be listed but are not created by default.
- Every Required or Recommended directory needs evidence or rationale.
- User confirmation is required before files are created.

## Stable Directory Vocabulary

Project Butler should use a stable vocabulary first:

```text
prd/
tech-design/
architecture/
api/
testing/
roadmap/
releases/
ai-architecture/
prompts/
evals/
datasets/
agent-tools/
failure-cases/
research/
sources/
findings/
feedback/
design-system/
compliance/
stakeholders/
deliverables/
```

If the vocabulary does not cover the project, Project Butler may propose a custom directory only with user confirmation:

```json
{
  "directory": "grant-applications",
  "reason": "This project produces funding application packages.",
  "maps_to": "deliverables",
  "created_by_user_confirmation": true
}
```

The vocabulary is not a closed taxonomy. It is a stability layer that prevents AI from inventing different names for the same concept across sessions.

## Machine-Readable Profile State

Profile System uses two machine-readable files:

```text
.claude/project-profile.json      # stable profile configuration
.claude/profile-pending.json      # dynamic pending queue
```

Human-readable summaries can live in `PROJECT.md`. Document metadata lives in `DOCS.md`.

### `.claude/project-profile.json`

`project-profile.json` stores the stable project profile configuration.

```json
{
  "schema_version": "1.0",
  "updated_at": "2026-06-08",
  "generated_project_shape": {
    "label": "AI agent SaaS MVP",
    "confidence": "high",
    "summary": "A product MVP with AI agent behavior, evals, and product-scope drift risk."
  },
  "reference_archetypes_used": [
    {
      "name": "product-development",
      "confidence": "high",
      "evidence": ["User described a SaaS product for real users."]
    }
  ],
  "overlays": [
    {
      "name": "ai-agent-rag",
      "confidence": "high",
      "evidence": ["Project includes agent tools, prompts, evals, and failure cases."]
    }
  ],
  "maintenance": {
    "preference": "standard",
    "normal_close": "save_and_defer_profile_updates",
    "full_close": "sync_affected_profile_docs"
  },
  "foundation_areas": [
    {
      "id": "product_scope",
      "label": "Product Scope",
      "purpose": "Keep feature boundaries and user-facing behavior stable.",
      "docs": ["docs/prd/main.md"],
      "status": "active",
      "evidence": ["User described a SaaS product with user-facing workflows."]
    },
    {
      "id": "ai_quality_baseline",
      "label": "AI Quality Baseline",
      "purpose": "Track AI behavior expectations, evals, and failure cases.",
      "docs": ["docs/evals/main.md", "docs/failure-cases/main.md"],
      "status": "missing",
      "evidence": ["Project includes agent behavior but eval docs were not created yet."]
    }
  ],
  "directories": {
    "required": [
      {
        "path": "docs/prd/",
        "reason": "Product scope needs a stable reference."
      }
    ],
    "recommended": [
      {
        "path": "docs/roadmap/",
        "reason": "MVP scope and releases need planning."
      }
    ],
    "optional": [
      {
        "path": "docs/design-system/",
        "reason": "Useful if UX states become central."
      }
    ],
    "custom": []
  },
  "doc_policies": {
    "docs/prd/main.md": {
      "role": "stable_baseline_index",
      "owner": null,
      "status": "draft",
      "update_policy": "patch_active_sections_only",
      "protected_sections": ["Stable Baseline", "Confirmed Decisions"]
    }
  }
}
```

### `.claude/profile-pending.json`

`profile-pending.json` stores dynamic pending updates and profile debt.

```json
{
  "schema_version": "1.0",
  "updated_at": "2026-06-08",
  "items": []
}
```

Status values:

```text
pending
repeated
profile_debt
review_queue
resolved
dismissed
converted_to_todo
```

Recommended action values:

```text
append
branch
patch
rewrite_proposal
foundation_repair
review_decision
convert_to_todo
dismiss
```

## Close Modes

### Foundation Setup

Foundation Setup is the initialization path after Profile System has been enabled or confirmed.

It should:

- run conversational intake,
- summarize the generated project shape,
- ask up to 3 adaptive clarification questions,
- generate project-specific foundation areas,
- propose Required / Recommended / Optional directories,
- create `.claude/project-profile.json`,
- create `.claude/profile-pending.json`,
- create baseline drafts for confirmed Required documents,
- prefer open questions over pretending the project is fully specified.

Foundation Setup must not create a mature-looking project system from weak evidence. Baseline drafts should be honest about uncertainty.

### Normal Close

Normal Close is the daily path.

It should:

- write the session log,
- update `session-handoff.md`,
- update `TODO.md`,
- update normal Project Butler files when existing end-session rules require it,
- record profile-impacting changes in `.claude/profile-pending.json`,
- avoid deep reads of long-lived reference docs.

### Full Close

Full Close is the consistency path.

It should:

- complete the Normal Close baseline,
- identify affected profile areas,
- read only affected profile docs,
- apply safe patch-level updates when evidence is clear and policy allows it,
- create sub-docs when a feature/module/initiative is separable,
- ask before section rewrites,
- never rewrite stable baselines automatically,
- record unresolved gaps in handoff/TODO.

Full Close is not a whole-project cleanup pass. It is a bounded alignment pass for affected profile areas.

### Full Close Auto-Apply Rules

When the user selects Full Close, Project Butler may automatically apply patch-level updates only if all conditions are true:

1. The file is listed in the Scope Plan's `May change` section.
2. The target section is not protected.
3. The document `update_policy` allows the update.
4. The update has clear evidence from session facts, existing docs, or project-profile state.
5. The change is append, branch, or active-section patch only.

Auto-apply allowed:

- append to Change Log,
- append to Open Questions,
- update Feature / Module / Initiative indexes,
- create sub-doc drafts listed in the approved Scope Plan,
- patch Active Scope.

Confirmation required:

- Stable Baseline changes,
- Confirmed Decisions changes,
- Signed-off Scope changes,
- Locked Requirements changes,
- Accepted Architecture changes,
- documents with `owner_confirmation_required`,
- documents with `proposal_only`,
- section rewrites,
- document rewrites,
- document policy changes.

### Full Close Confirmation Model

Full Close should minimize confirmation prompts by separating boundary approval from high-risk decision approval.

Default flow:

```text
1. Capture session facts.
2. Identify affected profile areas.
3. Produce a Scope Plan.
4. Ask for one approval of the Scope Plan.
5. Auto-apply safe changes inside the approved boundary.
6. Present high-risk changes as grouped proposals.
7. Record unresolved proposals in the review queue or pending queue.
```

Confirmation levels:

```text
L0 read-only analysis              automatic
L1 low-risk append                 automatic
L2 low-risk active-section patch   automatic inside approved Scope Plan
L3 sub-doc creation                batch approval through Scope Plan
L4 semantic baseline/policy change explicit confirmation required
```

The user should not be asked to confirm every L1 or L2 edit. Confirmation should happen at the Scope Plan level unless the change crosses into L4.

L4 changes include:

- changing project direction,
- changing confirmed product or architecture decisions,
- changing protected sections,
- deleting or replacing existing document content,
- rewriting a whole section,
- changing document policy metadata,
- changing `.claude/project-profile.json` profile shape, overlays, or document permissions.

### Scoped Full Close

Large or mature projects must use Scoped Full Close.

Before reading or changing profile docs, Project Butler should present a scope plan:

```text
Full Close Scope Plan

Will read:
- docs/prd/features/webpage-analysis.md
- docs/ai-architecture/tools/webpage-analyzer.md
- docs/evals/cases/webpage-analysis-quality.md

May change:
- docs/prd/features/webpage-analysis.md
- docs/evals/cases/webpage-analysis-quality.md

Auto-apply:
- append eval case note
- patch feature PRD Active Scope
- update feature index link

Requires confirmation:
- change main PRD Stable Baseline
- change accepted architecture responsibility

Will not touch:
- docs/prd/main.md Stable Baseline
- unrelated architecture modules
- release docs unrelated to this session
```

Scope plans are required when:

- the project has multiple contributors,
- affected docs have owners or update policies,
- affected areas span more than 3 core docs,
- Foundation Repair is suggested,
- or the project has a large existing document tree.

## Pending Lifecycle

Pending profile updates must not rot in handoff forever.

The canonical pending queue is `.claude/profile-pending.json`.

Lifecycle:

```text
pending → repeated → profile debt → review queue / resolved / dismissed / converted to TODO
```

Rules:

- `seen_count = 1`: record as pending.
- `seen_count = 2`: mark as repeated and recommend Full Close soon.
- `seen_count >= 3`: mark as profile debt and surface in `status` and `end session`.
- Decision-heavy profile debt escalates to review queue.

Example machine-readable pending item:

```json
{
  "id": "pending-2026-06-08-001",
  "area": "PRD",
  "doc": "docs/prd/main.md",
  "summary": "Webpage analysis capability may need PRD update.",
  "evidence": ["User requested webpage analysis feature"],
  "first_seen": "2026-06-08",
  "last_seen": "2026-06-08",
  "seen_count": 1,
  "status": "pending",
  "recommended_action": "branch",
  "priority": "medium"
}
```

Escalated pending item example:

```json
{
  "id": "pending-2026-06-08-004",
  "area": "Architecture",
  "doc": "docs/architecture/main.md",
  "summary": "Agent tool ownership has changed repeatedly but architecture baseline still describes the old boundary.",
  "evidence": [
    "Session 2026-06-03 moved tool execution into agent-runtime.",
    "Session 2026-06-05 added eval-runner ownership notes.",
    "Session 2026-06-08 added another agent tool module without architecture update."
  ],
  "first_seen": "2026-06-03",
  "last_seen": "2026-06-08",
  "seen_count": 3,
  "status": "review_queue",
  "recommended_action": "review_decision",
  "requires_decision": true,
  "decision_type": "architecture_boundary",
  "priority": "high"
}
```

## Review Queue Escalation

Review queue escalation prevents Normal Close from hiding unresolved project decisions.

An item should escalate from ordinary pending to review queue when one or more conditions are true:

- `seen_count >= 3` and the item still affects a core reference doc.
- Multiple pending items point to the same product, architecture, roadmap, research, or operating-model decision.
- The pending item contradicts a protected section or confirmed decision.
- The recommended action is `rewrite_proposal`, `foundation_repair`, or `review_decision`.
- The pending queue has grown large enough that status output would become noisy.

Escalated items should remain in `.claude/profile-pending.json`; a separate review-queue file should not be introduced unless the queue becomes too large for practical use.

Review queue items must show:

- the unresolved decision,
- affected docs,
- evidence,
- recommended action,
- whether Full Close can resolve it,
- and whether user confirmation is required.

`status` should surface review queue items separately from normal TODOs:

```text
Profile Review Needed
- Architecture boundary decision: agent tool ownership has drifted from docs.
- PRD scope decision: billing has appeared in 3 sessions but is not in product scope.
```

Resolution paths:

- `resolved`: user confirms and Project Butler updates the appropriate profile docs.
- `dismissed`: user says the item is no longer relevant.
- `converted_to_todo`: the item is a concrete task, not a profile consistency issue.
- `profile_debt`: the item remains unresolved and should keep surfacing.

## Document Metadata And Policies

Full Close needs document policies so it can align project docs without rewriting confirmed knowledge.

The canonical source is `.claude/project-profile.json` under `doc_policies`.

Example:

```json
{
  "doc_policies": {
    "docs/prd/main.md": {
      "role": "stable_baseline_index",
      "owner": "product",
      "status": "stable",
      "update_policy": "branch_preferred",
      "protected_sections": ["Stable Baseline", "Confirmed Decisions"]
    }
  }
}
```

Markdown files may include optional front matter for human readability:

```yaml
---
owner: product
status: stable
update_policy: branch_preferred
---
```

If front matter and `project-profile.json` disagree, `project-profile.json` wins.

### Document Status Values

```text
draft       # early, can change more freely
active      # current and valid, active sections may be patched
stable      # confirmed, prefer append/branch; do not change baseline
deprecated  # no longer actively maintained
```

### Update Policies

```text
append_only
patch_active_sections_only
branch_preferred
proposal_only
owner_confirmation_required
```

Meanings:

- `append_only`: only append notes, changelog entries, failure cases, or open questions.
- `patch_active_sections_only`: patch active sections such as Active Scope and Open Questions.
- `branch_preferred`: create sub-docs for new features/modules/initiatives instead of expanding `main.md`.
- `proposal_only`: suggest changes but do not apply them automatically.
- `owner_confirmation_required`: require explicit confirmation before changing the document.

### Default Protected Sections

```text
Stable Baseline
Confirmed Decisions
Signed-off Scope
Locked Requirements
Accepted Architecture
```

Full Close must not change these sections without explicit confirmation.

### Document Policy Changes

Document policy changes always require confirmation.

This includes:

- `status` changes,
- `owner` changes,
- `update_policy` changes,
- `protected_sections` changes,
- `role` changes.

Example:

```text
Policy change proposed:
- docs/prd/main.md status: draft → stable
- update_policy: patch_active_sections_only → branch_preferred

Reason:
- PRD baseline has been confirmed and should now be protected.

Proceed?
```

## Core Document Branching

Core documents should not grow forever.

`main.md` should hold the stable baseline and index. Detailed changes should move into sub-docs.

PRD example:

```text
docs/prd/
├── main.md
├── features/
│   ├── webpage-analysis.md
│   ├── campaign-recommendations.md
│   └── competitor-insights.md
└── decisions/
    └── pricing-scope.md
```

Architecture example:

```text
docs/architecture/
├── main.md
├── modules/
│   ├── agent-runtime.md
│   ├── webpage-analyzer.md
│   └── eval-runner.md
├── integrations/
│   └── browser-fetching.md
└── decisions/
    └── model-provider-selection.md
```

Roadmap example:

```text
docs/roadmap/
├── main.md
├── initiatives/
│   ├── webpage-analysis.md
│   └── eval-quality.md
└── releases/
    └── v0.2.md
```

Default update priority:

```text
Append > Branch > Patch > Rewrite
```

When a change can be represented as a feature/module/initiative sub-doc, Project Butler should prefer branching over expanding a stable `main.md`.

## Protected Sections

Core documents should support protected areas.

Example:

```markdown
## Stable Baseline
Confirmed. Do not rewrite without explicit user approval.

## Active Scope
Can be patched during Full Close.

## Open Questions
Can be appended.

## Feature Index
Can be appended or patched.

## Change Log
Append-only.
```

Full Close may update:

- Active Scope,
- Open Questions,
- Feature / Module / Initiative indexes,
- Change Log,
- sub-doc drafts.

Full Close must not update without explicit confirmation:

- Stable Baseline,
- confirmed decisions,
- locked requirements,
- signed-off architecture,
- owner-protected sections.

## Stale-Document Detection

Stale-document detection identifies when documented project reality no longer matches current project reality.

It must not rely only on file age. A recently edited document can still be stale, and an old document can still be valid.

Stale types:

```text
fact_drift          # documented fact no longer matches code, files, or confirmed session facts
scope_drift         # implemented or repeated work is outside documented product/project scope
architecture_drift  # responsibility boundaries changed outside architecture docs
roadmap_drift       # roadmap priority/status no longer matches actual work
decision_drift      # recent work conflicts with a confirmed decision
coverage_gap        # important area has no reference doc despite repeated work
```

Evidence sources:

- current session facts,
- recent session logs,
- `.claude/profile-pending.json`,
- `.claude/project-profile.json`,
- existing profile docs,
- changed files or module structure,
- TODO and handoff references.

Example stale-document finding:

```json
{
  "id": "stale-2026-06-08-001",
  "doc": "docs/prd/main.md",
  "stale_type": "scope_drift",
  "confidence": "high",
  "evidence": [
    "Billing appeared in the last 3 session summaries.",
    "docs/prd/features/billing.md exists.",
    "docs/prd/main.md still lists only onboarding and profile modules."
  ],
  "affected_sections": ["Feature Index", "Active Scope"],
  "recommended_action": "branch",
  "auto_applicable": false,
  "reason_auto_applicable_false": "Adding billing to product scope changes baseline project scope."
}
```

Auto-apply is allowed only for low-risk stale fixes:

- append a stale finding to Open Questions,
- update an index link for an existing sub-doc,
- add a Change Log entry,
- record a pending or review queue item.

Confirmation is required when stale detection implies:

- product scope expansion,
- architecture responsibility changes,
- roadmap priority changes,
- reversal of a confirmed decision,
- document policy changes,
- or any protected-section update.

Stale-document detection should feed Full Close, Foundation Repair, and Review Queue Escalation. It should not directly rewrite stable documents.

## Foundation Repair

Foundation Repair is triggered when the project lacks, has stale docs for, or under-specifies a foundation area that current work clearly needs.

Foundation areas are not a fixed Project Butler taxonomy. They are generated or confirmed during Foundation Setup and stored in `.claude/project-profile.json`.

Examples by project shape:

- AI product: AI Quality Baseline is missing while assistant behavior keeps changing.
- Marketing project: Campaign Measurement is missing while launch metrics keep appearing in TODOs.
- Client delivery project: Acceptance Criteria is missing while deliverables are being scoped.
- Research project: Evidence Baseline is missing while sources and findings keep accumulating.

Foundation Repair must be bounded.

It should first produce a Repair Queue when multiple gaps exist, then recommend one bounded repair batch:

```text
Foundation gaps found:
1. AI Quality Baseline
   - docs/evals/main.md is missing
   - docs/failure-cases/main.md is missing
   - pending items mention assistant behavior quality 3 times

2. Campaign Measurement
   - metrics baseline is missing

Recommended first repair batch:
- AI Quality Baseline, because current work changes assistant behavior.
```

A repair batch may cover one foundation area or one tightly-coupled gap cluster inside that area. It should not repair unrelated foundation areas in the same pass unless the user explicitly approves a broader plan.

Before changing files, Foundation Repair should present:

```text
Foundation Repair Plan

Foundation area:
Gap:
Evidence:
Will read:
Will create:
Will update:
May patch:
Requires confirmation:
Will not touch:
Completion criteria:
```

Foundation Repair can create honest baseline drafts, update `DOCS.md`, add `doc_policies`, update `foundation_areas`, and resolve related pending items. It must not silently change project shape, protected sections, owner policy, or unrelated foundation areas.

## Full Close Stop Conditions

Full Close is done when:

1. Affected areas are identified.
2. Existing affected docs are read.
3. Missing foundation docs are created as baseline drafts or listed as pending.
4. Patch-level updates are applied or proposed.
5. New sub-docs are created or proposed when the change is separable.
6. Section/document rewrites are proposed, not silently performed.
7. Unresolved gaps are recorded in handoff/TODO.
8. Unrelated docs are not read or changed.

## Three-Stage Simulation Findings

### Stage 1: New Project Initialization

Scenario:

The user starts an AI Agent SaaS MVP with no existing docs.

Risks:

- Project Butler may over-generate directories from weak evidence.
- Required docs may be too heavy for a prototype.
- Optional overlays may be mistaken for required structure.

Confirmed rules:

- Treat initialization as Foundation Setup, not Full Close.
- Limit Required and Recommended documents.
- Require evidence for every Required document.
- Create `.claude/project-profile.json`.
- Prefer baseline drafts with open questions over pretending the project is fully specified.

### Stage 2: Early Project With Baseline Docs

Scenario:

The project has `docs/prd/main.md`, `docs/ai-architecture/main.md`, `docs/evals/main.md`, and `docs/roadmap/main.md`. The user adds webpage analysis and competitor insights.

Risks:

- Full Close may keep expanding `main.md` until it becomes unreadable.
- Updates may overwrite stable product or architecture decisions.
- Normal Close may defer the same update repeatedly until pending becomes noise.

Confirmed rules:

- Add Pending Lifecycle with `seen_count`.
- Prefer sub-doc branching for separable features/modules/initiatives.
- Protect stable sections.
- Update `main.md` indexes, not the entire baseline.
- Surface repeated pending updates as profile debt.

### Stage 3: Large Team Project

Scenario:

The project has many modules, multiple contributors, existing feature PRDs, architecture docs, roadmap docs, and accumulated pending profile updates.

Risks:

- Full Close may read too much and exceed token budget.
- Full Close may change documents owned by other people.
- Foundation Repair may become a broad project cleanup with no stopping point.
- AI may rewrite team consensus while trying to align documents.

Confirmed rules:

- Full Close must produce a scope plan before execution.
- Scope plan must list files to read, files to change, and files it will not touch.
- Support document ownership and update policy metadata.
- Large-project Foundation Repair should fix one bounded repair batch at a time by default.
- Stable baselines and owner-protected sections require explicit confirmation.

## Complete Capability Set

The complete Profile System should support:

1. Natural-language intake.
2. AI summary of inferred project shape.
3. Up to 3 adaptive clarification questions.
4. Required / Recommended / Optional document proposal.
5. `.claude/project-profile.json`.
6. `.claude/profile-pending.json`.
7. Foundation Setup baseline drafts.
8. Project-specific foundation areas.
9. Profile-aware `status`.
10. Normal Close pending profile updates.
11. Pending Lifecycle with `seen_count`.
12. Profile debt surfacing.
13. Full Close impact scan.
14. Scoped Full Close planning.
15. Safe patch-level auto-apply.
16. Core document branching.
17. Protected section enforcement.
18. Document policy management.
19. Foundation gap detection.
20. Bounded Foundation Repair.
21. Stale-document detection.
22. Profile evolution proposals.
23. Review queue escalation when pending grows too large.
24. Boundary-level Full Close confirmation.

## Runtime Phases

These are execution phases, not version cuts. The full system includes all of them.

### Phase 1: Profile Foundation

- Run natural-language intake.
- Summarize inferred project shape.
- Ask adaptive clarification questions.
- Generate Required / Recommended / Optional documents.
- Generate project-specific foundation areas.
- Create `.claude/project-profile.json`.
- Create `.claude/profile-pending.json`.
- Create baseline drafts for confirmed Required documents.

### Phase 2: Daily Operation

- Return profile-aware `status`.
- Run Normal Close.
- Record profile-impacting changes in `.claude/profile-pending.json`.
- Update pending lifecycle state.
- Surface repeated pending updates as profile debt.

### Phase 3: Full Close

- Run profile impact scan.
- Produce Scope Plan when required.
- Read affected profile docs only.
- Auto-apply safe patch-level updates.
- Create sub-doc drafts for separable changes.
- Group high-risk proposals for explicit confirmation.
- Enforce protected sections and document policies.
- Propose section/document rewrites instead of silently applying them.

### Phase 4: Foundation Repair

- Detect missing, stale, or under-specified project-specific foundation areas.
- Produce Repair Queue and bounded Repair Plan when needed.
- Create or update baseline drafts with evidence.
- Repair one bounded batch at a time by default.
- Multi-document Foundation Repair requires explicit user approval.

### Phase 5: Advanced Consistency

Phase 5 is a lightweight routing layer, not automated project governance.

It should support:

- Profile Evolution Proposal when current work no longer fits existing `generated_project_shape` or `foundation_areas`.
- Stale Finding Routing to Full Close, Foundation Repair, Review Queue, or Normal Close Pending.
- Review Queue Compaction when repeated pending items become too noisy for compact `status`.

It should not support in the first implementation:

- automatic stale scoring,
- deep whole-project scans,
- automatic profile shape changes,
- automatic document policy changes,
- separate review queue files by default.

Profile Evolution Proposal should:

- cite evidence from session facts, docs, pending items, or user statements,
- propose exact profile changes,
- ask before editing `.claude/project-profile.json`,
- record a pending or review queue item if the user declines.

Stale Finding Routing should:

- route existing-doc alignment to Full Close,
- route missing or under-specified foundation areas to Foundation Repair,
- route strategic or protected changes to Review Queue,
- route non-urgent findings to Normal Close Pending.

Review Queue Compaction should:

- merge repeated pending items that point to the same foundation area or decision,
- preserve source pending item IDs,
- keep evidence short and concrete,
- keep review queue items in `.claude/profile-pending.json` by default.

## Advanced Capability Safety Gates

- Stale-document detection must cite evidence and cannot rewrite docs directly.
- Stale-document fixes may auto-apply only when they are append/index/changelog level.
- Profile evolution detection may propose changes to `.claude/project-profile.json`, but policy/profile changes require confirmation.
- Review queue escalation is allowed when `.claude/profile-pending.json` becomes too large or contains repeated profile debt.
- Review queue escalation should stay inside `.claude/profile-pending.json` by default.
- Review queue compaction must preserve source pending item IDs and must not lose evidence.
- Full Close should ask for one Scope Plan approval, then batch safe L1/L2 updates.
- Section rewrites require confirmation.
- Document rewrites are never automatic.
- Multi-document Foundation Repair requires an approved repair plan.
- Foundation Repair must be profile-driven, not based on a fixed PRD/engineering taxonomy.
