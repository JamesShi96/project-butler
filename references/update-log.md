# Update Log Protocol

> Loaded during: end session (step 8, between file reorganization and output summary).

## Purpose

Automatically detect significant updates during a session and record them in `UPDATE_LOG.md` — a user-facing change history that sits between session logs (raw facts) and PROJECT.md (current snapshot).

```
Session logs (per-session)  →  Update Log (per-milestone)  →  PROJECT.md (current state)
```

## Significance Criteria

After writing the session log (step 1), evaluate it against these criteria. **Any one match = significant update.**

| Signal | Example |
|--------|---------|
| New feature / module | Added a new capability, page, or file group |
| Major modification | Core logic, architecture, or key files changed substantially |
| 3+ files created or modified | Scope is broad enough to not be a minor tweak |
| User called it a milestone | User said "milestone", "version", "major update", "里程碑", "重大更新" etc. |
| Important TODO completed | A task in TODO.md was checked off this session |

**Not significant:** single-file typo fix, formatting-only changes, routine maintenance, minor config tweaks.

**When uncertain, lean toward recording.** An extra entry costs nothing; a missed milestone loses history.

## UPDATE_LOG.md Format

```markdown
# Update Log

## YYYY-MM-DD — {one-line title}

- {change 1}
- {change 2}

---

## YYYY-MM-DD — {one-line title}

- {change 1}

---
```

Rules:
- **New entries prepend to top** (latest first)
- **Title**: distilled from session log key actions, written in the project's configured language
- **Bullets**: concise, reader-facing descriptions (not internal notes — written for someone reading the project)
- **Separator**: `---` between entries
- **Language**: follows project CLAUDE.md Language setting (en / zh / bilingual)

If the project uses version numbers (git tags, package.json version, etc.), optionally include the version:
```markdown
## v1.2.0 (2026-05-05) — {title}
```

## Writing Flow

When triggered at end session step 8:

1. **Read the session log** just written in step 1
2. **Evaluate significance** using the criteria above
3. **If significant:**
   a. Generate a title and bullet list from the session's key actions and output files
   b. Read existing `UPDATE_LOG.md` (if any)
   c. Prepend the new entry to the top
   d. Write the updated file
4. **If not significant:** skip silently (no empty entries)
5. **GitHub Release check** (if applicable, see below)

## README Integration

During init (`/project-butler`), append a link to the bottom of the project's README.md:

- en: `For update history, see [UPDATE_LOG.md](UPDATE_LOG.md).`
- zh: `更新历史见 [UPDATE_LOG.md](UPDATE_LOG.md)。`
- bilingual: `更新历史见 [UPDATE_LOG.md](UPDATE_LOG.md)。`

If no README.md exists in the project, skip this step. End session does **not** modify README.

## GitHub Release Integration

After writing the update log entry, check if a GitHub Release should be created:

**Preconditions (all must be true):**
1. `git remote` output is non-empty (project has a remote)
2. This session was judged as a significant update
3. `gh` CLI is available

**If preconditions met:** ask the user:
> "This session includes significant changes. Create a GitHub Release?"

If user agrees:
- **Tag**: if user provides a version number, use it; otherwise use `YYYY-MM-DD`
- **Title**: same as the update log entry title
- **Body**: the bullet list from the update log entry
- **Command**: `gh release create {tag} --title "{title}" --notes "{body}"`

If `gh` is not available or no remote exists, skip silently.

## Language Adaptation

Title and bullet language follows the project's CLAUDE.md Language setting. Use the UPDATE_LOG glossary from `references/language-adaptation.md`.

## Common Mistakes

| # | Mistake | Correct Behavior |
|---|---------|-----------------|
| 1 | Writing update log entries for every session regardless of significance | Only write when significance criteria are met. Skip silently otherwise. |
| 2 | Using internal jargon in bullet points (e.g., "refactored FooBar class") | Write reader-facing descriptions: "Improved data processing pipeline reliability." |
| 3 | Appending new entries to the bottom of UPDATE_LOG.md | Prepend to top — latest entries first. |
| 4 | Overwriting existing UPDATE_LOG.md content | Read existing content, prepend new entry, write full file. |
| 5 | Creating GitHub Release without asking | Always ask the user first. Creating a release is a visible public action. |
| 6 | Modifying README during end session | README link is only added during init. End session never touches README. |
