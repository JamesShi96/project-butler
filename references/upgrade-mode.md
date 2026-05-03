# Upgrade Mode

> Loaded during: initialization when some files already exist.

When some files already exist:

## Rules

1. **Never overwrite** any existing file content
2. **Create only missing files** with templates
3. **For existing CLAUDE.md**: check if it contains `## 项目管理系统` section. If missing, offer to append the system rules block. If present, check for missing elements from the 5-component system:
   - Does the trigger words table include `整理文件 / organize files`? If not, add it.
   - Does the file roles table include `STRUCTURE.md` and `.claude/.file-snapshot.json`? If not, add them.
   - Does the Session End Protocol include step 6 (整理文件结构)? If not, insert it between step 5 (收集宪法候选) and the last step (输出中文总结), and renumber accordingly.
   - Does it say "4 组件"? If so, update to "5 组件".
   - Does it include `Log Compaction Threshold` in the CLAUDE.md template? If not, add it.
   - Does the Session Start Protocol include bounded log reading (summaries + raw)? If not, update it.
   - Does the Session End Protocol include a Log Compaction step after writing the session log? If not, insert it and renumber.
   - Offer to make these updates for user confirmation before proceeding.
4. **For existing session-handoff.md / TODO.md**: skip entirely
5. **For log/ directory**: create if missing (with `log/.gitkeep`), never touch existing log files
6. **For .claude/candidates.md**: create if missing, skip if exists
7. **For STRUCTURE.md**: create if missing. If exists, never overwrite — user may have custom rules.
8. **For .claude/.file-snapshot.json**: create if missing (empty `{"lastScan":"","files":{}}`). If exists, skip.
9. **For old .claude/memory/ directory**: if it exists, treat as legacy system. See Legacy Migration below.
10. **For existing .cursor/rules/**: check if `project-system.mdc` already exists. If yes, skip. If only other .mdc files exist, create `project-system.mdc` alongside them (not overwrite).
11. **For language setting in CLAUDE.md**: if CLAUDE.md exists but has no `## Language` section, add one with default value `bilingual`. If it exists, skip.
12. **For Coding Guidelines (Karpathy Guidelines) in CLAUDE.md**: if CLAUDE.md exists but has no `## Coding Guidelines` section, append the Karpathy Guidelines section (from Template 1) before the `## Project-Specific Rules` section or at the end of the file. If it exists, skip.

## Legacy Migration (.claude/memory/ → new system)

When `.claude/memory/` exists, it indicates an older project management setup. Handle as follows:

1. **Detect legacy artifacts:**
   - `.claude/memory/MEMORY.md` → old project wiki (content should be migrated to PROJECT.md)
   - `.claude/memory/session-*.md` → old session logs (should be moved to log/)
   - `~/.claude/projects/.../memory/MEMORY.md` → Claude auto-memory mirror (leave as-is)

2. **Migration actions (user-confirmed only):**
   - Move `.claude/memory/session-*.md` files → `log/archive/` (preserving history)
   - Merge `.claude/memory/MEMORY.md` content into new `PROJECT.md` (populating sections like 模块地图, 进度快照, etc.)
   - After migration, update the existing CLAUDE.md to remove or modify any sections that reference `.claude/memory/` paths (e.g., "记忆管理" rules) so they point to the new system paths instead.

3. **Never auto-migrate.** Present the user with a clear list of what would be moved/merged and ask for confirmation.

4. **Conflict resolution for CLAUDE.md append:**
   When appending the `## 项目管理系统` section to an existing CLAUDE.md that has old path references:
   - Note the specific sections that reference old paths (e.g., a "记忆管理" section pointing to `.claude/memory/`)
   - In the appended block, include a comment: `> 注意：旧版 .claude/memory/ 已迁移，所有新日志写入 log/`
   - Offer to update the conflicting old section to remove the now-stale references

## Upgrade Report

Output shows status of each file, plus any legacy migration suggestions:

```
项目管理系统升级检测 ✓

文件状态：
  ⚠️  CLAUDE.md           — 已存在，缺少「## 项目管理系统」，建议追加
  ✅ PROJECT.md           — 已创建（新增）
  ⏭️  session-handoff.md  — 已存在，跳过
  ⏭️  TODO.md             — 已存在，跳过
  ✅ log/                 — 已创建（新增）
  ✅ .claude/candidates.md — 已创建（新增）
  ✅ STRUCTURE.md               — 已创建（新增）/ 已存在，跳过
  ✅ .claude/.file-snapshot.json — 已创建（新增）/ 已存在，跳过
  🌐 Language setting      — 已添加（默认 bilingual）/ 已存在，跳过

Legacy 检测：
  ⚠️  .claude/memory/     — 发现旧版文件（5 个 session + MEMORY.md）
     建议迁移：session 文件 → log/archive/
     建议合并：MEMORY.md 内容 → PROJECT.md
     ⚠️  CLAUDE.md 现有「记忆管理」章节与新系统路径冲突
     建议更新旧章节指向新路径
     → 以上操作需你确认后执行，不会自动修改
```

## Common Mistakes

| Mistake | Correct Behavior |
|---------|-----------------|
| Overwriting existing files in upgrade mode | Never overwrite. Create only missing files. |
| Putting session logs in .claude/memory/ | Use log/ in project root. It's git-visible. |
| Auto-migrating legacy .claude/memory/ files | Always ask user to confirm migration. Never auto-move. |
| Leaving conflicting old+new path references in CLAUDE.md | When appending system section, flag and offer to resolve conflicts with existing sections. |
| AI directly editing CLAUDE.md | Only write to .claude/candidates.md. User confirms via "review claude". |
| Creating logs without updating Wiki/handoff | end session must do ALL steps, not pick and choose. |
| Empty TODO items without owner/deadline/deps | Always ask user to fill in the three required fields. |
| Forgetting to read PROJECT.md at session start | CLAUDE.md template explicitly instructs this. |
| Creating .cursor rules when user doesn't use Cursor | Only create when user answers yes to Q5. |
| Creating duplicate .cursor/rules/ files | Check if project-system.mdc already exists before creating. Create alongside existing .mdc files, never overwrite. |
