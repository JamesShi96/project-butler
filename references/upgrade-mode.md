# Upgrade Mode

> Loaded during: initialization when some files already exist.

When some files already exist:

## Rules

1. **Never overwrite whole existing files**. Existing user content is preserved.
2. **Create only missing files** with templates. For existing management files, make only small user-confirmed append/patch updates to missing project-butler system sections.
3. **For existing CLAUDE.md**: check if it contains `## 项目管理系统` section. If missing, offer to append the system rules block. If present, check for missing elements from the project memory stack:
   - Does the trigger words table include `整理文件 / organize files`? If not, add it.
   - Does the file roles table include `STRUCTURE.md` and `.claude/.file-snapshot.json`? If not, add them.
   - Does the Session End Protocol include file reorganization after constitution candidate collection? If not, insert it before output summary and renumber accordingly.
   - Does it say "4 组件", "5 组件", or "6 组件"? If so, update to "7 组件基础系统" and list the current base components: Constitution, Wiki, Structure, Update Log, Docs, Log, TODO. Profile System is internal runtime state on top of the base component count.
   - Does it include `Log Compaction Threshold` in the CLAUDE.md template? If not, add it.
   - Does the Session Start Protocol include bounded log reading (summaries + raw)? If not, update it.
   - Does the Session Start Protocol read TODO.md, UPDATE_LOG.md, and DOCS.md in addition to PROJECT.md and session-handoff.md? If not, update it.
   - Does the Session End Protocol include a Log Compaction step after writing the session log? If not, insert it and renumber.
   - Does the Session End Protocol include document archiving after file reorganization and before update-log evaluation? If not, insert it there and renumber accordingly.
   - Does the file roles table include `DOCS.md`? If not, add it.
   - Offer to make these updates for user confirmation before proceeding.
4. **For existing session-handoff.md / TODO.md**: skip entirely
5. **For log/ directory**: create if missing (with `log/.gitkeep`), never touch existing log files
6. **For .claude/candidates.md**: create if missing, skip if exists
7. **For STRUCTURE.md**: create if missing. If exists, never overwrite — user may have custom rules.
8. **For .claude/.file-snapshot.json**: create if missing (empty `{"lastScan":"","files":{}}`). If exists, skip.
9. **For old .claude/memory/ directory**: if it exists, treat as legacy system. See Legacy Migration below.
10. **For existing .cursor/rules/**: check if `project-system.mdc` already exists. If missing, create it alongside any existing `.mdc` files without overwriting them. If it exists, preserve custom content and evaluate missing project-butler sections in step 17.
11. **For language setting in CLAUDE.md**: if CLAUDE.md exists but has no `## Language` section, add one with default value `bilingual`. If it exists, skip.
12. **For Coding Guidelines (Karpathy Guidelines) in CLAUDE.md**: if CLAUDE.md exists but has no `## Coding Guidelines` section, append the Karpathy Guidelines section (from Template 1) before the `## Project-Specific Rules` section or at the end of the file. If it exists, skip.
13. **For UPDATE_LOG.md**: create if missing using Template 8 from `references/file-templates.md` and the version style metadata. If exists, never overwrite — user has real update history here. If it exists but has no `<!-- version-style: X -->` metadata, treat it as legacy; ask whether to add metadata before writing future versioned entries.
14. **For Update Log step in CLAUDE.md Session End Protocol**: if the protocol has no update-log evaluation step, insert it before output summary and renumber accordingly.
15. **For docs/ directory**: create if missing with default subdirectories (`prd/`, `tech-design/`, `research/`) each with `.gitkeep`. If exists, skip.
16. **For DOCS.md**: create if missing after ensuring `docs/` exists. Use default types: PRD, 技术设计, 调研 (most common combination). Use Template 9 from `references/file-templates.md` (with project name prefix). If exists, never overwrite — user has real document index here.
17. **For existing Cursor rules**: if `project-system.mdc` exists, check whether it includes change language, continue, continue full context, document archiving, DOCS.md, and version bump behavior. Offer to patch missing system sections after user confirmation; never overwrite custom Cursor rules wholesale.
18. **For Profile System files**:
   - If `.claude/project-profile.json` and `.claude/profile-pending.json` exist, preserve them. Patch only schema-compatible missing fields after user confirmation.
   - If one exists without the other, offer to create the missing companion file using `references/project-profile-system.md`.
   - If neither exists, offer a profile-aware upgrade using the latest Foundation Setup model.
   - When creating profile files for an existing project, infer the profile from `PROJECT.md`, `DOCS.md`, `UPDATE_LOG.md`, existing `docs/`, and recent logs. Mark uncertain inferences with lower confidence and Open Questions.
   - Ask for confirmation before writing `.claude/project-profile.json`, `.claude/profile-pending.json`, baseline profile docs, or existing document policy changes.
19. **For existing CLAUDE.md / Cursor rules and Profile System**:
   - If profile files exist but generated project rules do not mention them, offer to patch session-start, status, and end-session sections so they read profile files and support Normal Close / Full Close.
   - Never patch project rules silently.

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
  ✅ UPDATE_LOG.md              — 已创建（新增）/ 已存在，跳过
  ✅ UPDATE_LOG version metadata — 已添加（新增）/ 已存在，跳过 / 建议补充
  ✅ docs/ + DOCS.md      — 已创建（新增）/ 已存在，跳过
  ✅ Profile System        — 已存在，跳过 / 建议补齐 companion JSON / 建议升级到当前 profile-aware setup
  ✅ Cursor project rules  — 已创建（新增）/ 已存在，建议补齐触发词
  ✅ Coding Guidelines     — 已添加（新增）/ 已存在，跳过
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
| Overwriting existing files in upgrade mode | Never replace whole files. Create missing files, or make small user-confirmed patches to system sections only. |
| Putting session logs in .claude/memory/ | Use log/ in project root. It's git-visible. |
| Auto-migrating legacy .claude/memory/ files | Always ask user to confirm migration. Never auto-move. |
| Leaving conflicting old+new path references in CLAUDE.md | When appending system section, flag and offer to resolve conflicts with existing sections. |
| AI directly editing CLAUDE.md during normal work | Outside initialization/upgrade, only write to .claude/candidates.md. User confirms via "review claude". During init/upgrade, append or patch system sections only after user confirmation. |
| Creating logs without updating Wiki/handoff | end session must do ALL steps, not pick and choose. |
| Empty TODO items without owner/deadline/deps | Always ask user to fill in the three required fields. |
| Forgetting to read PROJECT.md at session start | CLAUDE.md template explicitly instructs this. |
| Creating .cursor rules when user doesn't use Cursor | Only create when user answers yes to Q5. |
| Creating duplicate .cursor/rules/ files | Check if project-system.mdc already exists before creating. Create alongside existing .mdc files, never overwrite. |
| Keeping old component counts after adding Update Log and Docs | Current base system is 7 components: Constitution, Wiki, Structure, Update Log, Docs, Log, TODO. Profile System is internal runtime state on top of the base stack. |
| Creating profile JSON during upgrade without confirmation | Offer profile-aware upgrade, infer carefully, and write profile files only after user confirmation. |
| Rewriting existing profile metadata | Preserve existing profile files; patch only schema-compatible missing fields after confirmation. |
| Treating profile debt as TODO by default | Keep profile debt in `.claude/profile-pending.json` unless it is a concrete execution task. |
