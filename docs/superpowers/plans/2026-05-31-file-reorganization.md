# File Reorganization Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace template-based file reorganization with a four-phase flow that truly understands the project before organizing.

**Architecture:** Mode A (deep organize) becomes Discover → Ask or Plan → Plan → Execute. Mode B (incremental) unchanged. Initialization gains a discovery step for STRUCTURE.md generation.

**Tech Stack:** Markdown prompt files only. No code.

**Spec:** `docs/superpowers/specs/2026-05-31-file-reorganization-design.md`

---

### Task 1: Rewrite Mode A in file-reorganization.md

**Files:**
- Modify: `references/file-reorganization.md`

Replace the entire Mode A section (lines 7–75) with the four-phase flow. Keep Mode B, Important Constraints, and Common Mistakes sections — but update Common Mistakes to reflect the new flow.

- [ ] **Step 1: Write the new Mode A content**

Replace lines 7–75 (from `## Mode A: Deep Organize` to the closing triple-backtick before `---`) with:

```markdown
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
```

- [ ] **Step 2: Update Common Mistakes table**

Replace the entire Common Mistakes table (lines 146–161) with:

```markdown
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
```

- [ ] **Step 3: Verify Mode B, Important Constraints, and header are preserved**

Re-read the file and confirm:
- Line 1: `# File Reorganization Protocol` — unchanged
- Lines 1–3: header — unchanged
- Lines 5–6: `Two modes...` — update to `Two modes with different depth levels, triggered by different commands. Mode A is a four-phase flow. Mode B is lightweight incremental.`
- Mode B section — completely unchanged
- Important Constraints section — completely unchanged

- [ ] **Step 4: Commit**

```bash
git add references/file-reorganization.md
git commit -m "refactor: replace Mode A with four-phase file reorganization flow"
```

---

### Task 2: Rewrite Template 7 in file-templates.md

**Files:**
- Modify: `references/file-templates.md`

Replace the STRUCTURE.md template generation logic (lines 395–482) to use discovery-based rules instead of four fixed templates.

- [ ] **Step 1: Replace Template 7 and its rule generation logic**

Replace lines 395–482 (from `## Template 7: STRUCTURE.md` to the line before `## Template 8: UPDATE_LOG.md`) with:

```markdown
## Template 7: STRUCTURE.md

Adapt headers and column names using the STRUCTURE.md glossary. The 命名规范 column values change based on language setting.

```
# {{PROJECT_NAME}} — 文件管理结构

> 最后更新：{{DATE}}

## 项目类型
{{determined by module map — see Rule Generation below}}

## 排除规则
以下目录/文件不参与整理：
- .git/
- node_modules/
- __pycache__/
- .venv/
- dist/
- build/
- vendor/
- .claude/
- log/
- log/summaries/
- log/archive/
- {{项目自定义排除}}

## 目录规则

| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| （AI 根据项目分析自动生成） | | | （kebab-case / 中文 / PascalCase 等） | |

## 待分类
以下文件尚未归类（下次整理时处理）：
- （暂无）

## 整理历史
| 日期 | 操作 | 文件数 |
|------|------|--------|
| {{DATE}} | 初始化结构 | 0 |
```

**Rule generation logic:**

When creating STRUCTURE.md during initialization:

1. **Run a lightweight discovery** — scan all files in the project (excluding the default exclusion list):
   - File type distribution (glob only, no content reading)
   - Existing directory structure
   - Naming patterns in filenames
   - If the project has import/require patterns, grep for module boundaries

2. **Generate rules from discovery** — based on what you actually found, not generic templates:
   - For each distinct file group (by type, by directory, by naming pattern), create a row in the directory rules table
   - Match condition: describe what files belong here (file extensions, name patterns, content keywords)
   - Naming convention: based on the language setting and what the existing files already use
   - Priority: lower number = higher priority when a file matches multiple rules

3. **If the project is empty** (no files yet), use a minimal starter rule based on the project type determined from user answers in Step 2:
   - If the one-line description mentions code/software: create a minimal src/ rule
   - Otherwise: leave the rules table empty with a note "（AI will populate rules after project files are created）"

4. **Language-specific naming rules:**

When `en`: all user file names use kebab-case or snake_case, English only.
When `zh`: all user file names can use Chinese characters, no restriction to ASCII.
When `bilingual`: English naming preferred; Chinese names acceptable for docs and content files.
```

- [ ] **Step 2: Verify Template 8 (UPDATE_LOG.md) is preserved**

Read the file starting from `## Template 8` and confirm it's unchanged.

- [ ] **Step 3: Commit**

```bash
git add references/file-templates.md
git commit -m "refactor: replace STRUCTURE.md template with discovery-based generation"
```

---

### Task 3: Update SKILL.md trigger A

**Files:**
- Modify: `SKILL.md`

- [ ] **Step 1: Update trigger A description**

Replace lines 46–49:

```
**A. "整理文件" / "organize files":**
1. Read `references/file-reorganization.md`
2. Execute **Mode A: Deep Organize**
3. Report and stop
```

With:

```
**A. "整理文件" / "organize files":**
1. Read `references/file-reorganization.md`
2. Execute **Mode A: Four-Phase Organize** (Discover → Ask or Plan → Plan → Execute)
3. Report and stop
```

- [ ] **Step 2: Commit**

```bash
git add SKILL.md
git commit -m "docs: update file reorganization trigger to reference four-phase flow"
```

---

### Task 4: Cross-file consistency verification

**Files:**
- Read: `SKILL.md`, `references/file-reorganization.md`, `references/file-templates.md`, `references/upgrade-mode.md`

- [ ] **Step 1: Verify SKILL.md reference table**

Read SKILL.md lines 196–204 (Reference Loading table). Confirm:
- Row for "整理文件 / organize files" still says `references/file-reorganization.md`
- Row for "Init (fresh)" still says `references/file-templates.md`
- No other rows reference "Mode A" or "Deep Organize"

If any row references "Mode A: Deep Organize", update it to "Mode A: Four-Phase Organize".

- [ ] **Step 2: Verify upgrade-mode.md doesn't conflict**

Read `references/upgrade-mode.md`. Confirm:
- Rule 7 (STRUCTURE.md): "create if missing" logic still works — the new discovery-based template is compatible because the template structure (headers, tables, sections) is the same, only the rule generation logic changed
- No references to "four templates" or "code/video/document/mixed" template types that would be stale

If stale references exist, update them.

- [ ] **Step 3: Verify end session flow in SKILL.md**

Read SKILL.md lines 75–95 (End Session Flow). Confirm:
- Step 7 still says "File reorganization (incremental) → read references/file-reorganization.md, execute Mode B"
- No reference to "Mode A" in the end session flow

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: ensure cross-file consistency after file reorganization redesign"
```

If no fixes were needed, skip this step.
