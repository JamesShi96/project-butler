# Version Freshness Check (Runtime)

> Always run first, before Step 0 trigger routing.

## Steps

1. Resolve `SKILL_DIR` from the "Base directory for this skill: <path>" line in the current skill loading context. If absent, skip silently.
2. Run the command below as a **single Bash tool call**.
3. If stdout contains `VERSION_NOTICE:`, present the interactive update prompt defined in SKILL.md Step -1 (AskUserQuestion: Update now / Remind me later / Stop reminding) — do NOT print the block verbatim. On "Update now", run `bash "$SKILL_DIR/scripts/check-update.sh" --pull "$SKILL_DIR"`. If stdout is empty, continue silently.

## Command

```bash
SKILL_DIR="<base directory from CC prompt line>"
bash "$SKILL_DIR/scripts/check-update.sh" "$SKILL_DIR"
```

## Rules

- Never auto-pull EXCEPT as the "Update now" action the user selects, which runs the `--pull` subcommand (fast fetch + ff-only pull, with a manual/HTTPS fallback message on failure).
- The `VERSION_NOTICE:` output is throttled by the script to at most once per 24h, so the prompt does not appear on every invocation. Do not add extra suppression.
- Never run debug mode inside Claude Code — CC captures stderr into the LLM context and debug output will leak into responses.
- Silence switch matches the literal string `"1"` only. `=0`, `=false`, empty do NOT silence.
- Run the command as a single Bash tool call.
- `scripts/check-update.sh` is the detection source of truth. This reference defines the Claude Code adapter behavior around when to call it and how to present its stdout.

## Edge Cases

| Situation | Behavior |
|---|---|
| No "Base directory" line in CC prompt | Skip silently |
| Cache missing, corrupt, or SHA mismatch | Fetch |
| `git fetch` fails (offline, port 22 blocked, non-git path) | Use cached `behind_by`; no cache update |
| SSH port 22 blocked (firewall, China mainland, corp net) | `ConnectTimeout=5` bounds hang to ~5s (vs ~2min default) |
| `mkdir -p` or cache write fails | Silently degrade to no-cache mode |
| Cursor / Codex usage | Manual/on-demand only: run `bash <project-butler-install>/scripts/check-update.sh` from shell |

## Source

Design rationale and full failure modes: `docs/prd/features/version-freshness-check.md`.
Live-validated 2026-06-20 (Phase 1+2+3 — first install, cache hit, pull recovery, SSH fail-fast, notice delivery).
Interactive prompt live-validated 2026-07-17 (5/5 — trigger, 24h throttle, language adaptation, AskUserQuestion, `--pull` → `UPDATE_OK`).
