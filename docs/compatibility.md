# Tool Compatibility

project-butler helps AI coding assistants remember a project between sessions. It is a product workflow first and a Claude Code skill second.

The native entry point is Claude Code today, but the output is intentionally file-based: Markdown files that live in your project and can be read by Claude Code, Cursor, Codex, or any other AI coding assistant.

## Compatibility Matrix

| Tool | Integration level | What works |
|---|---|---|
| Claude Code | Native skill | Full `/project-butler` flow, natural-language triggers, session logging, continuation, file organization, document archiving, language switching, versioned update logs, rule review, wiki sync, status summaries, and profile-aware setup/close behavior. |
| Cursor | Project rules, best-effort | project-butler can generate `.cursor/rules/project-system.mdc`, which points Cursor at the shared memory files, mirrors the main workflow triggers, and includes a manual update-check trigger. |
| Codex | `AGENTS.md`, best-effort | project-butler can generate `AGENTS.md`, which points Codex at the shared memory files, mirrors the main workflow triggers, and includes a manual update-check trigger. |
| Other AI assistants | File-based | Any assistant that can inspect project Markdown files can use the generated project memory. |

## Current Native Entry Point

Install as a Claude Code skill:

```bash
git clone https://github.com/JamesShi96/project-butler.git ~/.claude/skills/project-butler
```

Then open a project and run:

```text
/project-butler
```

This creates project memory files in the project itself. After that, other tools can read those files even if they do not run project-butler natively.

## How Cursor Fits

If you choose Cursor support during setup, project-butler creates:

```text
.cursor/rules/project-system.mdc
```

That file tells Cursor to use the same project memory files:

- `PROJECT.md`
- `session-handoff.md`
- `TODO.md`
- `STRUCTURE.md`
- `UPDATE_LOG.md`
- `DOCS.md`
- `.claude/project-profile.json`
- `.claude/profile-pending.json`
- project rules / constitution

Cursor does not need a separate database or memory store.

Cursor rules are best-effort context. Cursor does not have Claude Code's
skill lifecycle, so version-freshness checks are manual/on-demand.

## How Codex Fits

If you choose Codex support during setup, project-butler creates:

```text
AGENTS.md
```

That file tells Codex to use the same project memory files:

- `PROJECT.md` gives Codex the current project overview.
- `session-handoff.md` tells Codex where to continue.
- `TODO.md` gives Codex the execution plan.
- `STRUCTURE.md` describes file organization rules.
- `UPDATE_LOG.md` gives Codex milestone-level history.
- `DOCS.md` gives Codex the project document index and metadata.
- `.claude/project-profile.json` gives Codex the generated project shape, document tiers, document policies, and protected sections.
- `.claude/profile-pending.json` gives Codex pending profile updates, profile debt, and review queue items.
- project rules / constitution provide stable constraints.

Codex support is best-effort project instruction, not a Codex-native
package. Version-freshness checks are manual/on-demand.

## Why This Is File-Based

Different AI coding assistants have different native extension systems:

- Claude Code has skills.
- Cursor has project rules.
- Codex has project instructions and readable workspace files.
- Other tools have their own formats.

project-butler avoids locking memory into one product by writing durable project files. The assistant integration can change; the project memory remains.

## Current Caveats

- Claude Code is the most complete native integration today.
- Cursor integration is generated as project rules, not as a Cursor extension.
- Codex integration is generated as `AGENTS.md`, not as a Codex-native package.
- The main rule file is currently named `CLAUDE.md` because Claude Code is the native entry point. The project memory model is broader than that filename.
- Existing projects without `.claude/project-profile.json` can still use the base project memory stack, but upgrade should offer the current profile-aware setup model before writing profile files.
- Cursor and Codex adapters are best-effort. They can read and update the shared project files, but they do not get Claude Code's automatic skill lifecycle.

## Direction

The long-term direction is to keep one shared project memory while adding better adapters for each assistant:

- `CLAUDE.md` for Claude Code,
- `.cursor/rules/project-system.mdc` for Cursor,
- `AGENTS.md` for Codex,
- profile JSON files for profile-aware adapters,
- plain Markdown files for every other tool.
