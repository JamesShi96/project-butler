# Project Profile System

This reference defines the runtime behavior for Project Butler's profile-aware setup, status, and close flows.

Use it when:

- initializing a fresh project with Profile System enabled or being proposed,
- upgrading an existing project into Profile System,
- handling `end session` when `.claude/project-profile.json` exists,
- handling explicit `normal close`, `full close`, `foundation repair`, or `profile repair`,
- rendering `status` when `.claude/project-profile.json` or `.claude/profile-pending.json` exists.

Do not treat this as a separate user-facing product. It is a profile-aware layer on top of the existing Project Butler memory stack.

---

## Enablement Model

Profile System is optional. It should not be created for every fresh project automatically.

Enable Profile System when:

- the user explicitly asks for `profile setup`, `foundation setup`, Full Close, Foundation Repair, or profile-aware behavior,
- an existing project already has `.claude/project-profile.json` or `.claude/profile-pending.json`,
- or the assistant recommends it for a project with clear long-lived alignment needs and the user confirms.

Good recommendation signals:

- product scope, roadmap, architecture, research, evals, delivery, compliance, or operating model will change across sessions,
- AI behavior, prompts, datasets, or evals need stable references,
- multiple people or tools need to stay aligned on project documents,
- the user asks for stronger long-term memory than the base 7-component stack.

Do not enable Profile System by default when:

- the project is small, short-lived, or mostly code-only,
- the user only asked for ordinary `/project-butler` setup and gave no signal that long-lived profile docs are needed,
- the user declines the profile proposal.

If Profile System is skipped, create only the base Project Butler memory stack. The user can enable Profile System later with `profile setup` or `foundation setup`.

---

## Core Files

Profile System uses two machine-readable files:

```text
.claude/project-profile.json      # stable profile configuration
.claude/profile-pending.json      # dynamic pending queue
```

`project-profile.json` is canonical for profile shape, directories, document policies, and protected sections. Markdown front matter may mirror policy metadata for humans, but JSON wins if they disagree.

`profile-pending.json` is the canonical place for pending profile updates, repeated drift, profile debt, and review queue items. Do not scatter profile debt across `TODO.md` unless the item is a concrete execution task.

---

## Foundation Setup

Foundation Setup is the fresh initialization path after Profile System has been enabled or confirmed. It replaces fixed document-type selection with conversational profile generation.

### Step 1: Gather Basic Setup Inputs

Ask for these basics:

1. Project name.
2. Natural project description.
3. Current stage.
4. Language mode: `en`, `zh`, or `bilingual`.
5. Optional GitHub repository.
6. Whether to create Cursor rules.
7. Version naming style, or let AI recommend one.

Use one low-pressure project-description prompt:

```text
What are you trying to do with this project?
You can describe it casually. No format needed.
```

Do not ask the user to choose a fixed project type.

### Step 2: Infer Project Shape

Summarize the inferred project shape in plain language:

```text
I understand this as:
- Project shape: {generated label}
- Main output: {what the project delivers}
- Main drift risks: {2-4 risks}
- Foundation areas: {2-5 project-specific long-lived reference areas}
- Likely reference docs: {short list}

Is this right?
```

Then ask at most 3 targeted clarification questions. Ask only for information that changes the file system, required documents, or close behavior.

Good question types:

- "Is this primarily a product, an internal engineering system, a research project, or a client deliverable?"
- "Will AI behavior, prompts, evals, or datasets be part of the project?"
- "Do multiple people need to align on PRD, architecture, roadmap, or delivery docs?"
- "Is this mostly exploration, MVP build, production operation, or client handoff?"

Avoid taxonomy-heavy questions. The user should not need to learn Project Butler's internal categories.

### Step 3: Propose Document Tiers

Propose a small, evidence-backed structure:

```text
Foundation areas
- Product scope — feature boundaries and user-facing behavior need a stable reference
- AI quality baseline — prompts, evals, and failure cases need tracking

Required
- docs/prd/ — product scope needs a stable reference
- docs/architecture/ — modules and responsibilities need a baseline

Recommended
- docs/roadmap/ — useful for release planning
- docs/evals/ — useful because AI behavior will change

Optional
- docs/design-system/ — create only if UX states become central
- docs/research/ — create only if research evidence becomes a recurring artifact
```

Guardrails:

- Foundation areas must be generated from the user's actual project, not chosen from a fixed list.
- Each Required directory should map to at least one foundation area.
- Required directories should usually be capped at 3-4.
- Recommended directories should usually be capped at 5-6.
- Optional directories are listed but not created by default.
- Every Required or Recommended directory needs rationale or evidence.
- Custom directory names require user confirmation and should map to the closest stable vocabulary term.

Stable vocabulary:

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

### Step 4: Confirm Before Creating Files

Before writing profile files or baseline docs, present the proposed structure and ask for confirmation or edits.

After confirmation:

1. Create the normal Project Butler memory files using the main init flow and `references/file-templates.md`.
2. Create `.claude/project-profile.json`.
3. Create `.claude/profile-pending.json`.
4. Create baseline drafts for confirmed Required docs only.
5. Create Recommended docs only if the user keeps them selected.
6. Do not create Optional docs unless explicitly selected.

Baseline drafts must be honest about uncertainty. Use Open Questions rather than pretending weak evidence is confirmed.

When creating `.claude/project-profile.json`, do not leave `foundation_areas`, `directories`, or `doc_policies` empty if profile docs were confirmed. Populate them from the approved project-shape summary, Required / Recommended / Optional tiers, and created baseline docs.

---

## Profile JSON Schema

Minimum `.claude/project-profile.json`:

```json
{
  "schema_version": "1.0",
  "updated_at": "YYYY-MM-DD",
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
    "required": [],
    "recommended": [],
    "optional": [],
    "custom": []
  },
  "doc_policies": {}
}
```

Creation rules:

- `generated_project_shape` must match the approved project-shape summary.
- `reference_archetypes_used` and `overlays` must include confidence and evidence when used.
- `foundation_areas` must be project-specific. Use internal archetypes only as hints; do not write a fixed template category as the user's foundation area.
- Each `foundation_areas[]` item must include `id`, `label`, `purpose`, `docs`, `status`, and `evidence`.
- `foundation_areas[].status` should be one of `active`, `missing`, `stale`, `under_specified`, or `deferred`.
- `foundation_areas[].docs` should list existing or proposed docs that carry that foundation area.
- `directories.required` must list confirmed Required directories.
- `directories.recommended` must list confirmed Recommended directories that the user kept selected.
- `directories.optional` must list Optional directories that were shown but not created.
- `directories.custom` must list custom directories only after user confirmation.
- `doc_policies` must include every created profile baseline doc.

Default policy for created baseline `main.md` docs:

```json
{
  "role": "stable_baseline_index",
  "owner": null,
  "status": "draft",
  "update_policy": "patch_active_sections_only",
  "protected_sections": ["Stable Baseline", "Confirmed Decisions", "Signed-off Scope", "Accepted Architecture"]
}
```

Default policy for created sub-doc drafts:

```json
{
  "role": "working_subdoc",
  "owner": null,
  "status": "draft",
  "update_policy": "patch_active_sections_only",
  "protected_sections": ["Confirmed Decisions", "Accepted Architecture"]
}
```

Minimum `.claude/profile-pending.json`:

```json
{
  "schema_version": "1.0",
  "updated_at": "YYYY-MM-DD",
  "items": []
}
```

Allowed pending status values:

```text
pending
repeated
profile_debt
review_queue
resolved
dismissed
converted_to_todo
```

Allowed recommended actions:

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

---

## Profile-Aware End Session

Profile-aware close is a layer inside the normal End Session Flow.

Run it when:

- `.claude/project-profile.json` exists,
- the user explicitly asks for `normal close`, `full close`, `profile sync`, `profile repair`, or `foundation repair`,
- or the session clearly changed long-lived product, architecture, roadmap, research, eval, design, delivery, or operating-model knowledge.

### Impact Scan

Before deciding close mode:

1. Capture session facts from the current conversation and changed files.
2. Read `.claude/project-profile.json` if present.
3. Read `.claude/profile-pending.json` if present.
4. Identify affected profile areas.
5. Classify each finding:
   - no profile impact,
   - pending update,
   - safe patch candidate,
   - sub-doc branch candidate,
   - rewrite proposal,
   - foundation repair candidate,
   - review decision needed.

Do not deep-read long-lived profile docs during the initial scan unless Full Close is selected or the user explicitly requests it.

### Close Mode Selection

If no meaningful profile-impacting change exists, continue Normal Close without asking.

If profile-impacting changes exist and the user did not already specify the mode, offer:

```text
Profile-impacting changes detected.

1. Normal Close — save session now and record profile updates as pending.
2. Full Close — align affected profile docs now with a bounded Scope Plan.
```

### Normal Close

Normal Close should:

- continue the standard End Session Flow,
- add or update pending items in `.claude/profile-pending.json`,
- increment `seen_count` for repeated items,
- escalate `seen_count = 2` to `repeated`,
- escalate `seen_count >= 3` to `profile_debt`,
- avoid deep reads of long-lived profile docs,
- avoid patching PRD, architecture, roadmap, evals, or other stable reference docs.

Example pending item:

```json
{
  "id": "pending-YYYY-MM-DD-001",
  "area": "PRD",
  "doc": "docs/prd/main.md",
  "summary": "Billing capability may need product-scope update.",
  "evidence": ["Billing appeared in this session's implementation discussion."],
  "first_seen": "YYYY-MM-DD",
  "last_seen": "YYYY-MM-DD",
  "seen_count": 1,
  "status": "pending",
  "recommended_action": "branch",
  "priority": "medium"
}
```

### Full Close

Full Close should:

1. Continue the standard End Session Flow baseline.
2. Produce a Scope Plan before changing profile docs.
3. Read only affected profile docs.
4. Auto-apply safe L1/L2 updates inside the approved Scope Plan.
5. Create sub-doc drafts only when listed in the approved Scope Plan.
6. Group high-risk proposals for explicit confirmation.
7. Record unresolved proposals in `.claude/profile-pending.json`.

Full Close is not whole-project cleanup. It is a bounded alignment pass for affected profile areas.

---

## Scope Plan

Use a Scope Plan before Full Close changes any profile doc.

Required for:

- multiple contributors,
- docs with owners or update policies,
- more than 3 affected core docs,
- Foundation Repair,
- large existing document trees,
- any protected section nearby.

Format:

```text
Full Close Scope Plan

Will read:
- docs/prd/features/billing.md
- docs/architecture/modules/billing.md

May change:
- docs/prd/features/billing.md
- docs/prd/main.md Feature Index

Auto-apply:
- update feature index link
- append Change Log note

Requires confirmation:
- add billing to Stable Baseline
- change accepted architecture responsibility

Will not touch:
- docs/prd/main.md Stable Baseline
- unrelated architecture modules
```

Ask for one approval of the Scope Plan. Do not ask for every safe L1/L2 update.

---

## Auto-Apply Safety

Full Close may auto-apply only when all are true:

1. File is listed in Scope Plan `May change`.
2. Target section is not protected.
3. `doc_policies` allows the update.
4. Evidence is clear.
5. Change is append, branch, or active-section patch only.

If an existing affected document has no `doc_policies` entry, treat it conservatively:

- no automatic patch to the document body,
- no protected-section changes,
- no inferred policy write,
- record a pending/review item or propose a document policy change for user confirmation.

New sub-docs created inside an approved Scope Plan must receive a `doc_policies` entry in the same Full Close.

Allowed:

- append to Change Log,
- append to Open Questions,
- update Feature / Module / Initiative indexes,
- patch Active Scope,
- create sub-doc drafts listed in the approved Scope Plan.

Always require explicit confirmation for:

- Stable Baseline changes,
- Confirmed Decisions changes,
- Signed-off Scope changes,
- Locked Requirements changes,
- Accepted Architecture changes,
- section rewrites,
- document rewrites,
- document policy changes,
- profile shape, overlay, or permission changes in `.claude/project-profile.json`.

Update priority:

```text
Append > Branch > Patch > Rewrite
```

---

## Pending Lifecycle And Review Queue

Lifecycle:

```text
pending → repeated → profile_debt → review_queue / resolved / dismissed / converted_to_todo
```

Rules:

- `seen_count = 1`: `pending`.
- `seen_count = 2`: `repeated`.
- `seen_count >= 3`: `profile_debt`.
- Decision-heavy profile debt escalates to `review_queue`.

Escalate to `review_queue` when:

- repeated items affect the same core reference doc,
- multiple pending items point to the same product, architecture, roadmap, research, or operating-model decision,
- the pending item contradicts a protected section or confirmed decision,
- the recommended action is `rewrite_proposal`, `foundation_repair`, or `review_decision`,
- the pending queue becomes too noisy for compact status.

Keep review queue items in `.claude/profile-pending.json` by default. Do not create a separate review queue file unless the queue becomes too large.

---

## Foundation Repair

Foundation Repair fixes missing, stale, or under-specified project-specific foundation areas. It is not a full project cleanup pass.

Run Foundation Repair when:

- the user explicitly asks for `foundation repair` or `profile repair`,
- `status` surfaces profile debt that points to a missing or stale foundation area,
- Normal Close sees the same foundation gap repeatedly,
- Full Close needs an affected foundation doc that does not exist,
- or `.claude/project-profile.json` has a `foundation_areas[]` item with `status` of `missing`, `stale`, or `under_specified` and current work depends on it.

### Foundation Areas Are Profile-Driven

Do not use a fixed list of foundation areas. Read them from `.claude/project-profile.json`.

If `foundation_areas` is missing in an older profile, infer candidate areas from:

- `generated_project_shape`,
- `directories`,
- `doc_policies`,
- `DOCS.md`,
- `.claude/profile-pending.json`,
- recent `session-handoff.md` and `UPDATE_LOG.md` facts.

Treat inferred areas as proposals. Ask for confirmation before writing them into `.claude/project-profile.json`.

Foundation Repair must not invent a new foundation area silently. If current work no longer fits the existing foundation areas, propose profile evolution and wait for confirmation.

### Gap Clustering

Repair one bounded batch at a time, not necessarily one file at a time.

Allowed:

- one foundation area,
- or one tightly-coupled gap cluster inside the same foundation area,
- usually 1-3 strongly related docs.

Do not auto-repair gaps across unrelated foundation areas in the same batch. If several areas need work, produce a Repair Queue and recommend the first batch.

Example:

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

### Repair Plan

Before changing files, present a bounded plan:

```text
Foundation Repair Plan

Foundation area:
- {project-specific area label}

Gap:
- {missing, stale, or under-specified foundation}

Evidence:
- {session / pending / docs / profile evidence}

Will read:
- {existing docs needed for this batch}

Will create:
- {new baseline docs}

Will update:
- DOCS.md index
- .claude/project-profile.json foundation_areas / doc_policies
- .claude/profile-pending.json item status

May patch:
- {non-protected index, active section, or open questions}

Requires confirmation:
- {stable baseline, signed-off scope, owner policy, strategic decision}

Will not touch:
- {unrelated foundation areas, protected sections, unrelated docs}

Completion criteria:
- {what makes this repair batch done}
```

Ask for one approval of the Repair Plan. Do not ask for every safe index, policy, or pending-status update inside the approved batch.

### Write Rules

Foundation Repair may:

- create honest baseline drafts for approved missing docs,
- append Open Questions instead of pretending uncertain facts are confirmed,
- update `DOCS.md` indexes,
- add `doc_policies` for newly created docs,
- update the relevant `foundation_areas[]` item status and docs list,
- mark related pending items as `resolved`, `profile_debt`, `review_queue`, or `converted_to_todo`.

Foundation Repair must not:

- rewrite stable baselines,
- change protected sections without confirmation,
- change project shape or foundation areas without confirmation,
- repair unrelated foundation areas in the same batch,
- create every Recommended or Optional doc just because an area exists.

Stop when:

1. The approved repair batch has a baseline doc or explicit pending/review item.
2. `DOCS.md`, `doc_policies`, and `foundation_areas` match the created docs.
3. Related pending items have updated status.
4. Open questions capture unresolved uncertainty.
5. Unrelated foundation areas remain untouched.

---

## Stale-Document Detection

Stale-document detection flags mismatch between documented project reality and current project reality.

Do not rely only on file age.

Stale types:

```text
fact_drift
scope_drift
architecture_drift
roadmap_drift
decision_drift
coverage_gap
```

Evidence sources:

- session facts,
- recent session logs,
- `.claude/profile-pending.json`,
- `.claude/project-profile.json`,
- existing profile docs,
- changed files or module structure,
- TODO and handoff references.

Stale findings must cite evidence and must not directly rewrite stable documents.

Auto-apply is allowed only for low-risk fixes:

- append stale finding to Open Questions,
- update an index link for an existing sub-doc,
- add a Change Log entry,
- record pending or review queue item.

Confirmation is required when stale detection implies:

- product scope expansion,
- architecture responsibility change,
- roadmap priority change,
- reversal of a confirmed decision,
- document policy change,
- protected-section update.

---

## Advanced Consistency

Advanced Consistency is a lightweight routing layer. It should not become automated project governance.

Use it for:

- profile evolution proposals,
- stale finding routing,
- review queue compaction.

Do not use it for:

- automatic stale scoring,
- deep whole-project scans,
- automatic profile shape changes,
- automatic document policy changes,
- separate review queue files by default.

### Profile Evolution Proposal

Profile evolution is needed when current work no longer fits the existing `generated_project_shape` or `foundation_areas`.

Signals:

- repeated pending items do not map to any current foundation area,
- current work creates a new long-lived area that is not represented in `foundation_areas`,
- existing foundation areas no longer explain the project's main output,
- the user explicitly says the project direction changed,
- Full Close or Foundation Repair would need to invent a new foundation area to proceed.

When detected, propose. Do not edit `.claude/project-profile.json` automatically.

Output shape:

```text
Profile evolution may be needed.

Current profile:
- Shape: {generated_project_shape.label}
- Foundation areas: {current areas}

New evidence:
- {evidence from session / docs / pending items}

Proposed profile evolution:
- Add foundation area: {label}
- Update docs: {paths}
- Update doc_policies: {policy changes}

Requires confirmation:
- Update .claude/project-profile.json?
```

If the user declines, record a pending or review queue item instead of changing the profile.

### Stale Finding Routing

Stale findings must route to one of these outcomes:

```text
Full Close
- Existing affected docs exist.
- Safe index / active-section / open-question updates can align them.

Foundation Repair
- A required foundation area is missing, stale, or under-specified.
- The current work depends on that foundation area.

Review Queue
- The stale finding implies a strategic decision, protected section change, owner policy change, or profile evolution.

Normal Close Pending
- The finding is real but not urgent, or the user does not want to align docs now.
```

Each routed finding must include:

- affected foundation area or doc,
- evidence,
- recommended route,
- why safer routes were not chosen,
- whether user confirmation is required.

### Review Queue Compaction

Keep review queue items in `.claude/profile-pending.json` by default.

Compact pending items into a review queue item when:

- 3 or more pending items point to the same foundation area,
- several pending items ask for the same product, project, research, delivery, or operating decision,
- pending output becomes too noisy for compact `status`,
- repeated items cannot be resolved by Normal Close, Full Close, or Foundation Repair without a user decision.

Compaction rules:

- preserve source pending item IDs in `source_item_ids`,
- summarize the decision needed,
- keep evidence short and concrete,
- mark source items as `review_queue` or `resolved` only when the new item clearly covers them,
- do not create a separate review queue file unless `.claude/profile-pending.json` becomes impractically large.

Example compacted item:

```json
{
  "id": "review-YYYY-MM-DD-001",
  "area": "AI Quality Baseline",
  "summary": "Decide whether assistant behavior requires eval gates before release.",
  "evidence": [
    "pending-2026-06-10-001 mentioned missing eval coverage.",
    "pending-2026-06-11-002 mentioned failure cases.",
    "Full Close could not resolve without release policy decision."
  ],
  "source_item_ids": ["pending-2026-06-10-001", "pending-2026-06-11-002"],
  "status": "review_queue",
  "recommended_action": "review_decision",
  "priority": "high"
}
```

Stop when:

1. The queue is compact enough for `status`.
2. Each review queue item asks for a real decision.
3. No pending evidence is lost.
4. No new files were introduced.

---

## Profile-Aware Status

When `.claude/project-profile.json` or `.claude/profile-pending.json` exists, include a compact Profile section in `status`.

Read:

- `PROJECT.md`,
- `session-handoff.md`,
- `TODO.md` if present,
- latest `UPDATE_LOG.md` entry if present,
- `.claude/project-profile.json` if present,
- `.claude/profile-pending.json` if present.

Output shape:

```text
Profile:
- Shape: {generated_project_shape.label}
- Maintenance: {maintenance.preference}
- Pending profile updates: {count}
- Profile debt: {count}
- Review needed: {count}

Profile Review Needed:
- {short review_queue item}
```

Only show this section when profile files exist or profile-impacting issues were detected.

---

## Upgrade Behavior

For existing Project Butler projects without Profile System:

1. Do not force profile creation during ordinary upgrade.
2. Offer Profile System only when the user asks for setup, profile setup, Full Close, Foundation Repair, or profile-aware behavior.
3. If user enables it, infer profile from existing `PROJECT.md`, `DOCS.md`, `UPDATE_LOG.md`, `docs/`, and recent logs.
4. Mark uncertain inferences with lower confidence and open questions.
5. Ask for confirmation before writing `.claude/project-profile.json`, `.claude/profile-pending.json`, or baseline profile docs.

For existing projects with profile files:

- Preserve existing profile state.
- Patch only schema-compatible missing fields.
- Never rewrite profile shape, overlays, document policies, or protected sections without confirmation.

---

## Common Mistakes

- Do not ask users to pick from fixed profile categories.
- Do not create every Recommended or Optional document.
- Do not treat Normal Close as permission to patch long-lived reference docs.
- Do not run Full Close without user intent or a close-mode prompt.
- Do not deep-read every document during impact scan.
- Do not rewrite stable PRD, architecture, roadmap, or rules automatically.
- Do not use `TODO.md` as the default home for profile debt.
- Do not create a separate review queue file by default.
