# File Reorganization Redesign — Spec

> Date: 2026-05-31
> Status: Draft
> Affects: `references/file-reorganization.md`, `references/file-templates.md`, `SKILL.md`

## Problem

The current file reorganization does not truly understand the project. It uses four generic templates (code/video/document/mixed) to generate STRUCTURE.md rules, and Mode A (deep organize) does not systematically analyze file content and relationships before planning. The result: AI creates superficial folder structures that don't reflect the project's actual organization needs.

This is a problem at all project stages: initialization (STRUCTURE.md is template-driven), mid-project (files scatter without intelligent reorganization), and mature projects (no mechanism to re-evaluate structure as the project evolves).

## Design

### Overview

Replace the current Mode A (deep organize) with a four-phase flow. Insert a project discovery step into initialization so STRUCTURE.md is generated from analysis, not templates. Mode B (incremental organize during end session) remains unchanged.

```
整理文件 trigger
    ↓
Phase 1: Discover     → scan + mixed analysis → module map + confidence
Phase 2: Ask or Plan  → low confidence: ask organizing dimensions
                       → high confidence: go straight to plan
Phase 3: Plan         → show plan (always labels organizing dimension) → user confirms
Phase 4: Execute      → move/rename/create + update references + update management files
```

### Phase 1: Discover (Project Discovery)

**Goal**: Understand every file's role, module affiliation, and inter-file relationships.

**Input**:
- All project files (excluding standard exclusions: .git/, node_modules/, dist/, build/, vendor/, .claude/, log/)
- Existing STRUCTURE.md (if any)
- Existing PROJECT.md (if any, for known module info)

**Three-step analysis**:

**Step 1: Structural signal scan (all files, no content reading)**

Fast operations only — glob, grep, file type detection:

- File type distribution (.ts, .py, .md, .json, .mp4, ...)
- Directory hierarchy and existing groupings
- Naming patterns (kebab-case, PascalCase, Chinese, dates, client names, ...)
- Import/require relationships (grep for import/require patterns)
- File size outliers (very large or very small files may indicate different roles)

Output: quick classification + uncertain files list.

**Step 2: Content understanding (only uncertain files)**

Read file content only for files where Step 1 could not determine:
- Files with no clear type indicator
- Files in the project root with ambiguous names
- .md and .json files (could be config, docs, data, or metadata)
- Files with unexpected naming patterns

Do NOT re-read files that are already clearly classified by Step 1.

**Step 3: Relationship inference**

From the import grep results and file proximity:
- Which files import each other (belong to the same module)
- Which files are shared utilities or configs
- Which files are standalone resources

**Output: Module Map**

```markdown
## Module Map

### Project Type
{code / video-production / business-docs / mixed / other — with reasoning}

### Identified Modules
| Module | File Count | Core Files | Description |
|--------|-----------|------------|-------------|
| auth | 5 | routes.ts, tokens.ts | Authentication module |
| api | 8 | server.ts, middleware.ts | API server |
| ... | | | |

### Unaffiliated Files
| File | Inferred Purpose | Confidence |
|------|-----------------|------------|
| config.json | Project config | High |
| notes.md | Unclear | Low |

### Existing Structure Assessment
- Reasonable: {what's already well-organized}
- Needs improvement: {what's scattered or misplaced}
```

**Confidence assessment**:

After generating the module map, assess overall confidence:
- **High confidence**: standard project type, files have clear module affiliations, naming is consistent, existing structure is mostly sound. Examples: typical Node.js project with src/ + tests/ + docs/, or a clearly organized video project.
- **Low confidence**: ambiguous project type, many unaffiliated files, multiple plausible organizing dimensions exist, non-standard file types. Examples: AIGC team files that could be organized by client/type/date, mixed media projects, business document collections.

**Token control**:
- Step 1 uses glob/grep only — minimal token cost
- Step 2 reads only uncertain files — typically a minority
- Projects over 200 files: Step 2 can sample per directory rather than reading every uncertain file
- Relationship inference is based on grep, not AST parsing

### Phase 2: Ask or Plan

**If low confidence**, present the dimension question:

```
## File Distribution Found

File types: 20 video files, 15 scripts, 8 design files
Date range: 2025-11 to 2026-05
Client/project clues: identified "Starbucks", "Nike", "Apple" in filenames

## Suggested Organizing Dimensions

A. By client/project (recommended)
   clients/starbucks/
   clients/nike/
   clients/apple/

B. By file type
   videos/
   scripts/
   designs/

C. By date
   2025-Q4/
   2026-Q1/
   2026-Q2/

D. Two-level combination (e.g., client → type)
   clients/starbucks/videos/
   clients/starbucks/scripts/

How would you like to organize? You can also describe your own approach.
```

Design decisions:
- AI suggests 2-3 reasonable dimensions based on what it discovered, ranked by likelihood
- User can pick one, combine multiple levels, or describe their own
- The AI then uses the chosen dimension to generate the plan

**If high confidence**, skip directly to Phase 3 (Plan). The plan will always explicitly state the organizing dimension used, so the user can catch misjudgments.

### Phase 3: Plan (Structure Proposal)

**Goal**: Present a clear, actionable plan for user review.

**Plan format**:

```
## Directory Structure Plan

Organizing dimension: {by module / by client / by type / ...}

### New Directories
+ api/auth/
+ api/core/
+ shared/utils/

### File Moves
→ src/auth.ts        → api/auth/routes.ts
→ src/tokens.ts      → api/auth/tokens.ts
→ src/helpers.ts     → shared/utils/helpers.ts

### File Renames
→ src/UserModel.ts   → src/models/user.model.ts

### Unchanged
✓ tests/            — well-organized
✓ package.json      — root config, stays

### STRUCTURE.md Rule Updates
| Path | Purpose | Match Condition | Naming Convention |
|------|---------|-----------------|-------------------|
| api/auth/ | Auth module | auth-related routes and tokens | kebab-case.ts |
| shared/utils/ | Shared utilities | cross-module utility functions | kebab-case.ts |

---
Confirm this plan? (confirm / partial modify / abandon)
```

**Key decisions**:
- Operations separated by type: new dirs, moves, renames, unchanged — user sees at a glance what will change
- Unchanged sections explicitly listed — gives user confidence that reasonable structures are preserved
- STRUCTURE.md rules shown inline — one confirmation covers both file operations and rule updates
- User can partially modify: "don't touch api/, do the rest"

### Phase 4: Execute

**Execution order**:

1. Create new directories → `mkdir -p`
2. Move files → `git mv` (preserves git history)
3. Rename files → `git mv`
4. Fix references → grep old paths → update all .md, import statements, config references
5. Clean empty directories → remove directories that became empty after moves
6. Update management files:
   - STRUCTURE.md → replace with the plan's rule table
   - .file-snapshot.json → full refresh
   - PROJECT.md → update file structure section

**Safety rules** (unchanged from current design):
- Never overwrite same-name files — flag for manual resolution
- Never move system management files (CLAUDE.md, PROJECT.md, etc.)
- Cross-reference check before every move
- Use `git mv` in git repos, bare `mv` otherwise

### Mode B (Incremental Organize) — No Changes

End session incremental organize continues to work as before:
- Diff against .file-snapshot.json
- Only process new/changed files
- Match against existing STRUCTURE.md rules
- Never rename existing files

### Initialization Integration

**Current**: Step 3 creates STRUCTURE.md using one of four templates (code/video/document/mixed).

**New**: Insert a lightweight discovery step between Step 2 and Step 3:

```
Step 1: Detect mode
Step 2: Ask questions
Step 2.5: Scan project files → generate module map  ← new
Step 3: Create files (STRUCTURE.md based on module map)
Step 4: Output report
```

At initialization, only the **Discover** phase runs — no file moves, no plan confirmation. The module map feeds directly into STRUCTURE.md rule generation, replacing the template-based approach.

If the project is empty (no files yet), fall back to a minimal template based on the project type determined from user answers in Step 2.

## Files Modified

| File | Change |
|------|--------|
| `references/file-reorganization.md` | Rewrite Mode A as four-phase flow (Discover → Ask or Plan → Plan → Execute). Keep Mode B unchanged. Update Common Mistakes table. |
| `references/file-templates.md` | Template 7 (STRUCTURE.md): replace four fixed templates with "generate from module map" instruction. Add fallback for empty projects. |
| `SKILL.md` | Step 0 trigger A description: update from "execute Mode A: Deep Organize" to "execute four-phase reorganization flow". |

## Not Modified

- `references/upgrade-mode.md` — upgrade logic (only add missing files) unchanged
- `references/language-adaptation.md` — glossary unchanged
- `references/log-compaction.md` — unrelated
- `references/update-log.md` — unrelated
- `references/continue.md` / `continue-full-context.md` — unrelated
- Mode B (incremental organize) — unchanged
- End session flow — unchanged
