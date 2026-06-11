# Session 2026-06-11 - Profile Default Runtime

## Session Goal

Finalize the Project Profile System product model after validation and review.

## Key Actions (Chronological)

- Reviewed the Profile System structure across `SKILL.md`, runtime reference docs, PRD, README, examples, templates, upgrade mode, and compatibility docs.
- Identified that treating Profile System as a user-facing optional setup switch created a mismatch with the desired Project Butler setup model.
- Changed the runtime model so fresh setup always uses profile-aware Foundation Setup.
- Removed the user-visible legacy document-type selection path from Fresh setup.
- Defined lightweight projects through `maintenance.preference = "lightweight"` and minimal confirmed docs instead of skipping profile state.
- Clarified `doc_policies` behavior:
  - default policies for newly created docs are part of the approved Scope Plan or Repair Plan,
  - existing document policy changes require explicit confirmation.
- Updated user-facing docs, generated templates, upgrade behavior, handoff, and update log to match the new model.
- Ran text-level validation, old-language scans, Markdown fence checks, `git diff --check`, staged sensitive-info scans, and a lightweight fresh-profile fixture check.
- Committed and pushed `43d2d7e docs: make profile setup default runtime`.

## Decisions & Rationale

- Profile System is internal runtime behavior, not a user-facing setup toggle.
- Users should confirm project understanding, document structure, and close mode, not whether "Profile System" is enabled.
- Normal Close and Full Close remain the user-visible choice because they represent cost and depth of work.
- Lightweight projects still get profile state, but with low maintenance cost.
- New docs need default `doc_policies` immediately; otherwise they become unsafe profile documents. Existing policies remain protected and require explicit confirmation to change.

## Output Files

- `SKILL.md`
- `references/project-profile-system.md`
- `references/file-templates.md`
- `references/upgrade-mode.md`
- `docs/prd/features/project-profile-system.md`
- `docs/examples.md`
- `docs/compatibility.md`
- `README.md`
- `README_zh.md`
- `UPDATE_LOG.md`
- `session-handoff.md`

## Unfinished Items / Next Session Pickup

- Run a true live Claude Code invocation for `/project-butler` in an empty disposable project.
- Verify that interactive user answers follow the default Foundation Setup model without exposing Profile System as a setup switch.
- Decide whether to tag a formal release after live invocation passes.

## CLAUDE.md Candidates

- None.
