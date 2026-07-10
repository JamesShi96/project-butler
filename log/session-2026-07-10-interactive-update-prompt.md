# Session 2026-07-10 — Interactive Update Prompt + Language-Aware Notice

## Session Goal
Live-validate the version freshness check across triggers, then redesign the update notice from a passive banner into an interactive, throttled, localized update prompt.

## Key Actions (Chronological)
- Live cross-trigger validation with a forced-behind cache: `status` → banner prepended verbatim ✓ (top); `continue` → missed once, then fired ✓ (top, bilingual — first live i18n confirmation); `/project-butler` → footnote landed correctly at the end of the completed upgrade ✓. Conclusion: Step -1 firing is best-effort (one observed miss); read/write placement itself was actually correct.
- Added a language-aware banner: `check-update.sh` reads the current project's CLAUDE.md `Language:` field (en / zh / bilingual), default en. Self-tested 4 cases.
- Redesigned the notice as Option C — an interactive AskUserQuestion prompt (Update now / Remind me later / Stop reminding), throttled to once per 24h, with a new `--pull` subcommand (fast fetch + ff-only pull; manual + HTTPS fallback on failure). Self-tested 5 cases (throttle, --pull failure fallback, silence, behind=0).
- Rewrote SKILL.md Step -1 and references/update-check.md to drive the interactive prompt instead of printing the banner. Kept the `VERSION_NOTICE:` token so Cursor / Codex templates need no change.

## Decisions & Rationale
- Interactive prompt over always-prepend banner: the user does not want a version line atop every response; wanted a Claude-Code-style "update?" prompt. A skill cannot open a native dialog, so AskUserQuestion is the closest achievable.
- 24h throttle owned by the script (writes `.claude/.version-prompt` on emit): favors "occasionally miss" over "occasionally nag".
- `VERSION_NOTICE:` token kept stable to avoid touching Cursor/Codex adapter templates.

## Output Files
- scripts/check-update.sh, SKILL.md, references/update-check.md, UPDATE_LOG.md, session-handoff.md

## Unfinished Items / Next Session Pickup
- Live-validate Option C in a fresh session: interactive prompt appears (once), localized, "Update now" runs `--pull` (expect UPDATE_FAILED here — SSH blocked — with HTTPS fallback), 24h throttle suppresses the second invocation.
- Doc sweep: `docs/prd/features/version-freshness-check.md` and README still describe the old always-prepend banner — update to the interactive-prompt model.
- Tag + GitHub Release for v1.7.0–v1.7.3 still deferred until validation completes.
- Test cache is seeded (`.claude/.version-check.txt` behind_by=2); after any new commit the HEAD changes, so re-seed with the new HEAD and `rm .claude/.version-prompt` to test the prompt again.

## CLAUDE.md Candidates
- None.
