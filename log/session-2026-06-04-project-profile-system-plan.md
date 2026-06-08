# Session 2026-06-04 — Project Profile System Plan

## Session Goal

Review Project Butler from a top AI product management perspective, reduce product noise, and capture a proposal-only design for a future Project Profile System module without implementing it.

## Key Actions (Chronological)

- Reviewed the current Project Butler product experience and identified product noise around internal files and the 7-component system.
- Reframed public-facing usage around four primary actions: `/project-butler`, `end session`, `continue`, and `status`.
- Updated README, Chinese README, examples, compatibility docs, main skill guidance, and generated templates to separate daily workflow from advanced commands.
- Added `v1.5.1` to the update log for product noise reduction.
- Discussed Project Profiles as a future module for adapting document systems, status views, and end-session checks by project shape.
- Created `docs/project-profiles-module-plan.md` as a proposal-only document.
- Refined the plan from a simple project type taxonomy into a Project Profile System:
  - Primary Profile = delivery mode
  - Overlays = complexity modules
  - Maintenance Level = Lite / Standard / Deep
- Added details for Profile Evidence, Profile Confidence, Profile Output Contract, End Session Quality Controls, Profile Update Depth, initialization questions, examples, non-goals, open questions, and recommended first slice.
- Added `v1.5.2` to the update log for the Project Profile System proposal.

## Decisions & Rationale

- Do not implement the Project Profile System yet. Keep it as a proposal for further discussion.
- Do not model AI / Agent / RAG as a mutually exclusive project type. Treat it as an overlay that can combine with Product, Engineering, Research, or Delivery profiles.
- Use `Primary Profile + Optional Overlays` instead of trying to enumerate every possible project type.
- Default to at most 2 overlays to prevent directory and token-cost bloat.
- Add `Profile Maintenance Level` so light users can choose fast/low-cost saves and heavy users can choose deeper consistency checks.
- Use `Patch` by default for document updates, but allow section rewrite or document rewrite proposals when major drift is detected.
- Require evidence and confidence for profile recommendations and profile-aware document update suggestions.

## Output Files

- README.md
- README_zh.md
- SKILL.md
- UPDATE_LOG.md
- docs/compatibility.md
- docs/examples.md
- docs/project-profiles-module-plan.md
- references/file-templates.md
- references/continue.md
- references/continue-full-context.md
- references/document-archiving.md
- references/file-reorganization.md
- references/language-change.md
- references/update-log.md
- references/upgrade-mode.md
- log/session-2026-06-04-project-profile-system-plan.md
- session-handoff.md

## Unfinished Items / Next Session Pickup

- Continue discussing `docs/project-profiles-module-plan.md`; do not start implementation until the design is accepted.
- Review whether the proposed `Lite / Standard / Deep` maintenance levels are the right names and boundaries.
- Review whether pending profile updates should initially live in `session-handoff.md` / `TODO.md` or whether a later review queue is needed.
- Decide whether the Project Profile System should store selected profile metadata in generated `CLAUDE.md`, `PROJECT.md`, or a future metadata block.
- Consider adding a small "Future Ideas" section if risk flags, review queue integration, profile evolution, or stale-document scoring need a clearer parking lot.
- Before shipping, run a broader review of the current 14 modified files and the new proposal document, then decide whether to commit/tag/release.

## CLAUDE.md Candidates (if any)

- For proposal-only design work, store the plan in `docs/` and explicitly mark it as not wired into runtime behavior.
- When adding profile-aware behavior, keep token cost configurable through a maintenance level rather than making deep sync the default.
