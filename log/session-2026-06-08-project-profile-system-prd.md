# Session 2026-06-08 — Project Profile System PRD

## Session Goal

Turn the Project Profile System proposal into a clearer PRD-level source of truth, while keeping runtime implementation explicitly pending.

## Key Actions (Chronological)

- Reviewed `docs/project-profiles-module-plan.md` from top to bottom.
- Reframed the system from fixed primary profile types into conversational Foundation Setup:
  - user describes the project naturally,
  - AI summarizes the inferred project shape,
  - AI asks targeted follow-up questions,
  - AI proposes Required / Recommended / Optional document structure.
- Confirmed that initialization is Foundation Setup, not Full Close.
- Confirmed machine-readable profile state:
  - `.claude/project-profile.json` for stable profile configuration,
  - `.claude/profile-pending.json` for dynamic pending/profile debt.
- Confirmed pending lifecycle, including `seen_count >= 3` becoming profile debt.
- Confirmed core documents should be stable baseline + index, with detailed changes moved into sub-docs.
- Confirmed Full Close should use Scope Plans and update priority `Append > Branch > Patch > Rewrite`.
- Confirmed Full Close can auto-apply safe patch-level updates inside approved boundaries.
- Added explicit balancing model for Full Close:
  - confirm the boundary,
  - batch safe L1/L2 updates,
  - require explicit confirmation for L4 semantic, policy, protected-section, or rewrite changes.
- Defined Review Queue Escalation as decision-heavy profile debt, not ordinary TODO.
- Defined Stale-Document Detection as evidence-based detection of drift between documented project reality and current project reality.
- Created Project Butler PRD source of truth under `docs/prd/`.
- Marked the original module plan as a superseded proposal.

## Decisions & Rationale

- The Profile System design is now PRD-complete enough to stop open-ended product discussion.
- The skill itself is not yet upgraded. `SKILL.md` still uses the current production behavior.
- Full Close should not ask the user to confirm every small change. It should ask for Scope Plan approval and only interrupt for high-risk changes.
- Review queue items stay inside `.claude/profile-pending.json` by default. A separate review queue file should be introduced only if the queue becomes too large.
- Stale-document detection must cite evidence and should feed Full Close, Foundation Repair, and Review Queue Escalation. It must not rewrite stable documents directly.

## Output Files

- `docs/prd/main.md`
- `docs/prd/features/project-profile-system.md`
- `docs/project-profiles-module-plan.md`
- `session-handoff.md`
- `log/session-2026-06-08-project-profile-system-prd.md`

## Unfinished Items / Next Session Pickup

- Implement Profile System runtime behavior in `SKILL.md` and/or a new reference file.
- Add `Foundation Setup` routing to initialization.
- Add profile-aware `end session` impact scan with Normal Close / Full Close.
- Add profile JSON creation and update rules.
- Add profile-aware `status` output for profile debt and review queue items.
- Run simulated validation for fresh project, baseline project, and large project scenarios after implementation.

## CLAUDE.md Candidates (if any)

- When Full Close is requested, confirm the scope boundary once, then batch safe updates inside that boundary.
- Treat repeated deferred profile updates as profile debt, and escalate decision-heavy debt into a review queue.
