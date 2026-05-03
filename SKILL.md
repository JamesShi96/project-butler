---
name: project-butler
description: "Use when initializing or upgrading a project's management system, ending a work session, or resuming from a previous session. Triggers on /project-butler, '初始化项目', 'setup project', '项目初始化', 'end session', '结束会话', '收工', '整理文件', 'organize files', '切换语言', 'change language', 'resume', 'continue from last time', '接着上次', '接着上次的', '继续上次的工作', '继续', '上次做到哪了', 'resume full', 'full context', 'project overview', '全面回顾', '项目全景', '项目上下文', '整体回顾', or when a project lacks management files (CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md). Creates a 5-component system: session logs, project wiki, file structure management, constitution tracking, and task execution. Supports 3 language modes (English, Chinese, bilingual). When triggered by session-end keywords, execute the full end session protocol including file reorganization. When triggered by '整理文件' alone, only execute the File Reorganization Protocol. When triggered by resume keywords, recover context from the previous session. Supports fresh install and non-destructive upgrade for existing projects."
---

# Project Butler — 5-Component Project Management System

Initialize a standardized project management system with 5 components:

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
└─────────────────────────────────────┘
        ↑ 状态汇总
下层（事实流水）
┌────────────────────┐  ┌────────────────────┐
│  log/（会话日志）   │  │  TODO.md（执行清单）│
│  raw + summaries   │  │  owner/deadline/    │
│  + archive（分级）  │  │  deps               │
└────────────────────┘  └────────────────────┘
```

Core idea: bottom feeds top, top constrains bottom. Logs and TODOs are raw facts. Wiki is the current snapshot. Structure manages file organization. Constitution is stable principles.

Supports 3 language modes: English (`en`), Chinese (`zh`), or bilingual. All content adapts to the selected language.

---

## Step 0: Trigger Routing

Determine how this skill was triggered:

**A. "整理文件" / "organize files":**
1. Read `references/file-reorganization.md`
2. Execute **Mode A: Deep Organize**
3. Report and stop

**B. "收工" / "end session" / "结束会话":**
1. Execute the **End Session Flow** below (inline)
2. Report and stop

**C. Initialization (/project-butler, 初始化项目, setup project, etc.):**
→ Continue to **Init Flow** below

**D. "切换语言" / "change language":**
1. Read `references/language-change.md` + `references/language-adaptation.md`
2. Execute the Language Change Protocol
3. Report and stop

**E. "resume" / "接着上次" / "继续" / "上次做到哪了":**
1. Read `resume/SKILL.md`
2. Execute the Resume process (recover last session context)
3. Report and stop

**F. "resume-full" / "全面回顾" / "项目全景" / "full context":**
1. Read `resume-full/SKILL.md`
2. Execute the Resume Full process (full project trajectory recovery)
3. Report and stop

---

## End Session Flow

When triggered by "end session" / "结束会话" / "收工", execute in order:

1. **Write session log** → `log/session-YYYY-MM-DD-{slug}.md`
   - Same-day multiple sessions: use slug to distinguish (e.g., `session-2026-04-21-prd-draft.md`)
   - Format: see Session Log Format below
2. **Log Compaction** → if unarchived raw logs ≥ threshold (default 10, configured in CLAUDE.md):
   read `references/log-compaction.md` and execute
3. **Update session-handoff.md** → refresh "current progress" and "next steps"
4. **Update PROJECT.md** → if structure/module status changed
5. **Update TODO.md** → mark completed tasks
6. **Collect constitution candidates** → append to `.claude/candidates.md` (see rules below)
7. **File reorganization (incremental)** → read `references/file-reorganization.md`, execute Mode B
   - If STRUCTURE.md missing: execute Mode A first to establish baseline
   - Update `.claude/.file-snapshot.json`
8. **Output summary** → brief summary in the configured language (check CLAUDE.md Language setting)

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

**Never modify CLAUDE.md directly.** All candidates require user review via "review claude".

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

Scan project root for: CLAUDE.md, PROJECT.md, session-handoff.md, TODO.md, log/, STRUCTURE.md, .claude/.file-snapshot.json, .claude/candidates.md

- **Fresh**: None exist → create all
- **Upgrade**: Some exist → read `references/upgrade-mode.md`, create only missing files, never overwrite existing content

### Step 2: Ask Questions

Use AskUserQuestion to ask:

1. **项目名称** — e.g., "达人营销AI", "Data Pipeline"
2. **一句话定义** — e.g., "AI-powered influencer marketing platform for US/EU markets"
3. **当前阶段** — e.g., "v1 MVP", "规划中", "已上线"
4. **GitHub 仓库** — optional, e.g., "org/repo-name"
5. **是否创建 Cursor 规则文件** — yes/no (default yes)
6. **语言 / Language** — `en` / `zh` / `bilingual` (default bilingual)

### Step 3: Create Files

Read `references/file-templates.md` + `references/language-adaptation.md`.

Create each file using templates, replacing `{{VARIABLES}}` with user answers. Apply language adaptation rules and glossary from the reference.

Create `log/.gitkeep` (empty file) alongside `log/` directory so git tracks it when empty.

### Step 4: Output Report

```
项目管理系统已初始化 ✓

文件状态：
  ✅ CLAUDE.md           — 项目宪法（已创建）
  ✅ PROJECT.md          — 项目 Wiki（已创建）
  ✅ session-handoff.md  — 接手指引（已创建）
  ✅ TODO.md             — 执行清单（已创建）
  ✅ log/                — 会话日志目录（已创建）
  ✅ .claude/candidates.md — 宪法候选池（已创建）
  ✅ STRUCTURE.md        — 文件管理规则（已创建）
  ✅ .cursor/rules/      — Cursor 规则（已创建 / 已跳过）
  🌐 Language: {{LANGUAGE}}

下一步：
1. 根据项目需要，在 TODO.md 添加第一批任务
2. 正常开始工作
3. 结束时说 "end session" 即可自动记录
4. 切换语言随时说 "change language" / "切换语言"

触发词速查：
  end session / 结束会话 / 收工 → 写 log + 全量同步
  review claude / 更新宪法     → 展示候选池逐条确认
  sync wiki / 同步项目         → 强制更新 PROJECT.md
  status / 项目现状            → 朗读 Wiki + handoff 摘要
  整理文件 / organize files → 扫描并整理文件结构
```

---

## Reference Loading

| Trigger | Read these files |
|---------|-----------------|
| Init (fresh) | `references/file-templates.md` + `references/language-adaptation.md` |
| Init (upgrade) | above + `references/upgrade-mode.md` |
| End session | `references/file-reorganization.md` (always) + `references/log-compaction.md` (if logs ≥ threshold) |
| 整理文件 / organize files | `references/file-reorganization.md` |
| 切换语言 / change language | `references/language-change.md` + `references/language-adaptation.md` |
| resume / 接着上次 | `resume/SKILL.md` |
| resume-full / 全面回顾 | `resume-full/SKILL.md` |
