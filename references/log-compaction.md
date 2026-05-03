# Log Compaction Protocol

> Loaded during: end session (when unarchived logs ≥ threshold).

Hierarchical log summarization. Keeps context reading bounded regardless of project age. Raw data is never deleted — only archived.

## Core Rule

When any level accumulates `threshold` files (default: 10, configurable in CLAUDE.md), compact them into 1 summary at the next level.

## Directory Structure

```
log/
├── session-YYYY-MM-DD-{slug}.md        ← unarchived raw logs
├── summaries/
│   ├── L1-001.md                        ← summary of raw logs 1-10
│   ├── L1-002.md                        ← summary of raw logs 11-20
│   ├── L2-001.md                        ← summary of L1-001 through L1-010
│   └── ...
└── archive/
    ├── raw-001/                         ← archived raw logs for L1-001
    ├── raw-002/                         ← archived raw logs for L1-002
    ├── L1-001/                          ← archived L1 summaries for L2-001
    └── ...
```

## Compaction Flow

Triggered at end session, after writing the session log:

```
1. Count unarchived raw logs in log/ (exclude summaries/ and archive/)
2. If count >= threshold:
   a. Read all unarchived raw logs
   b. Generate L1 summary → log/summaries/L1-{seq:03}.md
      - Use the full 6-section session log format
      - Header: # Log Summary L1-{seq} (Sessions {first}–{last}, {date_range})
      - Merge all sections from the raw logs into a unified summary
   c. Create archive folder → log/archive/raw-{seq:03}/
   d. Move all compacted raw logs into the archive folder
   e. Increment seq

3. Count L1 summaries in log/summaries/ matching L1-*.md
4. If count >= threshold:
   a. Read all L1 summaries
   b. Generate L2 summary → log/summaries/L2-{seq:03}.md
      - Same 6-section format
      - Header: # Log Summary L2-{seq} (Sessions {first}–{last}, {date_range})
   c. Create archive folder → log/archive/L1-{seq:03}/
   d. Move all compacted L1 summaries into the archive folder

5. Repeat for L3, L4, etc. (each level compacts when it hits threshold)
```

## Session Start Reading

Read logs in this order:
1. Find the highest level with summaries in `log/summaries/`
2. Read all summaries at that level (at most threshold - 1)
3. Read all unarchived raw logs in `log/` (at most threshold - 1)

Total files read: at most 2 × (threshold - 1). For threshold 10, that's at most 18 files — regardless of how many hundreds of sessions the project has.

## Safety

- **Never delete raw logs.** Archive them in `log/archive/` subdirectories.
- **Never delete summaries.** Archive them alongside raw logs when compacted to a higher level.
- **Use `git mv`** when in a git repo to preserve history during archival.
- **Archive folders are excluded** from file reorganization (add `log/archive/` to STRUCTURE.md exclusion rules).

## Summary Format

Summaries use the same 6-section format as raw session logs, merged across all source files:

```markdown
# Log Summary L{level}-{seq} (Sessions {first}–{last}, {first_date} ~ {last_date})

## Session Goal
{merged goals from all source sessions}

## Key Actions (Chronological)
{consolidated timeline of key actions}

## Decisions & Rationale
{all decisions with rationale preserved}

## Output Files
{all files produced across sessions}

## Unfinished Items / Next Session Pickup
{carried-forward unfinished items, deduplicated}

## CLAUDE.md Candidates (if any)
{candidates identified during this period}
```
