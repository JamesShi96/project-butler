# Version Freshness Check (Runtime)

> Always run first, before Step 0 trigger routing.

## Steps

1. Resolve `SKILL_DIR` from the "Base directory for this skill: <path>" line in the current skill loading context. If absent, skip silently.
2. Run the command below as a **single Bash tool call**.
3. If stdout contains `VERSION_NOTICE:`, prepend those three lines verbatim to your response. Never paraphrase. Never auto-pull. If stdout is empty, continue silently.

## Command

```bash
SKILL_DIR="<base directory from CC prompt line>"
bash "$SKILL_DIR/scripts/check-update.sh" "$SKILL_DIR"
```

## Rules

- Never auto-pull. Show the upgrade command; the user runs it.
- Never paraphrase the three-line `VERSION_NOTICE:` block.
- Never run debug mode inside Claude Code — CC captures stderr into the LLM context and debug output will leak into responses.
- Silence switch matches the literal string `"1"` only. `=0`, `=false`, empty do NOT silence.
- Run the command as a single Bash tool call.
- `scripts/check-update.sh` is the detection source of truth. This reference defines the Claude Code adapter behavior around when to call it and how to present its stdout.

## Edge Cases

| Situation | Behavior |
|---|---|
| No "Base directory" line in CC prompt | Skip silently |
| Cache missing, corrupt, or SHA mismatch | Fetch |
| `git fetch` fails (offline, port 22 blocked, non-git path) | Use cached `behind_by`; no banner update |
| SSH port 22 blocked (firewall, China mainland, corp net) | `ConnectTimeout=5` bounds hang to ~5s (vs ~2min default) |
| `mkdir -p` or cache write fails | Silently degrade to no-cache mode |
| Cursor / Codex usage | Manual/on-demand only: run `bash <project-butler-install>/scripts/check-update.sh` from shell |

## Source

Design rationale and full failure modes: `docs/prd/features/version-freshness-check.md`.
Live-validated 2026-06-20 (Phase 1+2+3 — first install, cache hit, pull recovery, SSH fail-fast, banner verbatim).
