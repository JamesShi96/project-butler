# Naming Conventions

Project Butler separates repository file names from generated project memory file names.

## Repository Files

Use `kebab-case` for repository-owned Markdown and reference files:

```text
docs/profile-system-simulation-report.md
references/project-profile-system.md
references/file-reorganization.md
```

Language variants use dot suffixes:

```text
README.md
README.zh.md
```

## Reserved Entry Points

These files keep ecosystem-standard names:

```text
README.md
LICENSE
SKILL.md
```

`SKILL.md` is intentionally uppercase because skill loaders discover that exact file name.

## Generated Project Memory Files

Project Butler creates several root-level memory files in user projects. These keep their established uppercase names because they are user-facing anchors and are referenced by generated project rules:

```text
CLAUDE.md
PROJECT.md
STRUCTURE.md
TODO.md
DOCS.md
UPDATE_LOG.md
```

Generated JSON state files use `kebab-case` under `.claude/`:

```text
.claude/project-profile.json
.claude/profile-pending.json
.claude/file-snapshot.json
```

For compatibility, existing projects that already have `.claude/.file-snapshot.json` should be read and migrated to `.claude/file-snapshot.json` during upgrade.

## Rule Of Thumb

If a file belongs to this repository, use `kebab-case` unless it is a reserved entry point. If a file is generated into the user's project root, use the documented memory-file name exactly.
