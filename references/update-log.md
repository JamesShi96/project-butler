# Update Log Protocol

> Loaded during: end session, after document archiving and before output summary.

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

## Version Styles

During init (Q8), the user selects a version naming style. This is stored as metadata in UPDATE_LOG.md:

<!-- version-style: semantic -->
<!-- version-codename: {prefix} -->  ← only for codename style

### Style Formats

| Style | Format | Starting Version | Example Progression |
|-------|--------|-----------------|---------------------|
| semantic | `v{M}.{m}.{p}` | `v0.1.0` | v0.1.0 → v0.1.1 → v0.2.0 → v1.0.0 |
| codename | `{prefix} {M}.{m}` | `{prefix} 0.1` | Atlas 0.1 → Atlas 0.2 → Atlas 1.0 |
| patch | `Patch {n}` | `Patch 1` | Patch 1 → Patch 2 → Patch 3 |
| date | `YYYY.MM.{n}` | `{current month}.1` | 2026.06.1 → 2026.06.2 → 2026.07.1 |

For codename style, `{prefix}` defaults to the project name (Q1 answer).

### Bump Level Determination

When a session is judged significant, determine the bump level from the session's changes:

| Level | Signals |
|-------|---------|
| Major | Architecture changes, breaking changes, core rewrites |
| Minor | New features, new modules, significant additions |
| Patch | Bug fixes, doc updates, small optimizations, config changes |

### Version Calculation Per Style

| Style | Major | Minor | Patch |
|-------|-------|-------|-------|
| semantic | `v{M+1}.0.0` | `v{M}.{m+1}.0` | `v{M}.{m}.{p+1}` |
| codename | `{prefix} {M+1}.0` | `{prefix} {M}.{m+1}` | skip |
| patch | `Patch {n+1}` | `Patch {n+1}` | skip |
| date | `YYYY.MM.{n+1}` | `YYYY.MM.{n+1}` | skip |

**Rules:**
- Codename and Patch styles skip patch-level changes (too minor for these formats)
- Date style: parse month from current version. Same month → increment counter. Different month → reset to 1
- When uncertain about level, default to Minor

### Version Parsing

At the update-log evaluation stage of end session, if the session is significant:

1. Read `UPDATE_LOG.md`
2. Parse `<!-- version-style: X -->` metadata
3. If codename style, parse `<!-- version-codename: X -->`
4. Parse current version from the first `##` heading
5. Determine bump level from session changes
6. Calculate new version using the table above
7. Write the versioned entry (new format below)

## UPDATE_LOG.md Format

### Version Metadata Comments (top of file, before first entry)

```markdown
<!-- version-style: semantic -->
```
```markdown
<!-- version-style: codename -->
<!-- version-codename: Atlas -->
```
```markdown
<!-- version-style: patch -->
```
```markdown
<!-- version-style: date -->
```

### Entry Format

```markdown
# Update Log

<!-- version-style: semantic -->

## v0.2.0 (2026-06-02)

### Minor: {one-line title}

- {change 1}
- {change 2}

---

## v0.1.0 (2026-05-30)

### Minor: {one-line title}

- {change 1}

---
```

Rules:
- **New entries prepend to top** (latest first)
- **Version heading**: `## {version} (YYYY-MM-DD)` — version from bump logic, date from today
- **Level sub-heading**: `### {Major|Minor|Patch}: {title}` — level from bump determination, title distilled from session log key actions
- **Bullets**: concise, reader-facing descriptions (not internal notes — written for someone reading the project)
- **Separator**: `---` between entries
- **Language**: follows project CLAUDE.md Language setting (en / zh / bilingual)

### Legacy Format

If UPDATE_LOG.md has no `<!-- version-style: X -->` metadata, it was created before the version system. Treat as pre-version and:
1. Add the version-style metadata line at the top
2. Continue writing new entries in the versioned format above
3. Leave existing entries unchanged

## Writing Flow

When triggered during end session update-log evaluation:

1. **Read the session log** just written in step 1
2. **Evaluate significance** using the criteria above
3. **If significant:**
   a. Generate a title and bullet list from the session's key actions and output files
   b. Parse version style and current version from UPDATE_LOG.md metadata
   c. Determine bump level (major/minor/patch) based on session changes
   d. Calculate new version per the style's rules (see Version Calculation Per Style above)
   e. Read existing `UPDATE_LOG.md` (if any)
   f. Prepend the versioned entry to the top
   g. Write the updated file
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
- **Tag**: use the new version calculated from the bump logic
- **Title**: same as the update log entry title
- **Body**: the bullet list from the update log entry
- **Command**: `gh release create {tag} --title "{title}" --notes "{body}"`

If `gh` is not available or no remote exists, skip silently.

## Language Adaptation

Title and bullet language follows the project's CLAUDE.md Language setting. Use normal localized wording for update-log headings, bump labels, and status text.

## Common Mistakes

| # | Mistake | Correct Behavior |
|---|---------|-----------------|
| 1 | Writing update log entries for every session regardless of significance | Only write when significance criteria are met. Skip silently otherwise. |
| 2 | Using internal jargon in bullet points (e.g., "refactored FooBar class") | Write reader-facing descriptions: "Improved data processing pipeline reliability." |
| 3 | Appending new entries to the bottom of UPDATE_LOG.md | Prepend to top — latest entries first. |
| 4 | Overwriting existing UPDATE_LOG.md content | Read existing content, prepend new entry, write full file. |
| 5 | Creating GitHub Release without asking | Always ask the user first. Creating a release is a visible public action. |
| 6 | Modifying README during end session | README link is only added during init. End session never touches README. |
| 7 | Using project-butler's own version (v1.5.0) as the user project version | The user project version is independent. Read it from UPDATE_LOG.md metadata. |
| 8 | Defaulting to Patch bump when unsure | Default to Minor. It's better to over-version than under-version. |
