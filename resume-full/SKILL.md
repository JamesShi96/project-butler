---
name: resume-full
description: Use when starting a new Claude Code session and wanting a comprehensive overview of ALL previous sessions for this project — full project trajectory recovery. Reads the last session in detail plus summaries of all historical sessions. Trigger on /resume-full, "resume full", "full context", "项目全景", "整体回顾", "全面回顾", "项目上下文", "project overview".
---

# Resume Full — Recover Full Project Context

## Process

### 1. Read last session in detail

Execute `/resume` steps 1-3 in full (find project path, locate last JSONL, run jq filter, read output). This gives you the detailed last-session context.

### 2. Summarize historical sessions (bounded)

List all sessions and pick the historical ones (everything except the last):

```bash
PROJECT_PATH="$HOME/.claude/projects/-$(pwd | sed 's|/|-|g' | sed 's|^-||')"
ls -t "${PROJECT_PATH}"/*.jsonl 2>/dev/null
```

For the **5 most recent historical sessions**, extract a summary with a single jq call per session:

```bash
jq -c '{ first_msg: [select(.type == "user") | .message.content | if type == "string" then . elif type == "array" then [.[] | select(.type == "text") | .text] | join("") else empty end] | first, last_reply: [select(.type == "assistant") | .message.content | if type == "array" then [.[] | select(.type == "text") | .text] | join("") else . end | select(length > 0)] | last }' "<session-file>"
```

For **sessions older than the 5 most recent**: extract only the first user message — `jq -c 'select(.type == "user") | .message.content | ...' | head -1`.

Produce one line per session: `Session <date> — <first user msg> → <last assistant conclusion>`

### 3. Gather broader context

```bash
git log --oneline -20 2>/dev/null
git status --short 2>/dev/null
cat "${PROJECT_PATH}/memory/MEMORY.md" 2>/dev/null
cat ./CLAUDE.md 2>/dev/null
```

### 4. Present full project overview

**Project Timeline:** chronological session summaries (historical → last session marked `[LAST]`)
**Last Session Detail:** the full filtered conversation from step 1
**Current State:** git branch/status, recent 20 commits, memory, CLAUDE.md highlights

Then: "Ready to continue. What would you like to work on next?"
