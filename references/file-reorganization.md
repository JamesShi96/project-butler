# File Reorganization Protocol

> Loaded during: end session (Mode B), "整理文件" / "organize files" (Mode A).

Two modes with different depth levels, triggered by different commands.

## Mode A: Deep Organize (深度整理)

**Trigger:** "整理文件" / "organize files"

**Philosophy:** Content-aware, OCD-level reorganization. Read every file, understand what it is, enforce naming consistency and structural uniformity across the entire project.

**Prerequisites:**
- Read STRUCTURE.md if it exists
- Read `.claude/.file-snapshot.json` if it exists

**Flow:**

```
1. Full Scan: recursively list all project files
   - Exclude: directories listed in STRUCTURE.md 排除规则 (or defaults)
   - Default exclusions: .git/, node_modules/, __pycache__/, .venv/, dist/, build/, vendor/, .claude/, log/

2. Content Understanding Phase:
   For EACH file in the project (not just new ones):
   a. Read the file content (for .md files; for binary files like .pdf/.png, infer from filename + context)
   b. Classify: what is this file? (company intro? project spec? template? meeting notes?)
   c. Identify naming issues:
      - Does the filename match the STRUCTURE.md 命名规范?
      - Are there spaces, special characters, or inconsistent case?
      - Does it have redundant prefixes (e.g., company name in a file already inside the company folder)?
      - Is the extension duplicated (e.g., .pdf.pdf)?
      - Does the filename follow the language-appropriate naming convention from STRUCTURE.md?
   d. Identify structural issues:
      - Is it in the correct directory per STRUCTURE.md rules?
      - Should it be in a subdirectory (assets/, reference-answers/)?
      - Are sibling directories inconsistent?

3. Reorganization Phase:
   a. Fix naming: rename files to match STRUCTURE.md conventions
   - Apply language-appropriate naming
   b. Fix structure: move files to correct directories, create subdirectories if needed
   c. Enforce cross-directory consistency
   d. For files with no matching rule:
      - Analyze content to infer category
      - If inferable: add new rule to STRUCTURE.md + place file
      - If not: add to 待分类 section

4. Reference Update Phase:
   a. After each rename/move: grep for old path in all .md files
   b. Update any broken links (markdown links, imports, config references)
   c. Check master/index documents for outdated references

5. Safety checks before each file move:
   a. Cross-reference check: grep for old path in other files
      - If references found: update them
   b. Name collision check: does target already have a same-name file?
      - If yes: do NOT overwrite → add to 待分类 with collision note
   c. System file check: never move CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md

6. Update artifacts:
   a. Update .claude/.file-snapshot.json (full refresh)
   b. Update STRUCTURE.md:
      - Add any new naming conventions discovered
      - Add new rules for previously uncategorized files
      - Update 整理历史
   c. Update PROJECT.md file structure section if layout changed

7. Report:
   - Files renamed (with before → after)
   - Files moved (with before → after)
   - Broken links fixed
   - New STRUCTURE.md rules added
   - Files in 待分类 (if any)
```

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
| Moving files without checking cross-references | Always grep for imports/links to old path and update them |
| Overwriting files on name collision | If same-name file exists at target, flag for manual resolution instead |
| Moving management files (CLAUDE.md, PROJECT.md, etc.) | These must stay at project root. Never reorganize them |
| Using bare mv instead of git mv | In git repos, use git mv to preserve history |
| Removing user-written STRUCTURE.md rules | Only add new rules. Never remove without confirmation |
| Creating STRUCTURE.md rules without scanning project | Rules must be based on actual file analysis, not generic templates |
| Running file reorganization on excluded directories | Always check exclusion list before any file operation |
| Using Mode A (deep) when Mode B (incremental) was triggered | "收工" → Mode B. "整理文件" → Mode A. Never mix them. |
| Re-reading unchanged files in Mode B | Mode B only processes files NOT in .file-snapshot.json |
| Doing content-aware naming in Mode B | Mode B only places new files. Renaming existing files is Mode A's job. |
| Not reading file contents in Mode A | Mode A MUST read each file to understand it |
| Not checking cross-directory consistency in Mode A | Mode A should detect inconsistencies between sibling directories |
