# Session Handoff — Project Butler

> Last updated: 2026-07-10

## Current State

**v1.7.3 — interactive update prompt + language-aware notice.** Minor on top of v1.7.2. Committed this session.

The version-freshness notice changed shape based on live testing:

- **Live cross-trigger validation** (forced-behind cache): `status` → prompt at top ✓; `continue` → missed once, then fired ✓ (bilingual — first live i18n confirmation); `/project-butler` → footnote landed correctly at the end of the completed upgrade ✓. Finding: Step -1 firing is **best-effort** (one observed miss); the read/write placement rule was actually correct.
- **Language-aware notice**: `check-update.sh` reads the current project's CLAUDE.md `Language:` field (en / zh / bilingual), default en.
- **Option C — interactive update prompt** (replaces the passive banner): when behind upstream, Claude Code presents an AskUserQuestion (Update now / Remind me later / Stop reminding) **at most once per 24h**. "Update now" runs `check-update.sh --pull` (fast fetch + ff-only pull; manual + HTTPS fallback on failure). `VERSION_NOTICE:` token kept stable so Cursor/Codex templates are untouched.

Prior context: v1.7.2 (committed earlier) fixed check-update.sh L1/L2 latent bugs + hardened the profile / archiving / update-log / file-reorg specs after a full test pass (6 profile use cases + 3 adversarial + 4 module tests).

## Next Session Start

Recommended prompt: `continue full context`

Remaining work:

- **Live-validate Option C** in a fresh session: interactive prompt appears once + localized; "Update now" runs `--pull` (expect `UPDATE_FAILED` here — SSH blocked — with HTTPS fallback); a second invocation within 24h is throttled (no prompt). To set up: re-seed `.claude/.version-check.txt` (`last_check=9999999999`, `behind_by=2`, `head_sha=<current HEAD>`) and `rm .claude/.version-prompt`. NOTE: HEAD changed with the v1.7.3 commit, so the previously-seeded cache is now SHA-stale and must be re-seeded.
- **Doc sweep**: `docs/prd/features/version-freshness-check.md` and README still describe the old always-prepend banner — update them to the interactive-prompt model.
- **Tag + GitHub Release** for v1.7.0 / v1.7.1 / v1.7.2 / v1.7.3 — still deferred ("正式发布"), do after validation completes.
- Step -1 best-effort firing (occasional miss) — accepted as soft-instruction behavior; harden only if it proves annoying in real use.

## Do Not Forget

- v1.7.0–v1.7.3 are committed but NOT git-tagged, NOT released on GitHub. Tag only after validation completes.
- SSH port 22 is blocked in this environment. Use HTTPS for git push/pull: `git push https://github.com/JamesShi96/project-butler.git main` (with `gh` credentials). Plain SSH `git fetch`/`pull` times out (~2 min).
- Debug mode (`PROJECT_BUTLER_UPDATE_CHECK_DEBUG=1`) is external-shell only — CC captures stderr into context.
- `PROJECT_BUTLER_NO_UPDATE_CHECK=0` does NOT silence — only literal `"1"` does.
- `jq` is NOT installed — session-history scripts must use python3.
- Test artifacts from prior sessions live under the scratchpad (`pb-test/`, `i18n-test/`, `c-test/`), not in the repo.
