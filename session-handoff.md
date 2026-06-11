# Session Handoff — Project Butler

> Last updated: 2026-06-11

## Current State

The current work is a validated runtime-wiring checkpoint for Project Profile System. It has passed text-level simulation, local disposable sample validation, and the final default-runtime documentation pass, but it has not yet been tagged as a formal release.

Current checkpoint:

- `references/project-profile-system.md` now exists as the runtime reference for Profile System behavior.
- `SKILL.md` now routes profile setup, Normal Close, Full Close, profile sync, Foundation Repair, and profile-aware status into that reference.
- Fresh initialization now uses profile-aware Foundation Setup by default; lightweight projects use `maintenance.preference = "lightweight"` and minimal confirmed docs instead of skipping profile state.
- Project profiles now include project-specific `foundation_areas`, and Foundation Repair now runs as a bounded, profile-driven repair batch instead of a fixed PRD/engineering workflow.
- Phase 5 Advanced Consistency is intentionally lightweight: profile evolution proposals, stale finding routing, and review queue compaction only. It does not do automatic stale scoring, profile rewrites, or whole-project scans.
- Generated templates, continue, full-context recovery, and upgrade mode now know how to read/preserve profile JSON files.
- README, examples, compatibility docs, and `UPDATE_LOG.md` describe Profile System as internal profile-aware runtime behavior.
- Disposable sample validation found no runtime-rule bug. After switching Fresh setup to always create profile state, a lightweight profile fixture check confirmed `maintenance.preference = "lightweight"` with no required docs. Detailed sample artifacts are intentionally not retained in the user-facing package.
- Latest pushed checkpoint: `43d2d7e docs: make profile setup default runtime`.

## Next Session Start

To continue the discussion, start by reading:

1. `references/project-profile-system.md`
2. `SKILL.md`
3. `references/file-templates.md`
4. `docs/prd/features/project-profile-system.md`
5. `log/session-2026-06-11-profile-default-runtime.md`
6. latest git status and log

Recommended prompt:

```text
continue full context
继续完善 Project Profile System runtime wiring。先读取 references/project-profile-system.md、SKILL.md、docs/prd/features/project-profile-system.md 和 log/session-2026-06-11-profile-default-runtime.md，然后做一次真正 live Claude Code invocation 验证 fresh setup 是否默认走 Foundation Setup。
```

## Discussion Focus To Resume

- Run one true live Claude Code invocation against an empty disposable local project.
- Confirm interactive setup does not expose Profile System as a setup switch.
- Confirm lightweight projects still create profile JSON with `maintenance.preference = "lightweight"`.
- Decide whether any formal release/tag should happen after live invocation passes.

## Do Not Forget

- The user asked to push checkpoint work, not tag a formal release yet.
- Do not describe this checkpoint as a formal release until live Claude Code invocation passes.
- Full Close should confirm boundaries, not every safe edit.
- Review queue escalation stays in `.claude/profile-pending.json` by default.
- Stale-document detection must cite evidence and must not directly rewrite stable documents.
