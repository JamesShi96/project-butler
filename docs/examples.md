# Examples

This page shows how project-butler feels in practice.

## Example 1: First-Time Setup

User:

```text
/project-butler
```

Assistant asks:

```text
Project name?
One-sentence description?
Current stage?
GitHub repository?
Create Cursor rules?
Language?
```

Generated files:

```text
CLAUDE.md
PROJECT.md
STRUCTURE.md
UPDATE_LOG.md
session-handoff.md
TODO.md
log/.gitkeep
.claude/candidates.md
.claude/.file-snapshot.json
.cursor/rules/project-system.mdc   # if selected
```

Result:

```text
The project now has a durable memory stack.
Future sessions can read the current state, rules, tasks, and handoff notes.
```

## Example 2: End a Work Session

User:

```text
end session
```

Assistant does:

1. Writes a session log under `log/`.
2. Updates `session-handoff.md`.
3. Syncs `PROJECT.md` if the project state changed.
4. Updates completed items in `TODO.md`.
5. Adds candidate rules to `.claude/candidates.md`.
6. Runs incremental file organization.
7. Evaluates whether the work deserves an `UPDATE_LOG.md` entry.
8. Offers GitHub Release creation for significant milestones.

Example generated session log:

```markdown
# Session 2026-05-05 - Authentication Flow

## Session Goal
Ship login, refresh token, and logout endpoints.

## Key Actions (Chronological)
- Added JWT refresh token model.
- Created login/register/logout routes.
- Wrote integration tests.

## Decisions & Rationale
- Store refresh tokens hashed to reduce blast radius.
- Keep access token TTL short.

## Output Files
- src/auth/routes.ts
- src/auth/tokens.ts
- tests/auth.test.ts

## Unfinished Items / Next Session Pickup
- Add password reset flow.
- Document auth environment variables.

## CLAUDE.md Candidates (if any)
- Always hash long-lived tokens before storing them.
```

## Example 3: Continue the Next Day

User:

```text
continue
```

Assistant reads:

- latest session log,
- `session-handoff.md`,
- `PROJECT.md`,
- active TODOs,
- relevant project rules.

Assistant responds with:

```text
Last session completed login/register/logout and auth tests.
Remaining work: password reset flow and auth env var docs.
Recommended next step: implement password reset token generation.
```

The user can continue without re-explaining the project.

## Example 4: Full Context Recovery

User:

```text
continue full context
```

Assistant reads:

- latest session in detail,
- historical session summaries,
- current project wiki,
- update log,
- active TODOs,
- project rules.

Use this when returning after a long break or when switching assistants.

## Example 5: Review Project Rules

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

## Example 6: Use with Multiple Assistants

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
```

The assistant now has the same project state, even though it is a different tool.
