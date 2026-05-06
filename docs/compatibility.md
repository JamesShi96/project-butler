# Tool Compatibility

project-butler is a project memory system first and a Claude Code skill second.

The native entry point is Claude Code today, but the output is intentionally file-based: Markdown files that live in your project and can be read by Claude Code, Cursor, Codex, or any other AI coding assistant.

## Compatibility Matrix

| Tool | Integration level | What works |
|---|---|---|
| Claude Code | Native skill | Full `/project-butler` flow, natural-language triggers, session logging, continuation, file organization, language switching, and update log handling. |
| Cursor | Project rules | project-butler can generate `.cursor/rules/project-system.mdc`, which points Cursor at the shared memory files and mirrors the main workflow triggers. |
| Codex | Shared memory files | Codex can read `PROJECT.md`, `TODO.md`, `session-handoff.md`, `UPDATE_LOG.md`, `STRUCTURE.md`, and project rules as context. |
| Other AI assistants | File-based | Any assistant that can inspect project Markdown files can use the generated memory stack. |

## Current Native Entry Point

Install as a Claude Code skill:

```bash
git clone https://github.com/JamesShi96/project-butler.git ~/.claude/skills/project-butler
```

Then open a project and run:

```text
/project-butler
```

This creates the memory stack in the project itself. After that, other tools can read those files even if they do not run project-butler natively.

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
- project rules / constitution

Cursor does not need a separate database or memory store.

## How Codex Fits

Codex support is file-based:

- `PROJECT.md` gives Codex the current project overview.
- `session-handoff.md` tells Codex where to continue.
- `TODO.md` gives Codex the execution plan.
- `STRUCTURE.md` describes file organization rules.
- `UPDATE_LOG.md` gives Codex milestone-level history.
- project rules / constitution provide stable constraints.

The recommended pattern is to keep these files in the project root and make sure Codex reads them as project context.

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
- Codex support currently relies on shared project files, not a separate Codex-native marketplace package.
- The main rule file is currently named `CLAUDE.md` because Claude Code is the native entry point. The project memory model is broader than that filename.

## Direction

The long-term direction is to keep one shared memory stack while adding better adapters for each assistant:

- `CLAUDE.md` for Claude Code,
- `.cursor/rules/project-system.mdc` for Cursor,
- Codex-friendly project instructions and skill packaging where appropriate,
- plain Markdown files for every other tool.
