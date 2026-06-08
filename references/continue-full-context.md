# Continue Full Context — Recover Full Project Context

> Loaded during: "continue full context" / "全面回顾" triggers (routed from main SKILL.md).

## Process

### 1. Read last session in detail

Execute steps 1-2 from `references/continue.md` (find project path, locate last JSONL, run jq filter, read output, gather current management files). Do not present the short continue summary yet; this flow produces a fuller overview in step 4.

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

Read the project-butler management files (these are maintained specifically for cross-session recovery):

```
Read session-handoff.md (next pickup point, current progress)
Read PROJECT.md (project wiki, module map, progress snapshot)
Read TODO.md (active tasks and blockers)
Read UPDATE_LOG.md (milestone history)
Read DOCS.md (document index, if present)
Read CLAUDE.md (stable project rules, if present)
```

Run in parallel:

```bash
git log --oneline -20 2>/dev/null
git status --short 2>/dev/null
cat "${PROJECT_PATH}/memory/MEMORY.md" 2>/dev/null
cat ./session-handoff.md 2>/dev/null
cat ./PROJECT.md 2>/dev/null
cat ./TODO.md 2>/dev/null
cat ./UPDATE_LOG.md 2>/dev/null
cat ./DOCS.md 2>/dev/null
cat ./CLAUDE.md 2>/dev/null
```

### 4. Present full project overview

**Project Timeline:** chronological session summaries (historical → last session marked `[LAST]`)
**Last Session Detail:** the full filtered conversation from step 1
**Current State:** git branch/status, recent 20 commits, memory, handoff, active TODOs, update log, document index, and CLAUDE.md highlights

Then: "Ready to continue. What would you like to work on next?"
