# Update Log

## v1.4.1 (2026-06-02)

### Bug Fixes: Cross-Reference + Flow Consistency

Two rounds of testing (static analysis + deep flow tracing) found and fixed 8 bugs:

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
