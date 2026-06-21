# Adapter Coverage Matrix

Last updated: 2026-06-21

This matrix tracks the minimum Project Butler workflows exposed through each assistant adapter.

| Workflow | Claude Code | Cursor | Codex |
|---|---|---|---|
| Setup / upgrade | Native `/project-butler` skill flow | Generated `.cursor/rules/project-system.mdc` after setup | Generated `AGENTS.md` when Codex support is enabled |
| Session start context | `CLAUDE.md` + skill references + memory files | Cursor rules instruct the assistant to read memory files | `AGENTS.md` instructs the assistant to read memory files |
| Continue | Native trigger routed through `SKILL.md` | Best-effort trigger in Cursor rules | Best-effort trigger in `AGENTS.md` |
| Status | Native trigger routed through `SKILL.md` | Best-effort trigger in Cursor rules | Best-effort trigger in `AGENTS.md` |
| End session | Native end-session flow | Best-effort protocol in Cursor rules | Best-effort protocol in `AGENTS.md` |
| Profile System | Native profile-aware setup/status/close/repair | Reads profile JSON and mirrors profile triggers best-effort | Reads profile JSON and mirrors profile triggers best-effort |
| File organization | Native `organize files` flow | Best-effort trigger in Cursor rules | Best-effort trigger in `AGENTS.md` |
| Document archiving | Native end-session document archiving | Best-effort end-session protocol | Best-effort end-session protocol |
| Update log | Native end-session versioned update log | Best-effort end-session protocol | Best-effort end-session protocol |
| Version freshness check | Automatic Step -1 check on skill invocation | Manual/on-demand command only | Manual/on-demand command only |
| Rule review | Native `review claude` workflow | Best-effort trigger in Cursor rules | Best-effort trigger in `AGENTS.md` |

## Support Levels

- **Native**: enforced by Claude Code skill loading and `SKILL.md` routing.
- **Best-effort**: provided as project instructions. The assistant should follow them, but the platform does not provide Claude Code's skill lifecycle.
- **Manual/on-demand**: runs only when the user asks or the assistant chooses to follow the adapter instruction.

## Release Check

Before release, review these generated adapters together:

- `CLAUDE.md` template in `references/file-templates.md`
- `.cursor/rules/project-system.mdc` template in `references/file-templates.md`
- `AGENTS.md` template in `references/file-templates.md`
