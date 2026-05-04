# Continue — Recover Last Session Context

> Loaded during: "continue" / "接着上次" triggers (routed from main SKILL.md).

## Process

### 1. Find and read the last session

```bash
PROJECT_PATH="$HOME/.claude/projects/-$(pwd | sed 's|/|-|g' | sed 's|^-||')"
SESSION_FILE=$(ls -t "${PROJECT_PATH}"/*.jsonl 2>/dev/null | head -1)
```

If either doesn't exist, tell the user: "No session history found for this project."

Pre-filter with jq to strip thinking blocks and tool results:

```bash
jq -c '
  select(.type == "user" or .type == "assistant") |
  { type: .type, time: .timestamp, content: (
    if .type == "user" then
      (.message.content | if type == "string" then . elif type == "array" then ([.[] | select(.type == "text")] | map(.text) | join(" ")) else empty end)
    else
      (.message.content | if type == "array" then
        [.[] | select(.type != "thinking" and .type != "tool_result")]
        | map(if .type == "text" then .text elif .type == "tool_use" then "\n[Tool: \(.name)] \(.input | tostring)" else empty end)
        | join("")
      else . end)
    end)
  }
' "$SESSION_FILE"
```

If jq fails, fall back to: `cat "$SESSION_FILE"`

### 2. Gather current context

Run in parallel:

```bash
git status --short 2>/dev/null
git log --oneline -5 2>/dev/null
cat "${PROJECT_PATH}/memory/MEMORY.md" 2>/dev/null
```

### 3. Present summary

**Last Session:** what was being worked on, key decisions, files modified (from tool_use entries).
**Current State:** git status + recent commits.

Then: "Ready to continue. What would you like to work on next?"
