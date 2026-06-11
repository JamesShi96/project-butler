# Project Butler CLI

The CLI handles deterministic checks and file updates that are easy for an AI assistant to miss when following Markdown instructions manually.

It is intentionally small. The Skill remains the interaction layer; the CLI is the validation and bookkeeping layer.

## Commands

```bash
npm run build
node dist/src/cli.js doctor
node dist/src/cli.js snapshot --write
node dist/src/cli.js docs sync --write
node dist/src/cli.js profile validate
node dist/src/cli.js changelog bump --level minor --title "Add profile validation" --bullet "Added CLI checks" --write
```

## Read-Only By Default

Commands that can change files print a dry-run result unless `--write` is passed:

- `snapshot`
- `docs sync`
- `changelog bump`

This keeps the CLI aligned with Project Butler's safety model: inspect first, then write only when the user or calling assistant has chosen to apply the change.

## First Tooling Scope

The first CLI pass focuses on high-leverage operations:

- `doctor` checks required memory files, JSON validity, TODO metadata, update-log metadata, and Markdown links.
- `snapshot` updates `.claude/.file-snapshot.json` from the current file tree.
- `docs sync` rebuilds `DOCS.md` from Markdown files under `docs/`.
- `profile validate` checks profile JSON structure, pending statuses, and referenced document paths.
- `changelog bump` calculates the next `UPDATE_LOG.md` entry for the configured version style.
