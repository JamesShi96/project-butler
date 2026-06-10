# Session Handoff — Project Butler

> Last updated: 2026-06-11

## Current State

The current work is a validated runtime-wiring checkpoint for Project Profile System. It has passed text-level simulation and local disposable sample validation, but it has not yet been tagged as a formal release.

Current checkpoint:

- `references/project-profile-system.md` now exists as the runtime reference for Profile System behavior.
- `SKILL.md` now routes profile setup, Normal Close, Full Close, profile sync, Foundation Repair, and profile-aware status into that reference.
- Fresh initialization now uses profile-aware Foundation Setup by default; lightweight projects use `maintenance.preference = "lightweight"` and minimal confirmed docs instead of skipping profile state.
- Project profiles now include project-specific `foundation_areas`, and Foundation Repair now runs as a bounded, profile-driven repair batch instead of a fixed PRD/engineering workflow.
- Phase 5 Advanced Consistency is intentionally lightweight: profile evolution proposals, stale finding routing, and review queue compaction only. It does not do automatic stale scoring, profile rewrites, or whole-project scans.
- Generated templates, continue, full-context recovery, and upgrade mode now know how to read/preserve profile JSON files.
- README, examples, compatibility docs, and `UPDATE_LOG.md` describe Profile System as internal profile-aware runtime behavior.
- Disposable sample validation found no runtime-rule bug. After switching Fresh setup to always create profile state, a lightweight profile fixture check confirmed `maintenance.preference = "lightweight"` with no required docs. Detailed sample artifacts are intentionally not retained in the user-facing package.

## Next Session Start

To continue the discussion, start by reading:

1. `references/project-profile-system.md`
2. `SKILL.md`
3. `references/file-templates.md`
4. `docs/prd/features/project-profile-system.md`
5. `log/session-2026-06-10-project-profile-runtime-wiring.md`
6. current git diff

Recommended prompt:

```text
continue full context
继续完善 Project Profile System runtime wiring。先读取 references/project-profile-system.md、SKILL.md、docs/prd/features/project-profile-system.md 和当前 git diff，然后重点检查 Foundation Repair / foundation_areas / Phase 5 Advanced Consistency 是否和初始化、Normal Close、Full Close 闭环一致。
```

## Discussion Focus To Resume

- Run one real interactive validation in Claude Code against an empty local project.
- Run one real Normal Close and one real Full Close on active projects.
- Validate Foundation Repair with a non-engineering project profile, such as marketing, client delivery, or research.
- Validate Phase 5 routing on repeated pending items: profile evolution proposal, stale finding routing, and review queue compaction.
- Check whether the generated CLAUDE/Cursor templates are specific enough without becoming too large.
- Decide whether any formal release/tag should happen after validation.

## Do Not Forget

- The user asked to push the earlier version as a temporary checkpoint, not a formal release.
- Do not describe this checkpoint as final until real interactive validation is done.
- Full Close should confirm boundaries, not every safe edit.
- Review queue escalation stays in `.claude/profile-pending.json` by default.
- Stale-document detection must cite evidence and must not directly rewrite stable documents.
