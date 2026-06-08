# Session Handoff — Project Butler

> Last updated: 2026-06-08

## Current State

The current work is PRD and documentation focused. No runtime implementation for Project Profile System has been wired in.

Current checkpoint:

- Product noise reduction and Project Profile System proposal work from 2026-06-04 are still part of the temporary checkpoint.
- Project Profile System now has PRD source-of-truth documents under `docs/prd/`.
- The original `docs/project-profiles-module-plan.md` is marked as a superseded proposal.
- Full Close, Review Queue Escalation, and Stale-Document Detection have PRD-level rules, but they are not yet implemented in runtime skill behavior.
- This checkpoint is intended as a temporary pushed version before the later formal implementation pass.

## Next Session Start

To continue the discussion, start by reading:

1. `docs/prd/main.md`
2. `docs/prd/features/project-profile-system.md`
3. `docs/project-profiles-module-plan.md`
4. `log/session-2026-06-08-project-profile-system-prd.md`
5. current git diff

Recommended prompt:

```text
continue full context
继续实现 Project Profile System。先读取 docs/prd/main.md、docs/prd/features/project-profile-system.md 和 log/session-2026-06-08-project-profile-system-prd.md，然后把 PRD 落到 SKILL.md / references 运行逻辑。
```

## Discussion Focus To Resume

- Implement Foundation Setup as the new Profile System initialization path.
- Implement profile-aware end session with impact scan, Normal Close, Full Close, and Scope Plan.
- Implement `.claude/project-profile.json` and `.claude/profile-pending.json` creation/update behavior.
- Implement profile-aware `status` with profile debt and review queue surfacing.
- Keep safe auto-apply bounded by Scope Plan, document policies, protected sections, and evidence.

## Do Not Forget

- The user confirmed the current PRD direction and wants to continue implementation later.
- Do not describe this checkpoint as a completed skill upgrade; it is PRD/design complete, implementation pending.
- Full Close should confirm boundaries, not every safe edit.
- Review queue escalation stays in `.claude/profile-pending.json` by default.
- Stale-document detection must cite evidence and must not directly rewrite stable documents.
