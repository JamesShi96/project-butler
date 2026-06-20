---
name: project-butler
description: "Project memory workflow for init/upgrade, profile-aware setup, end session, normal/full close, file organization, document archiving, language switching, versioned update logs, rule review, status, wiki sync, and context recovery. Use for /project-butler, setup/初始化, foundation setup, profile setup, end session/收工, normal close, full close, foundation repair, organize files/整理文件, change language/切换语言, continue/接着上次, continue full context/全面回顾, review claude, sync wiki, status. Maintains project memory files. Runs version freshness check before trigger routing."
---

# Project Butler — Project Memory Stack

Initialize standardized project memory:

```
上层（稳定原则）
┌─────────────────────────────────────┐
│  CLAUDE.md（项目宪法）← 人工确认     │
│  ↑ candidates（AI 自动收集候选）     │
└─────────────────────────────────────┘
        ↑ 抽象沉淀
中层（当前快照）
┌─────────────────────────────────────┐
│  PROJECT.md（项目 Wiki）← AI 自动同步 │
│  概览 / 结构 / 模块状态 / 文件索引    │
│  STRUCTURE.md（文件管理规则）← AI 自动│
│  目录规则 / 匹配条件 / 整理历史       │
│  UPDATE_LOG.md（里程碑变化）← AI 自动 │
│  DOCS.md（文档索引 + 元数据）← AI 自动 │
│  .claude/project-profile.json（画像配置）│
│  .claude/profile-pending.json（画像待处理）│
└─────────────────────────────────────┘
        ↑ 状态汇总
下层（事实流水）
┌────────────────────┐  ┌────────────────────┐
│  log/（会话日志）   │  │  TODO.md（执行清单）│
│  raw + summaries   │  │  owner/deadline/    │
│  + archive（分级）  │  │  deps               │
└────────────────────┘  └────────────────────┘
        ↓
session-handoff.md（下次接手点）
```

Core idea: bottom feeds top, top constrains bottom. Logs and TODOs are raw facts. Handoff marks the next resume point. Wiki is the current snapshot. Structure manages file organization. Docs index manages document output. Update Log records versioned milestone changes. Constitution is stable principles.

Supports 3 language modes: English (`en`), Chinese (`zh`), or bilingual. All content adapts to the selected language.

---

## Step -1: Version Freshness Check (always run first)

<EXTREMELY_IMPORTANT>
Before any other step, read `references/update-check.md` and execute
the version freshness check described there.

- If the check prints nothing → continue to Step 0 silently.
- If the check prints a `VERSION_NOTICE:` block (three lines starting
  with `VERSION_NOTICE:`) → prepend that exact block to your first
  user-facing response for read triggers (`status`, `continue`,
  `continue full context`, `sync wiki`, `review claude`), or append
  it as a footnote at the end of your response for write triggers
  (`init`, `end session`, `organize files`, `change language`,
  `profile setup`, `foundation repair`, `normal close`, `full close`).
  Deliver the block verbatim — never paraphrase, summarize, or merge.
- Never run `git pull` on the skill directory yourself, even if the
  user asks. Always show the upgrade command and let the user run it
  in their own shell.
- If you cannot find the "Base directory for this skill: <path>" line
  in the current skill loading prompt, skip the check silently and
  continue to Step 0.
</EXTREMELY_IMPORTANT>

---

## Step 0: Trigger Routing

Determine how this skill was triggered:

**A. "整理文件" / "organize files":**
1. Read `references/file-reorganization.md`
2. Execute **Mode A: Four-Phase Organize** (Discover → Ask or Plan → Plan → Execute)
3. Report and stop

**B. "收工" / "end session" / "结束会话" / "we're done" / "wrap up" / "done for today" / "normal close" / "full close":**
1. Execute the **End Session Flow** below (inline)
2. Report and stop

**C. Initialization (/project-butler, 初始化项目, setup project, etc.):**
→ Continue to **Init Flow** below

**D. "切换语言" / "change language":**
1. Read `references/language-change.md` + `references/language-adaptation.md`
2. Execute the Language Change Protocol
3. Report and stop

**E. "continue" / "接着上次" / "上次做到哪了":**
1. Read `references/continue.md`
2. Execute the Continue process (recover last session context)
3. Report and stop

**F. "continue full context" / "全面回顾" / "项目全景" / "full context":**
1. Read `references/continue-full-context.md`
2. Execute the Continue Full Context process (full project trajectory recovery)
3. Report and stop

**G. "review claude" / "审查规则" / "更新宪法" / "check the rules":**
1. Read `.claude/candidates.md`
2. Present pending candidates one by one for accept / reject / rewrite
3. For accepted or rewritten candidates, append to CLAUDE.md only after explicit user confirmation
4. Move processed candidates to adopted or rejected sections in `.claude/candidates.md`
5. Report and stop

**H. "sync wiki" / "同步项目" / "update overview" / "refresh overview":**
1. Read PROJECT.md, STRUCTURE.md, UPDATE_LOG.md, DOCS.md, TODO.md, and session-handoff.md if present
2. Rescan current project files and update PROJECT.md current snapshot, module map, file structure, key file index, links, and progress sections
3. Preserve user-authored content where possible
4. Report and stop

**I. "status" / "项目现状" / "where are we":**
1. Read PROJECT.md and session-handoff.md
2. Also read TODO.md and latest UPDATE_LOG.md entry if present
3. If `.claude/project-profile.json` or `.claude/profile-pending.json` exists, read `references/project-profile-system.md` and include profile debt / review queue in the dashboard
4. Present a compact project dashboard in the configured language: Project, Active Work, Recent Change, Profile, Next Best Step
5. Report and stop

**J. "foundation setup" / "profile setup" / "foundation repair" / "profile repair" / "profile sync":**
1. Read `references/project-profile-system.md`
2. Execute the matching Profile System flow
3. Report and stop

---

## End Session Flow

When triggered by "end session" / "结束会话" / "收工" / "we're done" / "wrap up" / "done for today" / "normal close" / "full close", execute in order:

1. **Write session log** → `log/session-YYYY-MM-DD-{slug}.md`
   - Same-day multiple sessions: use slug to distinguish (e.g., `session-2026-04-21-prd-draft.md`)
   - Format: see Session Log Format below
2. **Log Compaction** → if unarchived raw logs ≥ threshold (default 10, configured in CLAUDE.md):
   read `references/log-compaction.md` and execute
3. **Update session-handoff.md** → refresh "current progress" and "next steps"
4. **Update PROJECT.md** → if structure/module status changed
5. **Update TODO.md** → mark completed tasks
6. **Collect constitution candidates** → append to `.claude/candidates.md` (see rules below)
7. **Profile impact scan** → if `.claude/project-profile.json` exists, `.claude/profile-pending.json` exists, or the user explicitly requested Normal Close / Full Close / profile sync:
   - Read `references/project-profile-system.md`
   - Run the Profile-Aware End Session flow
   - For Normal Close: record profile-impacting changes in `.claude/profile-pending.json`
   - For Full Close: produce a Scope Plan before changing profile docs
   - Do not rewrite protected sections, document policies, or stable baselines without explicit confirmation
8. **File reorganization (incremental)** → read `references/file-reorganization.md`, execute Mode B
   - If STRUCTURE.md missing: execute Mode A first to establish baseline
   - Update `.claude/.file-snapshot.json`
9. **Document archiving** → read `references/document-archiving.md`, scan and archive document output
   - Identify documents created/modified this session
   - Classify by type, archive to `docs/` subdirectories
   - Update `DOCS.md` index and metadata
   - If DOCS.md missing: create it (upgrade compatibility)
10. **Evaluate & write update log** → read `references/update-log.md`
   - Evaluate session significance
   - If significant: determine bump level (major/minor/patch), calculate new version from UPDATE_LOG.md metadata, prepend versioned entry
   - Optionally offer GitHub Release creation
   - If not significant, skip silently
11. **Output summary** → result-focused summary in the configured language (check CLAUDE.md Language setting)

### User-Facing Output Style

After `end session`, summarize outcomes instead of listing internal protocol steps:

```text
Session saved.

Updated:
- Handoff refreshed
- TODO updated: {done count} done, {active count} active
- Project wiki synced
- Profile: {normal close / full close / no profile impact / profile pending count}
- Documents archived: {count}
- Update log: {version added or skipped}

Next:
- {next action}
- {next action}
```

Omit lines that do not apply. For `status`, answer as a compact dashboard:

```text
Current Status

Project:
- Stage: {stage}
- Focus: {current focus}

Active Work:
- {active item}

Recent Change:
- {latest update log entry or "No milestone update yet"}

Profile:
- {profile shape / pending debt / review needed, only when profile files exist}

Next Best Step:
- {single recommended next step}
```

### Session Log Format

Session log headers adapt to the configured language (read `references/language-adaptation.md` for glossary).

```markdown
# Session YYYY-MM-DD — {topic}

## Session Goal
## Key Actions (Chronological)
## Decisions & Rationale
## Output Files
## Unfinished Items / Next Session Pickup
## CLAUDE.md Candidates (if any)
```

### Constitution Candidate Rules

AI automatically appends to `.claude/candidates.md` when:
- User explicitly says "always do this" / "this is a rule" / "don't ever..."
- Same decision appears across multiple sessions
- Decision involves naming conventions, file structure, collaboration flow
- Decision involves tech stack or architecture constraints

**Never promote candidates into CLAUDE.md automatically.** All candidates require explicit user review via "review claude" before CLAUDE.md is changed.

### TODO Format

Each task in TODO.md must include:
```
- [ ] {task description}
  Owner: {name} | Deadline: {date} | Dependencies: {prerequisite}
```
If user provides a task missing required fields, ask them to fill in. Completed tasks are checked and kept (not deleted).

---

## Init Flow

### Step 1: Detect Mode

Scan project root for: CLAUDE.md, PROJECT.md, session-handoff.md, TODO.md, log/, STRUCTURE.md, UPDATE_LOG.md, DOCS.md, docs/, .claude/.file-snapshot.json, .claude/candidates.md, .claude/project-profile.json, .claude/profile-pending.json

- **Fresh**: None exist → read `references/project-profile-system.md` and run Foundation Setup as the default setup path. Create the base 7-component memory stack, `.claude/project-profile.json`, `.claude/profile-pending.json`, and only the user-confirmed baseline docs. For lightweight projects, use `maintenance.preference = "lightweight"` and keep Required docs minimal instead of skipping profile state.
- **Upgrade**: Some exist → read `references/upgrade-mode.md`; if profile files are missing, also read `references/project-profile-system.md` and offer profile-aware upgrade using the latest Foundation Setup model
- **Profile files present**: profile files exist → preserve existing profile state and patch only schema-compatible missing fields

### Step 2: Ask Questions

For Fresh initialization, follow Foundation Setup in `references/project-profile-system.md`: ask for the required setup basics, ask for a natural project description, infer the project shape, generate project-specific foundation areas, ask only targeted follow-up questions, and propose Required / Recommended / Optional documents before file creation.

AskUserQuestion should still keep setup lightweight. Make clear that the user can press Enter for recommended defaults.

Required:

1. **项目名称** — e.g., "达人营销AI", "Data Pipeline"
2. **一句话定义** — e.g., "AI-powered influencer marketing platform for US/EU markets"
3. **当前阶段** — e.g., "v1 MVP", "规划中", "已上线"

Recommended defaults:

4. **GitHub 仓库** — optional, e.g., "org/repo-name" (default empty)
5. **是否创建 Cursor 规则文件** — yes/no (default yes)
6. **语言 / Language** — `en` / `zh` / `bilingual` (default bilingual)
7. **版本命名方式** — choose one (default AI recommendation, fallback Semantic)
   预设选项：Semantic (v0.1.0) / Codename ({project name} 0.1) / Patch (Patch 1) / Date (2026.06.1)
   AI 根据项目类型推荐：产品/品牌类→Codename / 游戏/内容类→Patch / 日志/研究类→Date / 默认→Semantic

### Step 3: Create Files

Read `references/file-templates.md` + `references/language-adaptation.md` + `references/document-archiving.md` + `references/project-profile-system.md`.

Create each file using templates, replacing `{{VARIABLES}}` with user answers. For UPDATE_LOG.md, calculate the initial version based on the version style selection and current date (e.g., semantic → `v0.1.0`, date → `2026.06.1`). Apply language adaptation rules and glossary from the reference.

Create `log/.gitkeep` (empty file) alongside `log/` directory so git tracks it when empty.

Create `.claude/.file-snapshot.json` with empty content: `{"lastScan":"","files":{}}`.

Create `.claude/project-profile.json`, `.claude/profile-pending.json`, and confirmed Required profile baseline docs from the approved Foundation Setup proposal.

### Step 4: Output Report

Adapt this report to the configured language:

```
Project memory is ready.

Daily commands:
- end session — save progress and next steps
- continue — resume next time
- status — check current state

Advanced:
- review claude — approve long-term rules when needed

Created:
- Project memory and handoff notes
- TODO tracking
- Document index
- Update log
- Profile config and pending queue: created
- File organization rules
- Cursor rules: created / skipped

Settings:
- Language: {{LANGUAGE}}
- Version style: {{VERSION_STYLE}} (starting: {{VERSION_INITIAL}})
```

---

## Reference Loading

| Trigger | Read these files |
|---------|-----------------|
| Init (fresh) | `references/file-templates.md` + `references/language-adaptation.md` + `references/document-archiving.md` + `references/project-profile-system.md` |
| Init (upgrade) | above + `references/upgrade-mode.md`; include `references/project-profile-system.md` when creating, repairing, or preserving profile files |
| End session | `references/file-reorganization.md` + `references/document-archiving.md` + `references/update-log.md` + `references/log-compaction.md` (if logs ≥ threshold); include `references/project-profile-system.md` when profile files exist or Normal/Full Close is requested |
| 整理文件 / organize files | `references/file-reorganization.md` |
| 切换语言 / change language | `references/language-change.md` + `references/language-adaptation.md` |
| continue / 接着上次 | `references/continue.md` |
| continue full context / 全面回顾 | `references/continue-full-context.md` |
| review claude / 审查规则 | Inline workflow in Step 0 |
| sync wiki / 同步项目 | Inline workflow in Step 0 |
| status / 项目现状 | Inline workflow in Step 0; include `references/project-profile-system.md` when profile files exist |
| profile setup / full close / foundation repair | `references/project-profile-system.md` |
