# Version Freshness Check (Runtime)

> Always run first, before Step 0 trigger routing.

## Steps

1. Resolve `SKILL_DIR` from the "Base directory for this skill: <path>" line in the current skill loading context. If absent, skip silently.
2. Run the snippet below as a **single Bash tool call** — variables do not persist across separate Bash invocations.
3. If stdout contains `VERSION_NOTICE:`, prepend those three lines verbatim to your response. Never paraphrase. Never auto-pull. If stdout is empty, continue silently.

## Snippet

```bash
SKILL_DIR="<base directory from CC prompt line>"
DEBUG="${PROJECT_BUTLER_UPDATE_CHECK_DEBUG:-0}"

if [[ "${PROJECT_BUTLER_NO_UPDATE_CHECK:-}" != "1" ]]; then
  if [[ -n "$SKILL_DIR" ]]; then
    CACHE="$SKILL_DIR/.claude/.version-check.txt"
    NOW=$(date +%s)
    NEED_FETCH=1
    BEHIND=0
    CURRENT_SHA=$(git -C "$SKILL_DIR" rev-parse HEAD 2>/dev/null)

    if [[ -f "$CACHE" ]]; then
      LAST_CHECK=$(grep '^last_check=' "$CACHE" | cut -d= -f2-)
      CACHED_BEHIND=$(grep '^behind_by=' "$CACHE" | cut -d= -f2-)
      CACHED_SHA=$(grep '^head_sha=' "$CACHE" | cut -d= -f2-)
      if [[ -n "$LAST_CHECK" && $((NOW - LAST_CHECK)) -lt 86400 && "$CACHED_SHA" == "$CURRENT_SHA" ]]; then
        NEED_FETCH=0
        BEHIND="$CACHED_BEHIND"
        [[ "$DEBUG" == "1" ]] && echo "[update-check] cache fresh; BEHIND=$BEHIND" >&2
      fi
    fi

    if [[ "$NEED_FETCH" -eq 1 ]]; then
      if GIT_SSH_COMMAND="ssh -o ConnectTimeout=5 -o BatchMode=yes" GIT_TERMINAL_PROMPT=0 git -C "$SKILL_DIR" fetch -q origin main 2>/dev/null; then
        BEHIND=$(git -C "$SKILL_DIR" rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
        CURRENT_SHA=$(git -C "$SKILL_DIR" rev-parse HEAD 2>/dev/null)
        mkdir -p "$(dirname "$CACHE")" 2>/dev/null
        printf 'last_check=%s\nbehind_by=%s\nhead_sha=%s\n' "$NOW" "$BEHIND" "${CURRENT_SHA:-}" > "$CACHE" 2>/dev/null
        [[ "$DEBUG" == "1" ]] && echo "[update-check] fetch ok; BEHIND=$BEHIND" >&2
      else
        [[ "$DEBUG" == "1" ]] && echo "[update-check] fetch failed; using cached BEHIND=$BEHIND" >&2
      fi
    fi

    if [[ "${BEHIND:-0}" -gt 0 ]]; then
      echo "VERSION_NOTICE: project-butler is ${BEHIND} commits behind upstream."
      echo "  → Update: cd ${SKILL_DIR} && git pull"
      echo "  → Silence: PROJECT_BUTLER_NO_UPDATE_CHECK=1"
    fi
  else
    [[ "$DEBUG" == "1" ]] && echo "[update-check] no SKILL_DIR; skipping" >&2
  fi
else
  [[ "$DEBUG" == "1" ]] && echo "[update-check] silenced by env var" >&2
fi
```

## Rules

- Never auto-pull. Show the upgrade command; the user runs it.
- Never paraphrase the three-line `VERSION_NOTICE:` block.
- Never run debug mode inside Claude Code — CC captures stderr into the LLM context and debug output will leak into responses.
- Silence switch matches the literal string `"1"` only. `=0`, `=false`, empty do NOT silence.
- Run the snippet as a single Bash tool call. Variables do not persist across separate invocations.

## Cache

Path: `<SKILL_DIR>/.claude/.version-check.txt` (gitignored).

Three lines, `key=value`:
- `last_check` — Unix timestamp of last successful fetch.
- `behind_by` — commit count of `HEAD..origin/main` at last fetch.
- `head_sha` — SHA of `HEAD` at last fetch.

Cache is valid only when **both** hold:
- age < 24 hours (`now - last_check < 86400`)
- current `HEAD` SHA == cached `head_sha`

Either failing triggers a fresh fetch. The SHA check ensures the
banner disappears immediately after the user pulls.

## Edge Cases

| Situation | Behavior |
|---|---|
| No "Base directory" line in CC prompt | Skip silently |
| `.claude/` directory missing | `mkdir -p` on first successful fetch |
| Cache missing or corrupt | Fetch, create cache |
| Cache stale (time expired or SHA mismatch) | Fetch |
| `git fetch` fails (offline, port 22 blocked, non-git path) | Use cached `behind_by`, no banner update |
| SSH port 22 blocked | `ConnectTimeout=5` bounds hang to ~5s (not ~2min) |
| `mkdir -p` or cache write fails | Silently degrade to no-cache mode |

## Source

Design rationale and history: `docs/prd/features/version-freshness-check.md`.
Live-validated 2026-06-20 (Phase 1+2+3 — first install, cache hit, pull recovery, SSH fail-fast, banner verbatim).
