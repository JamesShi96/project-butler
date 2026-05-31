# File Reorganization Protocol

> Loaded during: end session (Mode B), "整理文件" / "organize files" (Mode A).

Two modes with different depth levels, triggered by different commands. Mode A is a four-phase flow. Mode B is lightweight incremental.

## Mode A: Four-Phase Organize (四阶段整理)

**Trigger:** "整理文件" / "organize files"

**Philosophy:** Understand the project before touching anything. Analyze files, infer structure, let the user confirm the plan, then execute.

**Prerequisites:**
- Read STRUCTURE.md if it exists
- Read `.claude/.file-snapshot.json` if it exists
- Read PROJECT.md if it exists (for known module info)

**Flow:**

```
Phase 1: Discover   → scan + mixed analysis → module map + confidence
Phase 2: Ask or Plan → low confidence: ask organizing dimensions
                     → high confidence: go straight to plan
Phase 3: Plan       → show plan → user confirms
Phase 4: Execute    → move/rename/create + update references + update management files
```

### Phase 1: Discover (Project Discovery)

**Goal:** Understand every file's role, module affiliation, and inter-file relationships.

**Step 1: Structural signal scan (all files, no content reading)**

Fast operations — glob, grep, file type detection only:

- File type distribution (.ts, .py, .md, .json, .mp4, ...)
- Directory hierarchy and existing groupings
- Naming patterns (kebab-case, PascalCase, Chinese, dates, client names, ...)
- Import/require relationships (grep for import/require patterns)
- File size outliers (very large or very small files may indicate different roles)

Output: quick classification + list of uncertain files.

**Step 2: Content understanding (only uncertain files)**

Read file content only for files where Step 1 could not determine:
- Files with no clear type indicator
- Files in the project root with ambiguous names
- .md and .json files (could be config, docs, data, or metadata)
- Files with unexpected naming patterns

Do NOT re-read files already clearly classified by Step 1.

**Token control:** If the project has over 200 files, sample per directory in Step 2 rather than reading every uncertain file.

**Step 3: Relationship inference**

From the import grep results and file proximity:
- Which files import each other (belong to the same module)
- Which files are shared utilities or configs
- Which files are standalone resources

**Output: Module Map** — present this to yourself (not to the user yet):

```
Project Type: {code / video-production / business-docs / mixed / other}

Identified Modules:
| Module | File Count | Core Files | Description |
|--------|-----------|------------|-------------|

Unaffiliated Files:
| File | Inferred Purpose | Confidence |
|------|-----------------|------------|

Existing Structure Assessment:
- Reasonable: {what's already well-organized}
- Needs improvement: {what's scattered or misplaced}
```

**Confidence assessment:**

After generating the module map, assess overall confidence:
- **High confidence**: standard project type, files have clear module affiliations, naming is consistent, existing structure is mostly sound. Examples: typical Node.js project with src/ + tests/ + docs/.
- **Low confidence**: ambiguous project type, many unaffiliated files, multiple plausible organizing dimensions exist, non-standard file types. Examples: AIGC team files that could be organized by client/type/date, mixed media projects.

### Phase 2: Ask or Plan

**If low confidence**, present the dimension question to the user:

```
## File Distribution Found

File types: {distribution summary}
Date range: {if applicable}
Client/project clues: {if found in filenames}

## Suggested Organizing Dimensions

A. {dimension 1} (recommended)
   {example structure}

B. {dimension 2}
   {example structure}

C. {dimension 3}
   {example structure}

D. Two-level combination (e.g., {dim 1} → {dim 2})
   {example structure}

How would you like to organize? You can also describe your own approach.
```

Rules:
- AI suggests 2-3 reasonable dimensions based on discovery results, ranked by likelihood
- User can pick one, combine multiple levels, or describe their own
- The chosen dimension feeds into Phase 3

**If high confidence**, skip directly to Phase 3. The plan will always explicitly state the organizing dimension used — the user can catch misjudgments there.

### Phase 3: Plan (Structure Proposal)

Present the plan for user review:

```
## Directory Structure Plan

Organizing dimension: {by module / by client / by type / ...}

### New Directories
+ {new dirs to create}

### File Moves
→ {old path} → {new path}

### File Renames
→ {old name} → {new name}

### Unchanged
✓ {dirs/files that stay as-is}

### STRUCTURE.md Rule Updates
| Path | Purpose | Match Condition | Naming Convention |
|------|---------|-----------------|-------------------|

---
Confirm this plan? (confirm / partial modify / abandon)
```

Key rules:
- Operations separated by type — user sees at a glance what will change
- Unchanged sections explicitly listed — gives user confidence
- STRUCTURE.md rules shown inline — one confirmation covers both
- User can partially modify: "don't touch X, do the rest"

Wait for explicit user confirmation before proceeding to Phase 4.

### Phase 4: Execute

**Execution order:**

```
1. Create new directories        → mkdir -p
2. Move files                    → git mv (preserves git history)
3. Rename files                  → git mv
4. Fix references                → grep old paths → update .md, imports, config
5. Clean empty directories       → remove dirs that became empty
6. Update management files:
   - STRUCTURE.md                → replace with plan's rule table
   - .file-snapshot.json         → full refresh
   - PROJECT.md                  → update file structure section
```

**Safety checks before each file move:**
- Cross-reference check: grep for old path in other files, update if found
- Name collision check: does target already have a same-name file? If yes → flag, do NOT overwrite
- System file check: never move CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md, UPDATE_LOG.md

**Report:**
- Files moved (with before → after)
- Files renamed (with before → after)
- Directories created
- References updated
- Files in 待分类 (if any)

---

## Mode B: Incremental Organize (增量整理)

**Trigger:** "收工" / "end session" / "结束会话" (embedded in end session protocol)

**Philosophy:** Lightweight maintenance. Only process files that are new or changed since last snapshot. Fast, minimal token usage.

**Prerequisites:**
- Read `.claude/.file-snapshot.json` (required — this is the diff baseline)
- Read STRUCTURE.md for rules (no need to read all file contents)

**Flow:**

```
1. Diff Scan:
   a. List all project files recursively (same exclusions as Mode A)
   b. Compare against .file-snapshot.json
   c. Identify ONLY:
      - New files (not in snapshot)
      - Moved/renamed files (path changed)
   d. Skip all files that are already in snapshot with same path

2. If no new/changed files → skip to step 5 (just update timestamp)

3. Quick Classify (for NEW files only):
   For each new file:
   a. Read content (only if needed to determine category — skip if filename is obvious)
   b. Match against existing STRUCTURE.md rules
   c. If match: place file in target directory with correct naming
   - Apply language-appropriate naming from STRUCTURE.md conventions
   d. If no match:
      - Brief content scan to infer category
      - If inferable: add rule + place file
      - If not: add to 待分类

4. Safety checks (same as Mode A):
   - Cross-reference check before moves
   - Name collision check
   - System file check

5. Update .claude/.file-snapshot.json:
   - Add new files
   - Update paths for moved files
   - Remove entries for deleted files

6. Report (in end session summary):
   - Number of new files organized
   - Any new rules added
```

**Token optimization rules:**
- **NEVER re-read files already in snapshot** unless specifically investigating an issue
- **NEVER do cross-directory consistency checks** — that's Mode A's job
- **NEVER rename existing files** — only place new ones
- **NEVER rename files to a different language in Mode B** — language-based renaming only happens in Mode A or via the Language Change Protocol
- If STRUCTURE.md doesn't exist: fall back to Mode A (need to establish baseline first)

---

## Important Constraints

- **Never move management files**: CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md stay at project root
- **Never move files in exclusion list**: .git/, node_modules/, etc.
- **Preserve git history**: use `git mv` when in a git repo, not bare `mv`
- **Update references**: after moving a file, search for and update any imports/links to its old path
- **No overwrites**: if target has a same-name file, flag instead of clobbering
- **Respect human edits**: if user manually modified STRUCTURE.md rules, honor them. Only add new rules, never remove user-written rules without confirmation

## Common Mistakes

| Mistake | Correct Behavior |
|---------|-----------------|
| Skipping Phase 1 and going straight to organizing | Always run Discover first. Understanding the project is not optional. |
| Not asking about organizing dimensions when confidence is low | Low confidence means the AI genuinely cannot determine the right structure. Ask the user. |
| Showing a plan without labeling the organizing dimension | Every plan must state its dimension (by module, by client, by type, etc.) so the user can verify. |
| Executing Phase 4 without explicit user confirmation | The plan is a proposal. Wait for the user to say yes (or partially modify) before touching files. |
| Moving files without checking cross-references | Always grep for imports/links to old path and update them |
| Overwriting files on name collision | If same-name file exists at target, flag for manual resolution instead |
| Moving management files (CLAUDE.md, PROJECT.md, etc.) | These must stay at project root. Never reorganize them |
| Using bare mv instead of git mv | In git repos, use git mv to preserve history |
| Removing user-written STRUCTURE.md rules | Only add new rules. Never remove without confirmation |
| Using Mode A (deep) when Mode B (incremental) was triggered | "收工" → Mode B. "整理文件" → Mode A. Never mix them. |
| Re-reading unchanged files in Mode B | Mode B only processes files NOT in .file-snapshot.json |
| Doing content-aware naming in Mode B | Mode B only places new files. Renaming existing files is Mode A's job. |
| Reading every file content in Step 1 of Discover | Step 1 is structural signals only (glob/grep). Content reading is Step 2, only for uncertain files. |
| Not falling back to Mode A when STRUCTURE.md is missing in Mode B | If STRUCTURE.md doesn't exist, Mode B cannot function. Fall back to Mode A. |
