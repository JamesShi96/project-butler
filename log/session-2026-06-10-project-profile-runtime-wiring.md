# Session 2026-06-10 — Project Profile System Runtime Wiring

## Session Goal

Move Project Profile System from PRD/design checkpoint into temporary runtime wiring inside the Project Butler skill, without treating it as a formal release.

## Key Actions (Chronological)

- Reviewed the prior conclusion: Profile System PRD was complete, but `SKILL.md` still used old runtime behavior.
- Decided not to split Project Butler into many sub-skills. Kept one main skill and added a dedicated reference file instead.
- Added `references/project-profile-system.md` as the runtime reference for:
  - Foundation Setup,
  - profile JSON files,
  - profile-aware end session,
  - Normal Close,
  - Full Close,
  - Scope Plans,
  - pending lifecycle,
  - review queue escalation,
  - stale-document detection,
  - profile-aware status,
  - upgrade behavior.
- Updated `SKILL.md` routing for profile setup, Normal Close, Full Close, profile sync, Foundation Repair, and profile-aware status.
- Updated generated project templates so new CLAUDE/Cursor rules can read optional profile JSON files and run profile impact scans.
- Updated `continue` and `continue full context` references so profile state is restored when profile files exist.
- Updated upgrade mode so ordinary upgrades do not force Profile System, while explicit profile setup/full close/foundation repair can enable it with confirmation.
- Updated README, Chinese README, examples, compatibility docs, and update log for the temporary runtime wiring checkpoint.
- Ran text-level simulation checks for fresh project, baseline project, and large project scenarios.

## Decisions & Rationale

- Keep Project Butler as one main skill with references, not many public sub-skills, to avoid trigger competition and shared-state drift.
- Treat Profile System as an optional layer on top of the base 7-component memory stack.
- Do not force profile JSON during ordinary upgrade.
- Full Close confirms the boundary once through Scope Plan, then batches safe updates inside that boundary.
- Protected sections, document policies, stable baselines, profile shape changes, and rewrites still require explicit confirmation.

## Output Files

- `SKILL.md`
- `references/project-profile-system.md`
- `references/file-templates.md`
- `references/continue.md`
- `references/continue-full-context.md`
- `references/upgrade-mode.md`
- `README.md`
- `README_zh.md`
- `docs/examples.md`
- `docs/compatibility.md`
- `UPDATE_LOG.md`
- `session-handoff.md`
- `log/session-2026-06-10-project-profile-runtime-wiring.md`

## Verification

- `git diff --check` passed.
- Markdown code fence count was even across touched Markdown files.
- Fresh project simulation text signals were present.
- Baseline project Normal Close / Full Close text signals were present.
- Large project Scope Plan and protected-section safety signals were present.

## Unfinished Items / Next Session Pickup

- This is still a temporary checkpoint, not a formal release.
- Run deeper end-to-end manual simulation on sample project folders before release.
- Consider adding small fixture examples for profile JSON once behavior is validated.
- Decide whether to tag/release after final review.

## CLAUDE.md Candidates (if any)

- Keep Project Butler as one public skill with reference modules unless a capability is fully independent and has no shared-state conflict.
- Profile System is optional extension state, not part of the base 7-component count.
