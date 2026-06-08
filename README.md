# project-butler

**[English](README.md)** | [中文](README_zh.md)

[![GitHub stars](https://img.shields.io/github/stars/JamesShi96/project-butler?style=social)](https://github.com/JamesShi96/project-butler/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/JamesShi96/project-butler?display_name=tag)](https://github.com/JamesShi96/project-butler/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![AI Coding Assistants](https://img.shields.io/badge/AI%20Coding%20Assistants-Claude%20Code%20%7C%20Cursor%20%7C%20Codex-6B46C1)](docs/compatibility.md)

> Make AI coding agents remember your project between sessions.

project-butler helps Claude Code, Cursor, Codex, and similar AI coding assistants behave like long-term project teammates instead of starting from scratch every session.

For normal use, you only need four actions:

```text
/project-butler   Set up project memory
end session       Save progress and next steps
continue          Resume next time
status            Check where the project stands
```

## Quick Start

Install as a Claude Code skill:

```bash
git clone https://github.com/JamesShi96/project-butler.git ~/.claude/skills/project-butler
```

Open any project and set up project memory:

```text
/project-butler
```

Work normally. At the end of a work session:

```text
end session
```

Next time, resume without re-explaining the project:

```text
continue
```

That is enough for daily use. For Cursor, Codex, and other assistants, see [Tool Compatibility](docs/compatibility.md).

## Why It Exists

AI coding assistants are powerful in one session and forgetful across sessions. If any of these sound familiar, project-butler is for you:

- **"I had to re-explain the architecture again."** Each new session starts with missing context.
- **"What did we decide about naming conventions last week?"** Decisions disappear into chat history.
- **"The README and TODOs keep drifting from reality."** Project state stops matching the files.
- **"The AI keeps violating rules I already explained."** Rules live in your head instead of in project memory.
- **"I switch between Claude Code, Cursor, and Codex."** Different tools need one shared source of truth.

project-butler turns a project folder into that source of truth, so the next AI session can pick up where the last one stopped.

## Main Commands

All triggers are natural language. Use slash commands only for first-time setup.

| Command | Use it when |
|---|---|
| `/project-butler` | Set up or upgrade project memory. |
| `end session` / `we're done` | Save progress, refresh next steps, and record important changes. |
| `continue` / `continue from last time` | Resume the previous session without re-explaining context. |
| `status` / `where are we` | Get the current project state and the next best step. |

## Advanced Commands

| Command | Use it when |
|---|---|
| `continue full context` | Rebuild the full project trajectory after a long break or assistant switch. |
| `review claude` / `check the rules` | Review candidate project rules before they become long-term rules. |
| `sync wiki` / `update overview` | Force-refresh `PROJECT.md`. |
| `organize files` | Clean up new files according to `STRUCTURE.md`. |
| `change language` | Switch project management files between English, Chinese, and bilingual mode. |

Session recovery (`continue` / `continue full context`) is routed through project-butler internally. There is no separate `/continue` command to install.

## What It Maintains

Run `/project-butler` once. It maintains these plain Markdown files in your project:

```text
project-root/
├── CLAUDE.md                   <- Project rules / constitution
├── PROJECT.md                  <- Current project wiki
├── STRUCTURE.md                <- File organization rules
├── UPDATE_LOG.md               <- Milestone-level changelog
├── DOCS.md                     <- Document index and metadata
├── session-handoff.md          <- Cross-session handoff
├── TODO.md                     <- Execution checklist
├── docs/                       <- Archived project documents
├── log/                        <- Session logs
└── .claude/
    ├── candidates.md           <- Candidate rules for review
    └── .file-snapshot.json     <- File organization snapshot
```

The core files are plain Markdown, so other tools can read them even when they do not run the skill natively.

What that means in practice:

- Keeps the current project state readable.
- Keeps next steps clear between sessions.
- Keeps project documents indexed and findable.
- Records milestone changes so the project has a clear history.
- Keeps new files from drifting into random folders.
- Preserves long-term rules only after user review.

## Tool Support

| Tool | Status | How it works |
|---|---|---|
| Claude Code | Native skill | Install this repo under `~/.claude/skills/project-butler` and run `/project-butler`. |
| Cursor | Project rules | project-butler can generate `.cursor/rules/project-system.mdc`, which points Cursor at the same project memory files. |
| Codex | Shared memory files | Codex can read the generated Markdown files (`PROJECT.md`, `TODO.md`, `session-handoff.md`, `STRUCTURE.md`, `UPDATE_LOG.md`, `DOCS.md`, rules) as project context. |
| Other AI assistants | File-based | Any assistant that can read project files can use the project memory as shared context. |

See [docs/compatibility.md](docs/compatibility.md) for details and caveats.

## How It Works

### Internals: The Memory Stack

project-butler uses a 7-component memory stack internally, organized by stability:

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
│  DOCS.md                            │  <- Document index
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
- **Document index** keeps project documents organized under `docs/`.

### Language Support

project-butler supports three language modes:

| Mode | Content language | User file naming |
|---|---|---|
| `en` | English | English naming (`kebab-case`) |
| `zh` | Chinese | Chinese naming allowed |
| `bilingual` | Chinese with English annotations | English preferred, Chinese acceptable |

You choose the mode during setup, and can later say `change language`.

### Version Naming

During setup, project-butler asks which version style the project should use:

| Style | Example | Best for |
|---|---|---|
| Semantic | `v0.1.0` | Engineering projects and libraries |
| Codename | `Project Name 0.1` | Products, brands, and creative projects |
| Patch | `Patch 1` | Games and iterative content releases |
| Date | `2026.06.1` | Research logs, operations, and document-heavy work |

`end session` uses this style when a significant update deserves an `UPDATE_LOG.md` entry.

### Upgrade Mode

If a project already has some management files, project-butler creates only the missing ones. It does not replace existing files; when a system section needs an update, it asks before making a small targeted patch. It also detects legacy `.claude/memory/` layouts and suggests migration.

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

### v1.5.1 (2026-06-03) - Product Noise Reduction
- Reframe the README around four primary actions: `/project-butler`, `end session`, `continue`, and `status`.
- Move internals behind "How it works" and make examples result-focused.
- Update generated CLAUDE/Cursor rules to separate daily workflow from advanced commands.

### v1.5.0 (2026-06-03) - Versioned Update Log System
- Add version style selection during setup: Semantic, Codename, Patch, and Date.
- Teach end-session update logging to calculate the next version from the selected style.
- Sync README, examples, compatibility docs, generated rules, continue recovery, document archiving, upgrade mode, and trigger routing with the current memory stack.

### v1.4.1 (2026-06-02) - Cross-Reference + Flow Consistency
- Fix DOCS.md, file snapshot, language switching, continue recovery, and template consistency gaps found through six review rounds.
- Align document archiving, file reorganization, and Cursor rule templates.

### v1.3.0 (2026-06-01) - Four-Phase File Reorganization
- Replace template-based file organization with Discover, Ask or Plan, Plan, and Execute phases.
- Add confidence routing, safe move planning, and a never-delete cleanup policy.

### v1.2.1 (2026-05-09) - Skill Loader Compatibility
- Move `continue` reference workflows under `references/` instead of nested `SKILL.md` files.
- Shorten skill metadata to satisfy loader limits.
- Keep session recovery routed through the main project-butler skill.

Full update log: [UPDATE_LOG.md](UPDATE_LOG.md) | Releases: [GitHub Releases](https://github.com/JamesShi96/project-butler/releases)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JamesShi96/project-butler&type=Date)](https://www.star-history.com/#JamesShi96/project-butler&Date)

## License

[MIT](LICENSE)
