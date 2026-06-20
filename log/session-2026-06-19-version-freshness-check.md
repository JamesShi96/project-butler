# Session 2026-06-19 — Version Freshness Check

> **Final state (2026-06-20)**: This log captures the *process* — 4
> rounds of staff/PM spec review, multiple spec iterations (v1→v6),
> Codex spec branch, etc. Most of that process work was **deliberately
> discarded** in the final MVP simplification pass on 2026-06-20.
> What actually shipped:
> - `references/update-check.md` (~100 lines, runtime reference)
> - `docs/prd/features/version-freshness-check.md` (~131 lines, MVP spec)
> - Code is ~250 lines total
> - Live-validated (Phase 1+2+3): first install, cache hit, pull
>   recovery, SSH fail-fast, banner verbatim
> - Codex spec (`docs/prd/features/codex-update-check.md`) was
>   written and then deleted as premature branching
> - SSH ConnectTimeout=5 fix was the one real bug found in live
>   validation (not in any spec review round)
>
> Reading the rest of this log is for historical context only — it
> documents a textbook case of review-driven scope creep that
> eventually got reined back in. The lesson: live validation finds
> real bugs, spec review mostly adds chapters.

## Session Goal

Design and implement automatic skill-update detection for project-butler, so users discover when their installed skill is behind upstream without manually checking the repo.

## Key Actions (Chronological)

- **Full project context recovery** ("全面回顾") — reviewed all prior sessions, UPDATE_LOG, handoff, current state at v1.6.0 (Profile System runtime wiring checkpoint).
- **Discussed the user need**: existing users drift silently; how should project-butler detect and announce its own updates? Evaluated 3 approaches:
  - A: skill-side cached `git fetch` + version check
  - B: switch to CC plugin distribution, rely on platform update check
  - C: A + B hybrid
  - Chose **A**: doesn't depend on platform features, no user migration, minimal sunk cost.
- **Reviewed external proposal** (git fetch + rev-list --count) and merged into final design — cleaner than the original curl + VERSION file plan because git is the single source of truth and commit count carries more information than tag comparison.
- **Wrote spec across 4 iterations** with two rounds of staff engineer / senior PM review:
  - v1 → v2: fixed 5 blockers + 6 important issues (English-only banner, inline opt-out, debug mode, prompt discipline, nested if/else, Test Plan, Cursor scope, plugin non-git handling, git status side effect, banner placement, telemetry-by-design).
  - v2 → v3: fixed 3 real bugs + 4 product honesty issues (mkdir -p for cache parent, dual-keyed cache invalidation on HEAD SHA, debug mode external-shell-only, Reach Limitation, multi-line banner block, write-trigger footnote placement, commit-count tradeoff acknowledged).
  - v3 → v4: concision pass, 610 → 444 lines.
- **Implemented all File Changes from spec**:
  - `references/update-check.md` — new runtime reference (157 lines).
  - `SKILL.md` — description mention + `<EXTREMELY_IMPORTANT>`-wrapped Step -1 before Step 0 routing.
  - `.gitignore` — new, ignores `.claude/.version-check.txt`.
  - `README.md` + `README_zh.md` — "Updating project-butler" section.
  - `UPDATE_LOG.md` — v1.7.0 entry (not tagged).
- **Discovered real bug during verification**: `git fetch` over SSH origin hangs (not fails) on missing credentials. Fixed by prefixing `GIT_TERMINAL_PROMPT=0` — synced across spec, reference, and Failure Modes.
- **Verification passed**: cache-hit path, fetch-failure fallback (BEHIND stays 0, no cache write, clean `git status`), SHA-mismatch invalidation (correctly triggers fetch on simulated pull).
- **Commit `26a265c feat: wire version freshness check runtime`** — 7 files, +715 -1.
- **Push**: SSH port 22 blocked (DNS hijack to `198.18.0.10`); succeeded via HTTPS fallback `git push https://github.com/JamesShi96/project-butler.git main`.

## Decisions & Rationale

- **Approach A over B/C**: doesn't depend on CC platform update features, requires no user migration, retires cleanly if plugin-platform updates ever ship.
- **git fetch + rev-list --count over VERSION file**: git is the single source of truth; commit count is richer than tag comparison; no release-time sync burden.
- **24h time + HEAD SHA dual-keyed cache**: time alone leaves stale banner for 24h after pull (core UX broken); SHA alone fetches too often. Dual-key clears banner immediately after pull while bounding fetch cost to ≤1/day.
- **Plain text cache over JSON**: macOS doesn't ship `jq`; `grep + cut -f2-` is universal.
- **English-only banner in v1**: project-butler is distributed globally; Chinese default would alienate non-Chinese users. Locale-aware deferred to v2.
- **Banner placement: read prepend / write footnote**: write triggers (`end session` etc.) should not lead the response with a banner — disrupts the action narrative.
- **Debug mode external-shell-only**: CC captures stderr into the LLM context; debug output would leak into user-facing responses. Critical scope limitation explicitly documented.
- **GIT_TERMINAL_PROMPT=0**: prevents SSH hang on missing credentials. Found during verification, not in initial design — would have shipped a hung-skill bug otherwise.
- **Pre-release checkpoint, not v1.7.0 release**: v1.7.0 entry logged but not tagged. Live validation and formal release deferred per user instruction.
- **Spec concision matters**: 610-line spec for a patch-level feature is over-engineered. Cut to 444 in v4. Target ≤400 lines for patch features going forward.

## Output Files

- `docs/prd/features/version-freshness-check.md` — spec v4 (444 lines)
- `references/update-check.md` — runtime reference (157 lines)
- `SKILL.md` — description mention + Step -1 `<EXTREMELY_IMPORTANT>`
- `.gitignore` — new
- `README.md` / `README_zh.md` — "Updating project-butler" / "更新 project-butler" section
- `UPDATE_LOG.md` — v1.7.0 entry
- `log/session-2026-06-19-version-freshness-check.md` — this log
- `session-handoff.md` — refreshed

Commit: `26a265c feat: wire version freshness check runtime` (pushed to `origin/main` via HTTPS).

## Unfinished Items / Next Session Pickup

- **Live validation (spec Test Plan #13)**: invoke `/project-butler` in a disposable empty project; verify Step -1 runs and banner appears when behind; verify "Base directory" line is present across interactive / subagent / continue / status / headless modes.
- **Formal v1.7.0 release**: tag + GitHub Release. Deferred until live validation passes.
- **Network workaround**: SSH port 22 blocked in current environment. Consider `git remote set-url origin https://github.com/JamesShi96/project-butler.git` to avoid future manual HTTPS fallback.
- **Cursor parity**: project-butler works in Cursor via `.cursor/rules/`, but Version Freshness Check is CC-only. Separate future feature.
- **v1.1 candidate**: tag-based version reporting ("v1.7.0 available" instead of "N commits behind"). Acknowledged tradeoff in spec Decision #2.

## CLAUDE.md Candidates

- **For any prompt-based skill feature**: silent failure paths require a debug diagnostic mode. Silent + unobservable = unmaintainable.
- **For bash snippets intended for LLM execution**: use nested `if/else`, never `return` or `exit`. Top-level bash snippets can't return from a function, and `exit` kills the harness shell session.
- **For spec documents**: target ≤400 lines for patch-level features. Run a concision pass before implementation.
- **For `git fetch` in any automation**: prefix with `GIT_TERMINAL_PROMPT=0` to prevent SSH hang on missing credentials. Discovered the hard way during Version Freshness Check verification.
