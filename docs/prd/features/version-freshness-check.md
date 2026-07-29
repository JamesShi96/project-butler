# Version Freshness Check

Status: Shipped v1.7.3 (`8a0f463`, live-validated 2026-07-17)

## What It Does

Every project-butler invocation starts with a version check: if the
installed skill is behind `origin/main`, Claude Code presents an
interactive update prompt (Update now / Remind me later / Stop
reminding), at most once per 24h. The check itself is cached, so the
cost is at most one `git fetch` per machine per day. Never auto-pulls
unless the user picks "Update now".

The script emits a stable machine-readable token that the adapter turns
into the prompt — it is never printed to the user verbatim:

```
VERSION_NOTICE: project-butler is N commits behind upstream.
  → Update: cd <path> && git pull
  → Silence: PROJECT_BUTLER_NO_UPDATE_CHECK=1
```

The prompt is worded in the project's CLAUDE.md `Language:` setting
(en / zh / bilingual, default en).

**Scope**: Claude Code skill loader only. The feature relies on CC's
"Base directory for this skill: <path>" prompt line. Cursor / Codex /
other tools lack the trigger mechanism for automatic per-invocation
checking. They can run the shared script manually.

## How It Works

`SKILL.md` Step -1 (wrapped in `<EXTREMELY_IMPORTANT>`) instructs the
LLM to read `references/update-check.md` and run one Bash command.
That reference resolves `SKILL_DIR` from the "Base directory" line and
calls:

```bash
bash "$SKILL_DIR/scripts/check-update.sh" "$SKILL_DIR"
```

`scripts/check-update.sh` is the detection source of truth. It reads
cache, optionally fetches, computes `behind_by = rev-list --count
HEAD..origin/main`, updates cache, and prints the `VERSION_NOTICE:`
block if `behind_by > 0` and the prompt has not already fired in the
last 24h (tracked in `.claude/.version-prompt`).

On seeing `VERSION_NOTICE:`, the LLM presents one AskUserQuestion
instead of printing the block:

- **Update now** → run `bash "$SKILL_DIR/scripts/check-update.sh"
  --pull "$SKILL_DIR"` (fast fetch + ff-only pull), then report its
  `UPDATE_OK` / `UPDATE_FAILED` output. `UPDATE_FAILED` carries the
  manual command plus an HTTPS fallback.
- **Remind me later** → do nothing; the script's own 24h throttle
  prevents re-asking today.
- **Stop reminding** → tell the user to set
  `PROJECT_BUTLER_NO_UPDATE_CHECK=1`.

`--pull` is the only path that may modify the skill working tree, and
only because the user explicitly selected it.

`references/update-check.md` is the Claude Code adapter source of
truth. `scripts/check-update.sh` is the detection source of truth. This
spec captures the design rationale; if they diverge, the runtime
reference and script win.

## Cache

Path: `<SKILL_DIR>/.claude/.version-check.txt` (gitignored)
Format: three `key=value` lines, UTF-8, `\n`:

```
last_check=1718600000
behind_by=3
head_sha=abc123def4567890abcdef1234567890abcdef12
```

**Dual-keyed invalidation**: cache is valid only when (a) age < 24h
AND (b) current `HEAD` SHA matches cached `head_sha`. Either failing
triggers a fresh fetch. The SHA key ensures the notice disappears on
the next invocation after the user pulls — no 24h stale-notice limbo.

Parent `.claude/` directory is created via `mkdir -p` on first
successful fetch. Cache write failure (read-only FS, permission
denied, disk full) silently degrades to no-cache mode.

**Prompt throttle**: `<SKILL_DIR>/.claude/.version-prompt` (gitignored)
holds a single unix timestamp of the last time the `VERSION_NOTICE:`
block was emitted. The block is suppressed unless ≥ 86400s have
passed, so the interactive prompt fires at most once per 24h even
while `behind_by > 0` on every invocation.

## Env Vars

- `PROJECT_BUTLER_NO_UPDATE_CHECK=1` — skip the entire check. **Literal
  `"1"` only** — `=0`, `=false`, empty do NOT silence (counter-intuitive
  but intentional).
- `PROJECT_BUTLER_UPDATE_CHECK_DEBUG=1` — diagnostic output to stderr.
  **External shell only.** CC captures stderr into the LLM context;
  running debug inside CC leaks output into user-facing responses.

## Key Decisions

1. **git fetch + rev-list --count** (not a `VERSION` file). Git is
   the single source of truth; no release-time sync burden.

2. **24h + HEAD SHA dual-keyed cache.** Time alone leaves a stale
   notice for 24h after pull (broken UX). SHA alone fetches too often.
   Dual-key clears the notice immediately after pull while bounding
   fetch cost to ≤1/day/machine.

3. **Plain text cache** (not JSON). macOS does not ship `jq`. Parses
   with `grep + cut -f2-`.

4. **`GIT_SSH_COMMAND` with `ConnectTimeout=5` + `GIT_TERMINAL_PROMPT=0`**.
   `ConnectTimeout=5` bounds SSH TCP connect to 5s (default is ~2
   minutes — would hang the entire skill invocation in firewalled /
   China-mainland / corp environments where port 22 is blocked).
   `GIT_TERMINAL_PROMPT=0` blocks HTTPS credential prompts. Both
   required; neither alone is sufficient. Verified in live validation.

5. **Never auto-pull without consent.** v1.7.0–v1.7.2 only showed the
   upgrade command. v1.7.3 keeps that rule but adds a user-selected
   "Update now" action so the pull happens in one step instead of
   sending the user to a shell. Nothing pulls unless explicitly chosen.

6. **Script extraction for multi-tool use.** Claude Code still gets
   automatic Step -1 checks. Cursor, Codex, and other tools can call
   `scripts/check-update.sh` manually or through best-effort adapter
   instructions, but they do not get automatic per-invocation checks.

7. **Interactive prompt over passive banner (v1.7.3).** A banner
   prepended to every response is visual noise the user cannot act on
   in place. An AskUserQuestion throttled to once per 24h is both
   quieter and more actionable. The `VERSION_NOTICE:` token stayed
   unchanged so the Cursor / Codex templates needed no edits.

8. **Language follows the project, not the skill.** `detect_lang()`
   reads the *current project's* CLAUDE.md `Language:` field so the
   prompt matches the language the user is already working in;
   defaults to English when no marker is present.

## Edge Cases

| Situation | Behavior |
|---|---|
| No "Base directory" line in CC prompt | Skip silently |
| `.claude/` directory missing | `mkdir -p` on first successful fetch |
| Cache missing or corrupt | Fetch, create cache |
| Cache fresh in time but SHA mismatch | Fetch (user pulled or reset) |
| `git fetch` fails (offline, port 22 blocked, non-git path) | Use cached `behind_by`; no cache update |
| SSH port 22 blocked (firewall, China mainland, corp net) | `ConnectTimeout=5` bounds hang to 5s |
| `mkdir -p` or cache write fails (read-only FS, permission, disk full) | Silently degrade to no-cache mode |
| Plugin install (path is not a git repo) | Silently skip; no notice |
| Behind upstream, already prompted < 24h ago | No `VERSION_NOTICE:`; no prompt |
| `.version-prompt` missing or non-numeric | Treated as never prompted → prompt fires |
| "Update now" but pull fails (local changes, offline, SSH blocked) | `UPDATE_FAILED` + manual command + HTTPS fallback |
| No CLAUDE.md / no `Language:` field in current project | Notice defaults to English |
| Cursor / Codex usage | Manual/on-demand script invocation only |

## Test Plan

Critical tests. Live-validated 2026-06-20 (Phase 1+2+3).

1. **First install** ✅: cache missing → fetch → cache created with
   correct three-line format.
2. **Cache hit** ✅: same HEAD within 24h → no fetch (cache mtime
   unchanged).
3. **Pull recovery (critical UX)** ✅: cache shows `behind_by=N`;
   user pulls (`git merge --ff origin/main`); next invocation → SHA
   mismatch triggers fetch → `behind_by=0` → banner disappears
   immediately.
4. **SSH fail fast** ✅: port 22 blocked → fetch fails in ~5s (not
   ~2min) → no banner but skill remains responsive.
5. **Script standalone**: `bash scripts/check-update.sh <skill-dir>`
   preserves the same cache, fetch, and detection behavior as the
   former inline runtime snippet.

### v1.7.3 interactive prompt — live-validated 2026-07-17 (5/5)

| # | Test | Result |
|---|---|---|
| T1 | Seeded behind-cache → `VERSION_NOTICE` fires with correct count | ✅ (English — no CLAUDE.md → default) |
| T2 | 24h throttle — second same-day invocation is silent | ✅ |
| T3 | Language adaptation — `zh` → Chinese, `bilingual` → both | ✅ |
| T4 | AskUserQuestion three-option prompt presented | ✅ |
| T5 | "Update now" → `--pull` | ✅ `UPDATE_OK` |

T5 exercised the **success** path: SSH port 22 happened to be reachable
in that environment. The `UPDATE_FAILED` fallback was covered by 5
self-tests in the prior session, not by this live run.

**Cross-trigger coverage** (validated 2026-07-10 against a forced-behind
cache): `status` ✅, `continue` ✅ (missed once, then fired — first live
i18n confirmation), `/project-butler` ✅. Finding: Step -1 firing is
**best-effort** — it depends on the LLM following a soft instruction, so
an occasional miss is inherent and accepted.

Not validated: multi-mode "Base directory" line presence (subagent /
headless).

## Shipped

- `26a265c` (2026-06-19) — feature implementation (v1.7.0)
- `23c573e` (2026-06-20) — SSH ConnectTimeout fix (live validation finding)
- Live validation Phase 1+2+3 passed 2026-06-20
- `855a946` (2026-06-21) — script extraction for multi-tool use (v1.7.1)
- `b5d2119` (2026-06-24) — fetch-failure fallback + corrupt-cache fix (v1.7.2)
- `8a0f463` (2026-07-10) — interactive prompt + language-aware notice (v1.7.3)
- Interactive-prompt live validation passed 2026-07-17 (5/5)
