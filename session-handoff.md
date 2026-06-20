# Session Handoff — Project Butler

> Last updated: 2026-06-20

## Current State

**Version Freshness Check has shipped** as v1.7.0. Implementation complete, live-validated, docs simplified to MVP, all on `origin/main`.

What landed:

- `references/update-check.md` — runtime reference, 100 lines. Single bash snippet, ~50 lines.
- `SKILL.md` — `description` mentions freshness check; Step -1 wrapped in `<EXTREMELY_IMPORTANT>` before Step 0 routing.
- `docs/prd/features/version-freshness-check.md` — design spec, 131 lines (MVP).
- `.gitignore` — excludes `.claude/.version-check.txt`.
- `README.md` + `README_zh.md` — "Updating project-butler" section.
- `UPDATE_LOG.md` — v1.7.0 entry.

Detection: `GIT_SSH_COMMAND="ssh -o ConnectTimeout=5 -o BatchMode=yes" GIT_TERMINAL_PROMPT=0 git fetch -q origin main` + `rev-list --count HEAD..origin/main`.

Cache: `<SKILL_DIR>/.claude/.version-check.txt`, plain text, dual-keyed (24h time + HEAD SHA). Pull mid-window clears the banner immediately.

Banner: three-line `VERSION_NOTICE:` block, English-only, opt-out inline. LLM prepends verbatim, never paraphrases, never auto-pulls.

Env vars: `PROJECT_BUTLER_NO_UPDATE_CHECK=1` (literal `"1"` only); `PROJECT_BUTLER_UPDATE_CHECK_DEBUG=1` (external shell only).

Live validation passed 2026-06-20 (Phase 1+2+3): first install, cache hit, pull recovery, SSH fail-fast, banner verbatim.

## Next Session Start

Recommended prompt:

```text
continue full context
```

Primary candidate work:

- Run cross-trigger coverage in a new CC session (Step -1 across `/project-butler`, `status`, `continue`, `end session`) — the only ship-blocking tests remaining.
- Decide whether to tag v1.7.0 + GitHub Release after cross-trigger validation passes.
- Consider switching `origin` from SSH to HTTPS permanently (SSH port 22 blocked in current env).

## Do Not Forget

- v1.7.0 is shipped but **not** git-tagged, **not** released on GitHub. Tag only after cross-trigger validation passes.
- SSH port 22 is blocked in current env (`198.18.0.10` is a DNS-hijack / proxy IP, not GitHub real IP). Use HTTPS for git operations: `git push https://github.com/JamesShi96/project-butler.git main`. The skill's own update-check handles this gracefully via `ConnectTimeout=5`.
- Cursor users do not get this feature — they load project-butler via `.cursor/rules/` and never see SKILL.md Step -1. Separate future feature.
- Plugin-installed skills whose path is not a git repo are silently skipped.
- Debug mode (`PROJECT_BUTLER_UPDATE_CHECK_DEBUG=1`) is **external shell only** — CC captures stderr into LLM context.
- `PROJECT_BUTLER_NO_UPDATE_CHECK=0` does **not** silence the check — only literal `"1"` does.
- Git history was squashed 2026-06-20: the four process commits (`26a265c`, `e34778c`, `23c573e`, `9c4da20`) were combined into a single `feat: version freshness check` commit. Process artifacts (4 spec iterations, intermediate session log) are no longer in main's history but remain reachable via reflog for ~30 days.
