# Version Freshness Check

Status: Shipped v1.7.0 (`26a265c`, live-validated 2026-06-20)

## What It Does

Every project-butler invocation starts with a version check: if the
installed skill is behind `origin/main`, the next response carries a
three-line banner block. The check is cached, so the cost is at most
one `git fetch` per machine per day. Never auto-pulls.

```
VERSION_NOTICE: project-butler is N commits behind upstream.
  → Update: cd <path> && git pull
  → Silence: PROJECT_BUTLER_NO_UPDATE_CHECK=1
```

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
HEAD..origin/main`, updates cache, and prints the banner block if
`behind_by > 0`.

The LLM prepends the banner block verbatim — never paraphrases, never
auto-pulls.

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
triggers a fresh fetch. The SHA key ensures the banner disappears on
the next invocation after the user pulls — no 24h stale-banner limbo.

Parent `.claude/` directory is created via `mkdir -p` on first
successful fetch. Cache write failure (read-only FS, permission
denied, disk full) silently degrades to no-cache mode.

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
   banner for 24h after pull (broken UX). SHA alone fetches too often.
   Dual-key clears the banner immediately after pull while bounding
   fetch cost to ≤1/day/machine.

3. **Plain text cache** (not JSON). macOS does not ship `jq`. Parses
   with `grep + cut -f2-`.

4. **`GIT_SSH_COMMAND` with `ConnectTimeout=5` + `GIT_TERMINAL_PROMPT=0`**.
   `ConnectTimeout=5` bounds SSH TCP connect to 5s (default is ~2
   minutes — would hang the entire skill invocation in firewalled /
   China-mainland / corp environments where port 22 is blocked).
   `GIT_TERMINAL_PROMPT=0` blocks HTTPS credential prompts. Both
   required; neither alone is sufficient. Verified in live validation.

5. **Never auto-pull.** Show the upgrade command; the user runs it.

6. **Script extraction for multi-tool use.** Claude Code still gets
   automatic Step -1 checks. Cursor, Codex, and other tools can call
   `scripts/check-update.sh` manually or through best-effort adapter
   instructions, but they do not get automatic per-invocation checks.

## Edge Cases

| Situation | Behavior |
|---|---|
| No "Base directory" line in CC prompt | Skip silently |
| `.claude/` directory missing | `mkdir -p` on first successful fetch |
| Cache missing or corrupt | Fetch, create cache |
| Cache fresh in time but SHA mismatch | Fetch (user pulled or reset) |
| `git fetch` fails (offline, port 22 blocked, non-git path) | Use cached `behind_by`; no banner update |
| SSH port 22 blocked (firewall, China mainland, corp net) | `ConnectTimeout=5` bounds hang to 5s |
| `mkdir -p` or cache write fails (read-only FS, permission, disk full) | Silently degrade to no-cache mode |
| Plugin install (path is not a git repo) | Silently skip; no banner |
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
5. **Banner verbatim** ✅: three-line `VERSION_NOTICE:` block
   delivered as-is — never paraphrased.
6. **Script standalone**: `bash scripts/check-update.sh <skill-dir>`
   preserves the same cache, fetch, and banner behavior as the former
   inline runtime snippet.

Remaining tests not yet validated from a live CC session (require
new session to verify Step -1 trigger across `/project-butler`,
`status`, `continue`, `end session`):

- Cross-trigger coverage (does Step -1 run on every trigger?)
- Banner prepend behavior in real LLM response
- Multi-mode "Base directory" line presence (subagent / headless)

## Shipped

- `26a265c` (2026-06-19) — feature implementation
- `23c573e` (2026-06-20) — SSH ConnectTimeout fix (live validation finding)
- Live validation Phase 1+2+3 passed 2026-06-20
