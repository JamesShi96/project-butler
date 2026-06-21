# Session Handoff — Project Butler

> Last updated: 2026-06-21

## Current State

**v1.7.1 Multi-Tool Compatibility Foundation (Phase 1) is committed.** Patch-level release on top of v1.7.0.

What landed in this change:

- `scripts/check-update.sh` (84 lines, executable) — version-freshness detection extracted out of `references/update-check.md` into a tool-agnostic script. Now the single detection source of truth.
- `references/update-check.md` — reduced to a single `bash "$SKILL_DIR/scripts/check-update.sh" "$SKILL_DIR"` call; remains the Claude Code adapter source of truth (when to call, how to present banner verbatim, never auto-pull).
- `references/file-templates.md` — added Template 6b (Codex `AGENTS.md`, full core-workflow mirror); Cursor Template 6 + 6b each gained a Manual Update Check section with a `PROJECT_BUTLER_SKILL_DIR` note for non-default installs; Cursor frontmatter `description` now lists `check project-butler update`.
- `SKILL.md` — Init Flow added Q6 "Codex AGENTS.md (default no)"; Create Files + report cover AGENTS.md.
- `references/upgrade-mode.md` — preserves existing `AGENTS.md`, offers append/patch; renumbered steps.
- `references/language-change.md` — translates AGENTS.md project-butler section (preserves unrelated user content).
- `docs/test-reports/adapter-coverage-matrix.md` — Claude Code / Cursor / Codex × core-workflow support levels.
- `docs/prd/features/multi-tool-compatibility.md` — Phase 1/2/3 roadmap (Phase 1 implemented).
- `docs/compatibility.md`, `README.md`, `README_zh.md`, `docs/prd/features/version-freshness-check.md`, `UPDATE_LOG.md` — updated to state Claude Code native / Cursor + Codex best-effort manual-on-demand.

Support model: Claude Code = native automatic Step -1 check. Cursor / Codex = best-effort, manual/on-demand only (`bash <install>/scripts/check-update.sh`).

## Review Outcome (this session)

High-effort multi-agent diff review (4 finder angles) was run. Verdict: **no blocking bugs introduced; shipped as-is by decision.** Findings were deliberately NOT fixed because they are low-value polish or out-of-scope:

- Skipped doc polish: PRD "≤80 lines" vs actual 84; PRD Background table still says Cursor/Codex update-check "out of scope" (historical context); upgrade-mode rule 11→19 missing cross-ref; AGENTS.md template missing an `## Output Style` section (best-effort, low impact).
- Deferred (pre-existing v1.7.0 latent bugs, carried over by the extraction — NOT introduced here):
  - `check-update.sh`: on `git fetch` failure with a stale/SHA-mismatched cache, `BEHIND` stays 0 instead of falling back to cached `behind_by` (diverges from PRD edge-case table).
  - `check-update.sh`: a corrupt non-numeric `last_check` makes `$((NOW - LAST_CHECK))` emit a stderr arithmetic error that CC could capture into context.
  - `check-update.sh`: `resolve_skill_dir` `git rev-parse --show-toplevel` fallback can resolve the wrong repo in degenerate no-arg/sourced invocations.
  - Root cause cluster: `resolve_skill_dir` fallback chain + cache fallback. A clean fix would validate the resolved dir is actually project-butler (contains `scripts/check-update.sh`/`SKILL.md`) and fall back to cached `behind_by` on fetch failure. **Open as a separate v1.7.0-hardening task.**

## Next Session Start

Recommended prompt: `continue full context`

Primary candidate work:

- Decide whether to tag v1.7.1 + GitHub Release (still NOT tagged/released; same as v1.7.0).
- Cross-trigger live validation of Step -1 in a fresh CC session (`/project-butler`, `status`, `continue`, `end session`) — still the main ship-blocking test from v1.7.0.
- Optional v1.7.0-hardening task: the 3 deferred `check-update.sh` latent bugs above.
- Phase 2 (multi-tool polish) only after real Cursor/Codex usage feedback.

## Do Not Forget

- v1.7.0 AND v1.7.1 are shipped but **not** git-tagged, **not** released on GitHub. Tag only after cross-trigger validation passes.
- SSH port 22 is blocked in current env. Use HTTPS for git push: `git push https://github.com/JamesShi96/project-butler.git main`.
- Debug mode (`PROJECT_BUTLER_UPDATE_CHECK_DEBUG=1`) is **external shell only** — CC captures stderr into LLM context.
- `PROJECT_BUTLER_NO_UPDATE_CHECK=0` does **not** silence — only literal `"1"` does.
- Cursor/Codex update-check is manual/on-demand only; for non-default installs the user must `export PROJECT_BUTLER_SKILL_DIR=<path>` first.
- `jq` is NOT installed in this env — session-history recovery scripts must use python3, not jq.
