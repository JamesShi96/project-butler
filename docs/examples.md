# Examples

This page shows the product flow first, then the internal details.

## Daily Use

Most users only need this loop:

```text
/project-butler   # set up project memory once
end session       # save progress when stopping
continue          # resume next time
status            # check the current project state
```

That loop keeps the AI assistant aligned without requiring the user to understand the underlying files.

## Example 1: First-Time Setup

User:

```text
/project-butler
```

Assistant asks for the required project basics and offers recommended defaults:

```text
Project name?
What are you trying to do with this project?
Current stage?

I understand this as:
- Project shape: AI agent SaaS MVP
- Main output: web product with agent behavior
- Main drift risks: product scope, eval quality, architecture boundaries

Recommended structure:
- Required: docs/prd/, docs/architecture/, docs/evals/
- Recommended: docs/roadmap/, docs/failure-cases/
- Optional: docs/design-system/, docs/research/

Confirm or edit before files are created?
```

Result:

```text
Project memory is ready.

Daily commands:
- end session — save progress
- continue — resume next time
- status — check current state

Advanced:
- review claude — approve long-term rules when needed
```

Generated files include:

```text
CLAUDE.md
PROJECT.md
STRUCTURE.md
UPDATE_LOG.md
DOCS.md
session-handoff.md
TODO.md
docs/
log/.gitkeep
.claude/candidates.md
.claude/project-profile.json       # when Profile System is enabled
.claude/profile-pending.json       # when Profile System is enabled
.claude/.file-snapshot.json
.cursor/rules/project-system.mdc   # if selected
```

## Example 2: End a Work Session

User:

```text
end session
```

Assistant responds with a result-focused summary:

```text
Session saved.

Updated:
- Handoff refreshed
- TODO updated: 3 done, 2 active
- Profile: no profile impact
- Project wiki synced
- Documents archived: 1
- Update log: v1.5.0 added

Next:
- Add password reset flow
- Document auth environment variables
- Review 1 pending rule candidate
```

Internally, project-butler writes the session log, refreshes handoff/project/TODO state, organizes new files, archives documents, and records milestone updates when needed.

## Example 2B: Normal Close With Profile Impact

User:

```text
normal close
```

Assistant detects that the session touched a long-lived profile area:

```text
Session saved.

Updated:
- Handoff refreshed
- TODO updated: 1 done, 3 active
- Profile: 2 updates recorded as pending
- Project wiki synced

Pending profile updates:
- PRD: billing capability may need a feature sub-doc
- Evals: new agent behavior needs an eval case

Next:
- Run full close when you want affected profile docs aligned
```

Normal Close is low-friction. It does not patch PRD, architecture, roadmap, evals, or other long-lived profile docs.

## Example 2C: Full Close With Scope Plan

User:

```text
full close
```

Assistant first presents a bounded plan:

```text
Full Close Scope Plan

Will read:
- docs/prd/features/billing.md
- docs/evals/cases/agent-billing.md

May change:
- docs/prd/features/billing.md
- docs/evals/cases/agent-billing.md
- docs/prd/main.md Feature Index

Auto-apply:
- update feature index link
- append eval case note

Requires confirmation:
- add billing to Stable Baseline

Will not touch:
- docs/prd/main.md Stable Baseline
- unrelated architecture modules
```

After the user approves the Scope Plan, project-butler applies safe updates inside that boundary and leaves high-risk semantic changes as proposals.

## Example 3: Continue the Next Day

User:

```text
continue
```

Assistant reads the latest session context, handoff, project wiki, active TODOs, update log, document index, and relevant rules.
If profile files exist, it also reads `.claude/project-profile.json` and `.claude/profile-pending.json`.

Assistant responds with:

```text
Last session completed login/register/logout and auth tests.
Remaining work: password reset flow and auth environment docs.
Recommended next step: implement password reset token generation.
```

The user can continue without re-explaining the project.

## Example 4: Check Status

User:

```text
status
```

Assistant responds like a compact project dashboard:

```text
Current Status

Project:
- Stage: MVP build
- Focus: authentication flow and project memory stability

Active Work:
- Add password reset flow
- Document auth environment variables
- Review pending rule candidates

Recent Change:
- v1.5.0 added versioned update log support

Profile:
- Shape: AI agent SaaS MVP
- Pending profile updates: 2
- Profile debt: 0
- Review needed: 0

Next Best Step:
- Implement password reset token generation
```

## Example 5: Full Context Recovery

User:

```text
continue full context
```

Assistant rebuilds the broader project trajectory from:

- latest session details,
- historical session summaries,
- current project wiki,
- update log,
- document index,
- project profile and pending profile queue, when present,
- active TODOs,
- project rules.

Use this when returning after a long break or when switching assistants.

## Example 6: Review Project Rules

During normal work, project-butler collects candidate rules:

```markdown
## Pending

- Always write tests before refactoring auth code.
- Keep API route filenames in kebab-case.
- Never move generated files into source directories.
```

User:

```text
review claude
```

Assistant presents each candidate for confirmation:

```text
Candidate: Always write tests before refactoring auth code.
Accept, reject, or rewrite?
```

Only accepted rules are promoted into the project constitution.

## Example 7: Use with Multiple Assistants

1. Initialize with Claude Code.
2. End the session and generate `session-handoff.md`.
3. Open the same project in Cursor or Codex.
4. Ask the assistant to read:

```text
PROJECT.md
session-handoff.md
TODO.md
STRUCTURE.md
UPDATE_LOG.md
DOCS.md
.claude/project-profile.json
.claude/profile-pending.json
```

The assistant now has the same project state, even though it is a different tool.
