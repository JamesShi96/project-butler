# Project Butler PRD

Status: Draft
Last updated: 2026-06-08

## Product Definition

Project Butler is a project memory system for AI coding assistants.

It helps Claude Code, Cursor, Codex, and similar tools keep project context across sessions by maintaining durable project files: rules, project wiki, handoff notes, TODOs, update logs, document indexes, session logs, and file organization rules.

Project Butler is not a general project-management SaaS. It is a local, file-based memory layer for AI-assisted work.

## Target Users

- Users who work with AI coding assistants across many sessions.
- Users who switch between Claude Code, Cursor, Codex, or other assistants.
- Users whose projects drift because decisions, TODOs, documents, and file structure live only in chat history.
- Users building mixed projects: software products, AI agents, SDKs, research, operations, client delivery, or creative work.

## Core Problem

AI assistants are strong inside one session but weak across sessions.

Without durable project memory:

- The user repeats architecture and product context.
- TODOs and README-style summaries drift from reality.
- Stable rules are forgotten.
- New files scatter across the project.
- Product, architecture, roadmap, research, and delivery documents do not stay aligned with actual work.
- AI agents solve the local request but lose the larger project frame.

## Product Principles

1. **Users speak naturally. AI structures the project.**
   Users should not need to learn Project Butler's internal taxonomy.

2. **Project memory should stay small enough to use.**
   Required documents should be minimal. Recommended documents should be removable. Optional documents should not be created without confirmation.

3. **Stable reference docs matter.**
   Good AI-assisted work needs PRDs, architecture notes, roadmaps, eval plans, research summaries, or equivalent reference documents when the project has earned them.

4. **Daily workflow stays lightweight.**
   Normal use should still be `/project-butler`, `continue`, `status`, and `end session`.

5. **Deeper sync is explicit.**
   Full project-document alignment should happen only through clear close modes, impact scans, and bounded plans.

6. **Confirmed knowledge is protected.**
   AI may append, patch active sections, and create sub-docs, but it must not rewrite confirmed baselines without explicit user approval.

7. **Machine-readable state is required for reliable behavior.**
   Important Project Butler configuration should not depend only on prose in Markdown.

8. **Pending work must not rot.**
   Deferred profile updates need lifecycle tracking so repeated deferrals become visible profile debt.

9. **Large-project sync must be scoped.**
   Full Close on mature projects must declare what it will read, what it may change, and what it will not touch.

10. **Document policies have one source of truth.**
   `.claude/project-profile.json` is canonical for owners, status, update policies, and protected sections. Markdown front matter may mirror this for humans, but it does not override JSON.

11. **Full Close can act, but only inside safe boundaries.**
   Safe patch-level updates may be applied after the user selects Full Close. Policy changes, protected sections, section rewrites, and document rewrites still require confirmation.

12. **Confirm boundaries, not every small edit.**
   Full Close should avoid interrupting the user for each safe update. It should ask the user to approve the scope and high-risk changes, then batch safe updates inside that approved boundary.

## Core Workflows

### Setup

User runs `/project-butler`.

Project Butler creates or upgrades the project memory system:

- `CLAUDE.md`
- `PROJECT.md`
- `STRUCTURE.md`
- `UPDATE_LOG.md`
- `DOCS.md`
- `session-handoff.md`
- `TODO.md`
- `docs/`
- `log/`
- `.claude/candidates.md`
- `.claude/file-snapshot.json`

Future Profile System behavior should extend this setup with a generated project profile and profile-aware document recommendations.

With Profile System enabled, setup becomes Foundation Setup: Project Butler creates a small baseline reference system from natural-language intake, writes `.claude/project-profile.json` and `.claude/profile-pending.json`, and avoids pretending uncertain projects are fully specified.

### Continue

User says `continue`.

Project Butler reads recent session context, handoff, project wiki, active TODOs, update log, document index, and project rules to restore working state.

### Status

User says `status`.

Project Butler returns a compact current-state dashboard. With Profile System enabled, this dashboard should become profile-aware.

### End Session

User says `end session` / `收工`.

Project Butler writes a session log, updates handoff/TODO/project state, organizes files, archives documents, writes update-log entries when significant, and summarizes next steps.

With Profile System enabled, end session first performs an impact scan. If profile documents are affected, the user can choose Normal Close or Full Close.

Full Close must remain bounded. Large projects require a scope plan before profile documents are read or changed.

### Review Rules

User says `review claude`.

Project Butler presents candidate long-term project rules for user review. It must not automatically promote rules into `CLAUDE.md`.

### Organize Files

User says `organize files` / `整理文件`.

Project Butler scans files, proposes safe moves, and updates structure rules and snapshots after confirmation.

## Memory Stack

```text
Stable rules
├── CLAUDE.md
└── .claude/candidates.md

Current state
├── PROJECT.md
├── STRUCTURE.md
├── UPDATE_LOG.md
├── DOCS.md
├── .claude/project-profile.json   # planned stable Profile System config
└── .claude/profile-pending.json   # planned Profile System pending queue

Raw facts
├── log/
└── TODO.md

Handoff
└── session-handoff.md
```

## Feature PRDs

| Feature | Status | Document | Notes |
|---|---|---|---|
| Project Profile System | Draft | [features/project-profile-system.md](features/project-profile-system.md) | Conversational profile builder, Foundation Setup, profile-aware docs, Normal/Full Close, pending lifecycle, Scoped Full Close, Foundation Repair |
| Document Archiving | Existing | TBD | Current behavior lives in `references/document-archiving.md`; should get its own feature PRD later |
| File Reorganization | Existing | TBD | Current behavior lives in `references/file-reorganization.md`; should get its own feature PRD later |
| Versioned Update Log | Existing | TBD | Current behavior lives in `references/update-log.md`; should get its own feature PRD later |
| Continue Full Context | Existing | TBD | Current behavior lives in `references/continue-full-context.md`; should get its own feature PRD later |

## Success Criteria

- A new session can recover the project state without the user re-explaining the project.
- Project documents stay findable and indexed.
- Long-term rules are not promoted without user confirmation.
- File organization does not move management files or document archives incorrectly.
- Normal end-session saves are fast and low-friction.
- Deeper document alignment is explicit, bounded, and user-confirmed.
- Profile-aware behavior uses machine-readable state, not ad hoc prose guesses.
- Repeated deferred profile updates become visible profile debt.
- Mature-project Full Close runs with a declared scope plan.
- Full Close can complete safe alignment work without repeated confirmation prompts.
- Stale documents are detected through evidence, not only by file age.

## Non-Goals

- Project Butler is not a replacement for Jira, Linear, Notion, or a full PM platform.
- Project Butler should not create large document systems by default.
- Project Butler should not rewrite stable PRDs, architecture documents, roadmaps, or rules without explicit confirmation.
- Project Butler should not rely on fixed project-type choices as the primary user experience.

## Open Product Questions

1. Which existing behaviors should get their own feature PRDs next?
2. Should `DOCS.md` index `docs/prd/` feature PRDs once this repo adopts Project Butler's own document archive pattern?
3. Should `.claude/project-profile.json` and `.claude/profile-pending.json` be created only when Profile System is enabled, or during all new setup flows?
