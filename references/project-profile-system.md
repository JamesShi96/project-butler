# Project Profile System

This reference defines the runtime behavior for Project Butler's profile-aware setup, status, and close flows.

Use it when:

- initializing a fresh project,
- upgrading an existing project into Profile System,
- handling `end session` when `.claude/project-profile.json` exists,
- handling explicit `normal close`, `full close`, `foundation repair`, or `profile repair`,
- rendering `status` when `.claude/project-profile.json` or `.claude/profile-pending.json` exists.

Do not treat this as a separate user-facing product. It is a profile-aware layer on top of the existing Project Butler memory stack.

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

Foundation Setup is the default fresh initialization path when Profile System is enabled. It replaces fixed document-type selection with conversational profile generation.

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

When creating `.claude/project-profile.json`, do not leave `directories` or `doc_policies` empty if profile docs were confirmed. Populate them from the approved Required / Recommended / Optional tiers and created baseline docs.

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
