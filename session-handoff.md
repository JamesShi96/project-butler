# Session Handoff — Project Butler

> Last updated: 2026-06-24

## Current State

**v1.7.2 test-driven hardening — committed.** Patch on top of v1.7.1.

This session ran a full test pass of the major features and fixed every real defect found:

- **Project Profile System** — 6 use cases (SaaS / AI-agent / research / client-deliverable / lightweight / internal-pipeline) + 3 adversarial scenarios (ambiguous intake / triple protected-section assault / cross-session flip-flop). Zero hard failures. Fixes: shape-summary leak on evolution proposals; optional `maintenance.multi_contributor` + pending `touches_protected_section`/`gated_artifacts` fields; `review_queue` terminal rule; Required-cap clarification.
- **File reorganization** — 10/10 hard rules held across 5 scenarios. Fix: moving a file now also fixes the moved file's own relative references.
- **Document archiving** — adversarial guards all held. Fix: generic filename keywords defer to content analysis instead of mis-filing content-rich docs.
- **Update log** — 13/13 version computations correct. Fix: patch-level significant changes in codename/patch/date styles record as Minor instead of being dropped; calc table aligned.
- **Version freshness check (`scripts/check-update.sh`)** — two real latent bugs fixed, reproduced and re-verified with regression tests:
  - L1: corrupt non-numeric `last_check` no longer leaks an arithmetic error to stderr (numeric guard).
  - L2: on `git fetch` failure it now falls back to the last SHA-valid cached `behind_by` instead of reporting 0 — no longer fails closed for offline / port-22-blocked users.
  - L3 (the 3rd previously-deferred bug, `resolve_skill_dir` wrong-repo) was tested and is NOT reproducible — effectively dead code. The "3 deferred latent bugs" cluster is now closed.

## Next Session Start

Recommended prompt: `continue full context`

THE remaining ship-blocker (now the only one):

- **Cross-trigger live validation of Step -1** in a fresh Claude Code session — run `/project-butler`, `status`, `continue`, `end session` and confirm the loader fires the version check and the banner lands verbatim (prepend for read triggers, footnote for write triggers). A subagent cannot reproduce a real top-level skill load, so this needs real fresh sessions. The forced-cache recipe still works post-fix: write `.claude/.version-check.txt` with `last_check=9999999999`, `behind_by=2`, `head_sha=<current HEAD>`; clean up after.
- After validation passes: tag v1.7.0 / v1.7.1 / v1.7.2 and create GitHub Releases (still none tagged).

## Do Not Forget

- v1.7.0–v1.7.2 are committed but NOT git-tagged, NOT released on GitHub. Tag only after the cross-trigger validation passes.
- SSH port 22 is blocked in this environment. Use HTTPS for git push: `git push https://github.com/JamesShi96/project-butler.git main`. Plain `git fetch`/`pull` over SSH times out (~2 min) — use the HTTPS + `gh` credential path.
- Debug mode (`PROJECT_BUTLER_UPDATE_CHECK_DEBUG=1`) is external-shell only — CC captures stderr into context.
- `PROJECT_BUTLER_NO_UPDATE_CHECK=0` does NOT silence — only literal `"1"` does.
- `jq` is NOT installed — session-history scripts must use python3.
- Test artifacts from this session live under the scratchpad (`pb-test/`), not in the repo.
