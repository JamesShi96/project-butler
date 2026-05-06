# project-butler

**[English](README.md)** | [中文](README_zh.md)

[![GitHub stars](https://img.shields.io/github/stars/JamesShi96/project-butler?style=social)](https://github.com/JamesShi96/project-butler/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/JamesShi96/project-butler?display_name=tag)](https://github.com/JamesShi96/project-butler/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![AI Coding Assistants](https://img.shields.io/badge/AI%20Coding%20Assistants-Claude%20Code%20%7C%20Cursor%20%7C%20Codex-6B46C1)](docs/compatibility.md)

> Persistent project memory for AI coding assistants.

project-butler gives Claude Code, Cursor, Codex, and similar AI coding assistants a shared project memory stack: session logs, handoff notes, project wiki, TODOs, rules, file structure, and changelog.

You keep working normally. At the end, say `end session`. Next time, say `continue`.

## Quick Start

Install as a Claude Code skill:

```bash
git clone https://github.com/JamesShi96/project-butler.git ~/.claude/skills/project-butler
```

Open any project and initialize the memory stack:

```text
/project-butler
```

At the end of a work session:

```text
end session
```

Next time:

```text
continue
```

For Cursor, Codex, and other assistants, see [Tool Compatibility](docs/compatibility.md).

## Why It Exists

AI coding assistants are powerful in one session and forgetful across sessions. If any of these sound familiar, project-butler is for you:

- **"I had to re-explain the architecture again."** Each new session starts with missing context.
- **"What did we decide about naming conventions last week?"** Decisions disappear into chat history.
- **"The README and TODOs keep drifting from reality."** Project state stops matching the files.
- **"The AI keeps violating rules I already explained."** Rules live in your head instead of in project memory.
- **"I switch between Claude Code, Cursor, and Codex."** Different tools need one shared source of truth.

project-butler turns a project folder into that source of truth.

## What It Creates

Run `/project-butler` once. It creates a file-based project memory stack:

```text
project-root/
├── CLAUDE.md                   <- Project rules / constitution
├── PROJECT.md                  <- Current project wiki
├── STRUCTURE.md                <- File organization rules
├── UPDATE_LOG.md               <- Milestone-level changelog
├── session-handoff.md          <- Cross-session handoff
├── TODO.md                     <- Execution checklist
├── log/                        <- Session logs
└── .claude/
    ├── candidates.md           <- Candidate rules for review
    └── .file-snapshot.json     <- File organization snapshot
```

The core files are plain Markdown, so other tools can read them even when they do not run the skill natively.

## Common Commands

All triggers are natural language. Use slash commands only for first-time setup.

| You say | What happens |
|---|---|
| `/project-butler` | Initialize or upgrade the project memory stack. |
| `end session` / `we're done` | Write a session log, update handoff, sync wiki, update TODOs, organize new files, and record significant changes. |
| `continue` / `continue from last time` | Recover the previous session and resume without re-explaining context. |
| `continue full context` | Rebuild the full project trajectory from the latest session plus historical summaries. |
| `review claude` / `check the rules` | Review candidate project rules before they are promoted into the constitution. |
| `sync wiki` / `update overview` | Force-refresh `PROJECT.md`. |
| `status` / `where are we` | Read the current wiki and handoff summary. |
| `organize files` | Run file organization based on `STRUCTURE.md`. |
| `change language` | Switch project management files between English, Chinese, and bilingual mode. |

Session recovery (`continue` / `continue full context`) is routed through project-butler internally. There is no separate `/continue` command to install.

## Tool Support

| Tool | Status | How it works |
|---|---|---|
| Claude Code | Native skill | Install this repo under `~/.claude/skills/project-butler` and run `/project-butler`. |
| Cursor | Project rules | project-butler can generate `.cursor/rules/project-system.mdc`, which points Cursor at the same project memory files. |
| Codex | Shared memory files | Codex can read the generated Markdown files (`PROJECT.md`, `TODO.md`, `session-handoff.md`, rules) as project context. |
| Other AI assistants | File-based | Any assistant that can read project files can use the memory stack as shared context. |

See [docs/compatibility.md](docs/compatibility.md) for details and caveats.

## How It Works

### The Memory Stack

project-butler organizes project memory by stability:

```text
Stable rules
┌─────────────────────────────────────┐
│  CLAUDE.md / project rules          │  <- Human-reviewed principles
│  ↑ candidates collected by AI       │
└─────────────────────────────────────┘
            ↑ distilled from work
Current state
┌─────────────────────────────────────┐
│  PROJECT.md                         │  <- What the project is now
│  STRUCTURE.md                       │  <- Where files belong
│  UPDATE_LOG.md                      │  <- Milestone-level changes
└─────────────────────────────────────┘
            ↑ summarized from facts
Raw facts
┌──────────────────────┐ ┌───────────────────────┐
│  log/                │ │  TODO.md              │
│  What happened       │ │  What needs doing     │
└──────────────────────┘ └───────────────────────┘
            ↓
session-handoff.md       <- Where the next session should resume
```

Bottom feeds top. Top constrains bottom.

- **Session logs** capture what happened.
- **Handoff** tells the next assistant where to resume.
- **Project wiki** summarizes the current state.
- **TODOs** keep execution visible.
- **Rules / constitution** preserve decisions that should keep guiding the project.
- **Update log** records significant changes at milestone level.
- **Structure rules** keep files from drifting into chaos.

### Language Support

project-butler supports three language modes:

| Mode | Content language | User file naming |
|---|---|---|
| `en` | English | English naming (`kebab-case`) |
| `zh` | Chinese | Chinese naming allowed |
| `bilingual` | Chinese with English annotations | English preferred, Chinese acceptable |

You choose the mode during setup, and can later say `change language`.

### Upgrade Mode

If a project already has some management files, project-butler creates only the missing ones. It does not overwrite existing content. It also detects legacy `.claude/memory/` layouts and suggests migration.

## Examples

See [docs/examples.md](docs/examples.md) for a complete session flow:

1. initialize a project,
2. work normally,
3. end the session,
4. resume the next day,
5. review accumulated rules.

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI for native skill execution
- [jq](https://jqlang.github.io/jq/) for `continue` / `continue full context` session recovery
- Optional: [Cursor](https://cursor.sh) for generated project rules
- Optional: Codex or other AI coding assistants that can read project Markdown files

## Update Log

### v1.2.0 (2026-05-05) - Update Log Auto-Tracking
- Auto-detect significant updates at end session.
- Add `UPDATE_LOG.md` for milestone-level change history.
- Offer optional GitHub Release creation for significant updates.
- Support both code and non-code projects.

### v1.1.0 (2026-05-04) - SKILL.md Refactor + Continue Rename
- Refactor SKILL.md from 1175 to 196 lines with on-demand reference loading.
- Rename `/resume` to `continue` and `/resume-full` to `continue full context`.
- Route all triggers through natural language.

### v1.0.0 (2026-05-01) - Session Recovery + Log Compaction
- Add session recovery (`continue` / `continue full context`).
- Add log compaction when raw logs exceed the threshold.
- Rename from `project-init` to `project-butler`.

Full update log: [UPDATE_LOG.md](UPDATE_LOG.md) | Releases: [GitHub Releases](https://github.com/JamesShi96/project-butler/releases)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JamesShi96/project-butler&type=Date)](https://www.star-history.com/#JamesShi96/project-butler&Date)

## License

[MIT](LICENSE)
