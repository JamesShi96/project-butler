# project-butler

**[English](README.md)** | [中文](README_zh.md)

> One command to give your project a persistent brain.

When you work with AI coding assistants across multiple sessions, you start from scratch every time. The AI doesn't remember what happened yesterday, what decisions were made, or what the project rules are. You end up re-explaining context, re-establishing conventions, and losing institutional knowledge.

**project-butler** solves this by setting up a self-maintaining project management system in one command. After setup, your AI assistant automatically logs sessions, maintains a project wiki, tracks tasks, and accumulates rules for your review — no manual effort required.

## The Problem It Solves

If any of these sound familiar, this skill is for you:

- **"I had to re-explain the project architecture to the AI for the third time today"** — Every new session starts with zero context
- **"What did we decide about naming conventions last week?"** — Decisions get lost between sessions
- **"I keep forgetting to update the README after changes"** — Documentation drifts from reality
- **"The AI keeps violating my project rules"** — Rules exist in your head but not in a file the AI reads
- **"I use both Claude Code and Cursor, and context doesn't carry over"** — Different tools, different context

## How It Works

Run `/project-butler` once. It creates 6 files organized in 4 layers:

```
project-root/
├── CLAUDE.md                   ← Constitution (human-confirmed rules)
├── PROJECT.md                  ← Wiki (auto-synced project overview)
├── session-handoff.md          ← Cross-session handoff (auto-updated)
├── TODO.md                     ← Execution checklist
├── log/                        ← Session logs (auto-generated)
└── .claude/
    └── candidates.md           ← Constitution candidate pool
```

### Design Philosophy: Layered by Stability

```
  ┌─────────────────────────────────────┐
  │  CLAUDE.md (Constitution)           │  ← Changes rarely, human-approved
  │  ↑ candidates collected by AI       │
  └─────────────────────────────────────┘
            ↑ principles distilled from below
  ┌─────────────────────────────────────┐
  │  PROJECT.md (Wiki)                  │  ← Auto-synced snapshot
  │  What this project IS right now     │
  └─────────────────────────────────────┘
            ↑ state summarized from below
  ┌──────────────────────┐ ┌───────────────────────┐
  │  log/ (Session Logs) │ │  TODO.md (Task List)  │  ← Raw facts, written often
  │  What happened when  │ │  What needs to happen │
  └──────────────────────┘ └───────────────────────┘
```

**Bottom feeds top, top constrains bottom.**

- **Logs and TODOs** are the raw fact stream — what happened, what needs to happen
- **Wiki** is the current state snapshot — auto-distilled from the raw facts
- **Constitution** is the stable principle layer — rules that persist and guide all behavior

This hierarchy means information flows upward (facts → snapshot → principles) and constraints flow downward (principles → snapshot → facts). Each layer has a different change frequency, owner, and purpose.

### Language Support

project-butler supports 3 language modes:

| Mode | Content Language | User File Naming |
|------|-----------------|------------------|
| `en` (English) | All content in English | English naming (kebab-case) |
| `zh` (中文) | All content in Chinese | Chinese naming allowed |
| `bilingual` (default) | Chinese with English annotations | English preferred, Chinese acceptable |

Set during `/project-butler` setup, or change anytime by saying "change language" / "切换语言".

When switching language, you're asked whether to rename user files to match the new language's naming conventions. System files (CLAUDE.md, PROJECT.md, etc.) keep their English names regardless.

### The 4 Components

#### 1. Session Logs (log/)

Every time you say `end session`, the AI writes a structured log:

```markdown
# Session 2026-04-21 — PRD Draft

## 本次目标
## 关键操作（按时间顺序）
## 决策与理由
## 产出文件
## 未完事项 / 下次接手点
## 候选 CLAUDE.md 条目（如有）
```

Like meeting notes, but automatic. Next session, the AI reads the latest log and picks up where you left off.

#### 2. Project Wiki (PROJECT.md)

A single file that answers: **what is this project, and where does it stand?**

- One-line definition, current stage, module map
- File structure (auto-generated)
- Key file index with descriptions
- Progress snapshot table
- Links (GitHub, docs, designs)

Auto-synced when files change or sessions end. Anyone (human or AI) reads this one file to understand the project.

#### 3. Constitution (CLAUDE.md)

The project's rules and boundaries — but with a crucial safety mechanism:

- **AI never edits CLAUDE.md directly**
- During work, the AI identifies patterns that might be rules ("this user always wants tests first", "they use snake_case for files") and collects them in `.claude/candidates.md`
- When you say `review claude`, the AI presents candidates one by one for you to **confirm, reject, or rewrite**
- Only confirmed entries get written to CLAUDE.md

This means the constitution grows organically from real usage patterns, but you stay in control.

#### 4. Execution Checklist (TODO.md)

Not an idea pool — an execution plan. Every task has three required fields:

```
- [ ] Implement user authentication
  负责人：James｜截止：2026-04-30｜依赖：Database schema finalized
```

If you mention a task without these fields, the AI asks you to fill them in. Completed tasks are checked off and kept (not deleted) as execution history.

## Trigger Words

After setup, these become part of your workflow:

| You say (any expression of...) | What happens |
|---------|-------------|
| "we're done" / "end session" | Write log + update handoff + sync Wiki + organize files + output summary |
| "check the rules" / "review claude" | Show candidate rules for you to confirm one by one |
| "update overview" / "sync wiki" | Force rescan and update PROJECT.md |
| "where are we" / "status" | Read Wiki + handoff summary aloud |
| "clean up files" / "organize" | Scan and reorganize files per STRUCTURE.md rules |
| "switch language" / "切换语言" | Change content language for all management files |

The key insight: **you just work normally, and say "end session" when you're done.** The system handles everything else.

## Multi-Tool Support

If you use both Claude Code and Cursor, `/project-butler` optionally creates a `.cursor/rules/project-system.mdc` file that mirrors the same trigger behavior. Both tools read from the same `PROJECT.md` and `session-handoff.md`, so context carries over seamlessly.

## Install

```bash
# Clone into your Claude Code skills directory
git clone https://github.com/JamesShi7/project-butler.git ~/.claude/skills/project-butler
```

## Use

In any project directory:

```
/project-butler
```

Answer 5 quick questions (project name, description, stage, GitHub URL, Cursor rules?), and all files are created.

**Upgrade mode**: if a project already has some files (CLAUDE.md, TODO.md, etc.), it only creates missing ones and never overwrites existing content. It also detects legacy `.claude/memory/` directories and suggests migration.

## Requirements

- [Claude Code](https://claude.com/claude-code) CLI
- Optionally: [Cursor](https://cursor.sh) (for cross-tool rules file)

## License

MIT
