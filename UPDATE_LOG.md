# Update Log

<!-- version-style: semantic -->

## v1.5.3 (2026-06-08)

### Patch: Project Profile System PRD Checkpoint

- Added Project Butler's main PRD in `docs/prd/main.md`.
- Added the Project Profile System feature PRD in `docs/prd/features/project-profile-system.md`.
- Promoted the profile-system design from proposal discussion into PRD source-of-truth documents.
- Marked `docs/project-profiles-module-plan.md` as a superseded proposal.
- Confirmed Foundation Setup, profile JSON state, pending lifecycle, Scoped Full Close, bounded Foundation Repair, Review Queue Escalation, and Stale-Document Detection rules.
- Clarified that Full Close should confirm scope boundaries and high-risk semantic changes, not every safe patch-level update.
- Kept runtime implementation pending; `SKILL.md` has not yet been upgraded to execute the Profile System.

---

## v1.5.2 (2026-06-04)

### Patch: Project Profile System Proposal

- Added a proposal-only module plan for Project Profile System in `docs/project-profiles-module-plan.md`.
- Defined profile composition as Primary Profile + Optional Overlays + Maintenance Level.
- Added maintenance levels for Lite, Standard, and Deep profile sync to balance token cost and document consistency.
- Added end-session quality controls, update depth rules, evidence requirements, and initialization questions for future discussion.
- Kept the proposal disconnected from runtime behavior; no implementation wiring was added.

---

## v1.5.1 (2026-06-03)

### Patch: Product Noise Reduction

- Reframed the public product message around four user-facing actions: `/project-butler`, `end session`, `continue`, and `status`.
- Split commands into primary and advanced groups in README and generated project rules.
- Moved the 7-component memory stack explanation behind Internals / How It Works instead of leading with implementation details.
- Reworked examples around Daily Use, result-focused `end session` summaries, and dashboard-style `status` output.
- Updated initialization guidance to present required project basics first and recommended defaults second.
- Updated generated CLAUDE and Cursor templates so new projects inherit the lower-noise product workflow.

---

## v1.5.0 (2026-06-03)

### Versioned Update Log System

- Added setup-time version style selection: Semantic (`v0.1.0`), Codename (`Project Name 0.1`), Patch (`Patch 1`), and Date (`2026.06.1`).
- Updated the update-log protocol to calculate the next milestone version from the selected style instead of assuming semantic versioning.
- Clarified that user project versions are independent from project-butler's own release version.
- Updated README, Chinese README, examples, compatibility docs, continue protocols, skill metadata, generated CLAUDE template, Cursor template, and upgrade rules so public documentation and execution guidance match the current memory stack: `DOCS.md`, `docs/`, document archiving, full context recovery, and version style selection.
- Corrected generated project templates to describe the current 7-component system: Constitution, Wiki, Structure, Update Log, Docs, Log, and TODO.
- Hardened upgrade rules so legacy 4/5/6-component projects upgrade directly to the current 7-component model, and removed local `references/` paths from generated user-project instructions.
- Adjusted the full-context recovery protocol so it reuses continue's reading steps without emitting the shorter continue summary before the full overview.
- Replaced brittle internal step-number references in document archiving, update-log, and upgrade guidance with semantic phase ordering, and normalized generated end-session flows to continuous 1-10 numbering.
- Made generated CLAUDE and Cursor templates more self-contained by replacing external protocol-name references with concise executable behavior.
- Added explicit main-skill routing for review claude, sync wiki, status, and wrap-up/end-session synonyms so documented triggers are executable.
- Aligned status trigger guidance across the main skill, generated CLAUDE template, and Cursor rules to include TODO and latest update-log context.
- Clarified CLAUDE.md promotion rules so review claude can write user-confirmed candidates without contradicting the no-automatic-promotion safety rule.
- Removed remaining internal glossary/protocol references from generated user-project templates and aligned end-session wording with wrap-up synonyms.
- Clarified upgrade safety language: existing files are never replaced wholesale, but user-confirmed targeted patches to system sections are allowed.
- Clarified Cursor upgrade behavior so existing custom project rules are preserved while missing project-butler sections can be offered as targeted patches.
- Made the generated `DOCS.md` template build sections directly from selected document types instead of relying on deleting unselected sample sections.
- Aligned public status, compatibility, and example docs with the expanded status/context and log-compaction behavior.
- Reworded internal reference guidance so language change, document archiving, update-log, and file-reorganization references describe executable workflows rather than relying on repository-local names.

---

## v1.4.1 (2026-06-02)

### Bug Fixes: Cross-Reference + Flow Consistency

Six rounds of testing (static analysis + deep flow tracing + edge cases + template consistency + path tracing + init simulation) found and fixed 20 bugs:

**Round 1 — Cross-reference consistency:**
- STRUCTURE.md template missing `docs/` in exclusion list (file reorganization could misplace documents)
- update-log.md positioning description outdated ("between file reorganization" → "between document archiving")
- Component count updated from 5 → 6 (DOCS.md is now a standalone component)
- Cursor template triggers table missing "document archiving" in end session description

**Round 2 — Deep flow tracing:**
- SKILL.md architecture diagram missing DOCS.md in middle layer
- Language Change Protocol missing DOCS.md in file rewrite list (language switch would leave DOCS.md untranslated)
- Document archiving step 3 doesn't update `.file-snapshot.json` after moving files (next Mode B run would re-process them)
- document-archiving.md DOCS.md template lacks `{{PROJECT_NAME}}` prefix vs init Template 9 — clarified fallback vs init usage
- Inlined Q7 document type recommendation logic in SKILL.md Step 2 (was only in document-archiving.md, loaded too late)

**Round 3 — Edge cases + continue flow gaps:**
- `continue.md` and `continue-full-context.md` don't read `session-handoff.md` or `PROJECT.md` — the very files maintained for cross-session recovery
- Fresh init doesn't create `.claude/.file-snapshot.json` — first end session's Mode B would fail without diff baseline
- Init Step 4 output report and trigger cheat sheet incomplete (missing `.file-snapshot.json` and 2 trigger words)
- Upgrade Report template missing UPDATE_LOG.md and Coding Guidelines entries

**Round 4 — Template consistency + Cursor parity:**
- Document archiving Step 1 exclusion list missing `DOCS.md` — could try to archive the index file itself
- CLAUDE.md Template 1 Session Start Protocol only reads PROJECT.md, not session-handoff.md (Cursor template correctly reads both)
- Cursor Template 6 description missing "change language" trigger word

**Round 5 — Path tracing + system file completeness:**
- file-reorganization.md Phase 4 safety checks + Important Constraints missing DOCS.md (could be moved during file reorganization)
- language-change.md step 3 missing UPDATE_LOG.md (language switch leaves "更新日志" untranslated)
- Cursor Template 6 Session Start missing language check instruction (Cursor users bypass language setting)

**Round 6 — Init simulation + variable audit:**
- `{{GITHUB_LINK_LINE}}` variable used in PROJECT.md but missing from top-level Variable Replacements table
- CLAUDE.md Template 1 trigger table missing "continue" and "continue full context" entries (undiscoverable for users)

---

## v1.3.0 (2026-06-01)

### Four-Phase File Reorganization

Replaced template-based file reorganization with a project-understanding-driven flow.

**Mode A redesign (整理文件):**
- Four-phase flow: Discover → Ask or Plan → Plan → Execute
- Phase 1 (Discover): structural signals first (glob/grep/imports), content reading only for uncertain files, then relationship inference to build a module map
- Phase 2 (Ask or Plan): three-tier confidence routing — high confidence skips straight to plan, medium confidence (most common) focuses on specific issues, low confidence asks user about organizing dimensions
- Phase 3 (Plan): clear proposal with moves, renames, unchanged sections, and suggested cleanup — user confirms before any action
- Phase 4 (Execute): safe execution with cross-reference checks, name collision detection, and `git mv` for history preservation
- Early exit: well-organized projects skip directly, no empty plan forced

**STRUCTURE.md template redesign:**
- Replaced four fixed templates (code/video/document/mixed) with discovery-based rule generation
- Initialization now runs lightweight project analysis to generate rules from actual file patterns
- Fallback to minimal template for empty projects

**Safety:**
- Never-delete policy: suspected temp/cache/duplicate files are flagged in "Suggested Cleanup" for user review, never removed by AI

---

## v1.2.1 (2026-05-09)

### Skill Loader Compatibility
- Moved continue recovery guides from nested `SKILL.md` files into `references/continue.md` and `references/continue-full-context.md`
- Shortened the main skill description to stay within loader metadata limits
- Kept `continue` and `continue full context` routed through the main project-butler skill, with no independent sub-skills

---

## v1.2.0 (2026-05-05)

### Update Log Auto-Tracking
- Auto-detect significant updates at end session (new features, major changes, 3+ file changes, milestones, important TODO completions)
- New `UPDATE_LOG.md` — milestone-level change history between session logs and project wiki
- GitHub Release integration — optional release creation for significant updates
- README link integration during init (non-intrusive, link-only)
- Supports both code and non-code projects
- Full protocol: `references/update-log.md` with significance criteria, format, and 6 Common Mistakes
- Cross-file consistency: SKILL.md (9-step end session), CLAUDE.md template, Cursor template, PROJECT.md template, upgrade-mode, language-adaptation all updated

---

## v1.1.0 (2026-05-04)

### SKILL.md Refactor + Continue Rename
- SKILL.md refactored from 1175 → 196 lines with on-demand reference loading
  - Heavy content split into `references/` (6 files): file-templates, language-adaptation, file-reorganization, log-compaction, language-change, upgrade-mode
  - Common Mistakes distributed into each reference file for context-relevant guidance
  - 70% token reduction for common triggers (end session, organize files, language change)
- Renamed `/resume` → `continue`, `/resume-full` → `continue full context`
  - Routed through main SKILL.md Step 0 (no independent sub-skills)
  - Avoids conflict with Claude Code's built-in `/resume` command
- All triggers now natural language — just say it and the AI routes to the right workflow
  - Added trigger words to SKILL.md description field for reliable matching
- Updated both READMEs (EN/ZH) with natural language trigger documentation

## v1.0.0 (2026-05-01)

### Session Recovery
- **`/resume`** — Original session recovery trigger; renamed to `continue` in v1.1.0
- **`/resume-full`** — Original full trajectory recovery trigger; renamed to `continue full context` in v1.1.0
- Both recovery workflows included in the repo — no separate installation needed

### Log Compaction Protocol
When session logs exceed 10 files, automatically compact older logs into a single summary file. Keeps the `log/` directory bounded without losing history.

## v0.4.0 (2026-04-29)

### Multi-Language + File Management
- 3 language modes: English, Chinese, bilingual with language-aware file naming
- Deep organize vs incremental organize for file reorganization
- Language Change Protocol with on-the-fly switching
- Added "end session" / "收工" as triggers for full end-of-session protocol

## v0.3.0 (2026-04-27)

### Constitution + File Manager
- Added STRUCTURE.md as 5th component for intelligent file management
- Constitution candidate system — AI collects rules, human confirms
- Added "organize files" as direct trigger for file reorganization

## v0.2.0 (2026-04-25)

### README Rewrite + Chinese Support
- Rewrote README with problem statement, design philosophy, component deep-dives
- Added Chinese README (`README_zh.md`) with language switcher
- Added Karpathy Guidelines to CLAUDE.md template

## v0.1.0 (2026-04-24)

### Initial Release
- Project memory stack: session logs, project wiki, constitution, file manager, execution checklist
- Multi-tool support foundation with Claude Code native skill and Cursor project rules
- One-command setup with upgrade mode
