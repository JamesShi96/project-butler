---
name: project-init
description: "Use when initializing or upgrading a project's management system, or when ending a work session. Triggers on /project-init, '初始化项目', 'setup project', '项目初始化', 'end session', '结束会话', '收工', '整理文件', 'organize files', '切换语言', 'change language', or when a project lacks management files (CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md). Creates a 5-component system: session logs, project wiki, file structure management, constitution tracking, and task execution. Supports 3 language modes (English, Chinese, bilingual). When triggered by session-end keywords, execute the full end session protocol including file reorganization. When triggered by '整理文件' alone, only execute the File Reorganization Protocol. Supports fresh install and non-destructive upgrade for existing projects."
---

# Project Init — 5-Component Project Management System

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
│  每次 end session   │  │  owner/deadline/    │
│  自动生成           │  │  deps               │
└────────────────────┘  └────────────────────┘
```

Core idea: bottom feeds top, top constrains bottom. Logs and TODOs are raw facts. Wiki is the current snapshot. Structure manages file organization. Constitution is stable principles.

Supports 3 language modes: English, Chinese (中文), or bilingual. All content adapts to the selected language.

---

## Language Adaptation

### Language Modes

| Mode | Code | Description |
|------|------|-------------|
| English | `en` | All content in English |
| 中文 | `zh` | All content in Chinese |
| 中英双语 | `bilingual` | Chinese with English annotations |

Language is stored in CLAUDE.md: `## Language / 语言` → `- **Language:** en | zh | bilingual`

### Adaptation Rules

When creating or updating files, adapt based on the configured language:

1. **Headers & section names**: Use corresponding terms from the glossary below
2. **Descriptions & instructions**: Write in the configured language
3. **Trigger intent descriptions**: Describe in the configured language, but match any language
4. **Session log headers**: Use configured language
5. **End session summary**: Output in the configured language
6. **Bilingual mode**: Chinese primary with English in parentheses for headers, e.g. `## 项目概况 (Project Overview)`

### Key Terms Glossary

#### CLAUDE.md

| Context | 中文 | English |
|---------|------|---------|
| File header | 项目指令 | Project Instructions |
| Section | 项目概况 | Project Overview |
| Section | 项目管理系统 | Project Management System |
| Sub-section | 触发词 | Triggers |
| Sub-section | 文件职责 | File Roles |
| Sub-section | Session Start Protocol | Session Start Protocol |
| Sub-section | Session End Protocol | Session End Protocol |
| Sub-section | Session Log 格式 | Session Log Format |
| Sub-section | 宪法候选识别规则 | Constitution Candidate Rules |
| Sub-section | TODO 格式 | TODO Format |
| Sub-section | 项目特定规则 | Project-Specific Rules |
| Table column | 你说 | Intent |
| Table column | AI 执行 | AI Action |
| Table column | 谁写 | Who writes |
| Table column | 何时 | When |

#### PROJECT.md

| Context | 中文 | English |
|---------|------|---------|
| Title suffix | 项目 Wiki | Project Wiki |
| Meta line | 最后同步 | Last synced |
| Section | 一句话定义 | One-Line Summary |
| Section | 当前阶段 | Current Stage |
| Section | 模块/章节地图 | Module Map |
| Section | 文件结构 | File Structure |
| Section | 关键文件索引 | Key File Index |
| Section | 当前进度快照 | Progress Snapshot |
| Section | 相关链接 | Links |
| Table column | 说明 | Description |
| Table column | 状态 | Status |
| Table column | 备注 | Notes |
| Table column | 模块 | Module |

#### session-handoff.md

| Context | 中文 | English |
|---------|------|---------|
| Title | Session Handoff | Session Handoff |
| Meta line | 最后更新 | Last updated |
| Section | 项目目标 | Project Goal |
| Section | 核心产出文件 | Key Output Files |
| Section | 当前进度 | Current Progress |
| Section | 关键设计决策 | Key Design Decisions |
| Section | 迭代历史 | Iteration History |
| Section | 下一步 | Next Steps |
| Table column | 版本 | Version |
| Table column | 变更 | Changes |
| Table column | 决策 | Decision |
| Table column | 理由 | Rationale |

#### TODO.md

| Context | 中文 | English |
|---------|------|---------|
| Meta line | 每条任务必须包含 | Each task must include |
| Meta line | 负责人 | Owner |
| Meta line | 截止时间 | Deadline |
| Meta line | 依赖项 | Dependencies |
| Meta line | 完成的任务勾选保留（不删除），作为执行历史 | Checked tasks are kept as execution history |

#### candidates.md

| Context | 中文 | English |
|---------|------|---------|
| Title | CLAUDE.md 候选条目 | CLAUDE.md Candidate Entries |
| Meta line | 以下条目由 AI 自动收集，等待人工 review | Entries auto-collected by AI, awaiting human review |
| Meta line | 触发 review | Trigger review |
| Section | 待确认（待 review） | Pending Review |
| Section | 已驳回 | Rejected |
| Section | 已采纳（已写入 CLAUDE.md） | Adopted (Written to CLAUDE.md) |

#### STRUCTURE.md

| Context | 中文 | English |
|---------|------|---------|
| Title suffix | 文件管理结构 | File Management Structure |
| Meta line | 最后更新 | Last updated |
| Section | 项目类型 | Project Type |
| Section | 排除规则 | Exclusion Rules |
| Section | 目录规则 | Directory Rules |
| Section | 待分类 | Unclassified |
| Section | 整理历史 | Organization History |
| Table column | 路径 | Path |
| Table column | 用途 | Purpose |
| Table column | 匹配条件 | Match Condition |
| Table column | 命名规范 | Naming Convention |
| Table column | 优先级 | Priority |

#### Session Log

| Context | 中文 | English |
|---------|------|---------|
| Section | 本次目标 | Session Goal |
| Section | 关键操作（按时间顺序） | Key Actions (Chronological) |
| Section | 决策与理由 | Decisions & Rationale |
| Section | 产出文件 | Output Files |
| Section | 未完事项 / 下次接手点 | Unfinished Items / Next Session Pickup |
| Section | 候选 CLAUDE.md 条目（如有） | CLAUDE.md Candidates (if any) |

---

## Execution Flow

### Step 0: Quick Check — Direct Trigger Handling

Determine how this skill was triggered:

**A. Triggered by "整理文件" / "organize files" (file reorganization only):**
1. Skip all initialization steps (Step 1-4)
2. Go directly to the **File Reorganization Protocol** section below and execute **Mode A: Deep Organize**
3. Report results and stop

**B. Triggered by "收工" / "end session" / "结束会话" (full session end):**
1. Skip initialization steps (Step 1-4)
2. If the project has CLAUDE.md with a Session End Protocol, follow it as the base
3. Regardless of whether CLAUDE.md exists, execute the full end session flow:
   - Write session log → `log/session-YYYY-MM-DD-{slug}.md`
   - Update `session-handoff.md` (if exists)
   - Update `PROJECT.md` (if exists)
   - Update `TODO.md` (if exists)
   - Collect constitution candidates → `.claude/candidates.md` (if exists)
   - **Execute File Reorganization Protocol — Mode B: Incremental Organize** (see dedicated section)
   - Output Chinese summary
4. Report results and stop

**C. Triggered by initialization keywords (/project-init, 初始化项目, etc.):**
→ Continue to Step 1 below for full initialization

**D. Triggered by language change intent (切换语言 / change language / 换个语言 / switch to English, etc.):**
1. Skip initialization steps (Step 1-4)
2. Execute the **Language Change Protocol** section below
3. Report results and stop

This allows the skill to work in any project — whether initialized or not.

### Step 1: Detect Mode

Scan the project root for these files:

| File | Location |
|------|----------|
| CLAUDE.md | project root |
| PROJECT.md | project root |
| session-handoff.md | project root |
| TODO.md | project root |
| log/ | project root directory |
| STRUCTURE.md | project root |
| .claude/.file-snapshot.json | project root hidden file |
| .claude/candidates.md | project root |

Determine mode:
- **Fresh**: None of the above exist → create all 7 (including STRUCTURE.md)
- **Upgrade**: Some exist → create only missing ones, never overwrite existing content

For upgrade mode with existing CLAUDE.md: check if it contains a `## 项目管理系统` section. If not, offer to append the system rules section. If it does, skip.

### Step 2: Interactive Questions

Ask the user these questions using AskUserQuestion:

1. **项目名称** — e.g., "达人营销AI", "Data Pipeline"
2. **一句话定义** — e.g., "AI-powered influencer marketing platform for US/EU markets"
3. **当前阶段** — e.g., "v1 MVP", "规划中", "已上线"
4. **GitHub 仓库** — optional, e.g., "org/repo-name"
5. **是否创建 Cursor 规则文件** — yes/no (default: yes)
6. **语言 / Language** — 选择管理文件内容语言 / Select content language for management files:
   - `en` — English
   - `zh` — 中文
   - `bilingual` — 中英双语（默认 / default）

### Step 3: Create Files

Use the language setting from Q6 when generating all file content. Apply the Language Adaptation rules and Key Terms Glossary above.

Create each file using the templates below, replacing `{{VARIABLES}}` with user answers.

For `{{DATE}}` use today's date in YYYY-MM-DD format.

When creating `log/` directory, also create `log/.gitkeep` (empty file) so git tracks the directory even when empty.

### Step 4: Output Report

After all files are created, output:

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

## File Templates

### Template 1: CLAUDE.md

This is the most critical file — it's auto-loaded by Claude Code and defines all ongoing behavior. It contains both project info AND the system rules.

```
# {{PROJECT_NAME}} 项目指令

> 本文件由 Claude Code 自动加载，定义项目协作规则。

## 项目概况
- **产品：** {{ONE_LINE_DESCRIPTION}}
- **当前阶段：** {{CURRENT_STAGE}}
{{GITHUB_LINE}}

## Language / 语言
- **Language:** {{LANGUAGE}}

## 项目管理系统

本项目使用 5 组件管理系统。

### 触发词

| Intent | AI Action |
|--------|-----------|
| End session / wrap up — any expression of "we're done for now" (end session, 结束会话, 收工, wrap up, done for today, etc.) | Write log + update handoff + sync Wiki + check TODO + collect constitution candidates + file reorganization + output summary in configured language |
| Review constitution — any expression of "check/update rules" (review claude, 更新宪法, check rules, etc.) | Show .claude/candidates.md for confirmation one by one |
| Sync wiki — any expression of "update project overview" (sync wiki, 同步项目, refresh overview, etc.) | Force rescan and update PROJECT.md |
| Check status — any expression of "what's the current state" (status, 项目现状, where are we, etc.) | Read PROJECT.md + session-handoff.md summary aloud |
| Organize files — any expression of "clean up files" (organize files, 整理文件, clean up, sort files, etc.) | Scan project files, organize per STRUCTURE.md rules |
| Change language — any expression of "switch language" (切换语言, change language, switch to English, 换成中文, etc.) | Execute Language Change Protocol |

### 文件职责

| File | Who writes | When |
|------|-----------|------|
| CLAUDE.md | 人工确认 | review claude 时 |
| PROJECT.md | AI 自动 | end session + 文件结构变化时 |
| session-handoff.md | AI 自动 | end session 时 |
| TODO.md | AI + 人 | 随时 |
| log/session-*.md | AI | end session 时 |
| .claude/candidates.md | AI 自动 | 过程中识别到稳定规则时 |
| STRUCTURE.md | AI 自动 | end session + 文件结构变化时 |
| .claude/.file-snapshot.json | AI 自动 | end session 时 |

### Session Start Protocol

At session start, read `PROJECT.md` for project overview, and check the Language setting in CLAUDE.md to determine output language.

### Session End Protocol

当用户说 "end session" / "结束会话" / "收工" 时，按顺序执行：

1. **写会话日志** → `log/session-YYYY-MM-DD-{主题slug}.md`
   - 同日多次会话用 slug 区分（如 `session-2026-04-21-prd-draft.md`）
2. **更新 session-handoff.md** → 刷新"当前进度 / 下一步"
3. **更新 PROJECT.md** → 如有结构/模块状态变化，同步更新
4. **更新 TODO.md** → 标记本次已完成的任务
5. **收集宪法候选** → 识别本次会话中的规则/偏好/边界，追加到 `.claude/candidates.md`
6. **整理文件结构（增量模式）** → 只处理新增/变更文件，按 STRUCTURE.md 规则快速归类
   - 若 STRUCTURE.md 不存在：先建立规则表（深度模式），再整理
   - 若 STRUCTURE.md 已存在：只匹配新增文件，不重读已有文件
   - 更新 `.claude/.file-snapshot.json`
7. **Output summary** → A brief summary of what was done this session, in the configured language

### Session Log Format

Session log headers adapt to the configured language. Use the Session Log entries from the Key Terms Glossary.

写入 `log/` 的每条日志遵循以下格式：

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

AI 在工作过程中，遇到以下情况时自动追加条目到 `.claude/candidates.md`：
- 用户明确说"以后都这么做" / "这是规则" / "不要再…"
- 同一类决策在多次会话中连续出现
- 涉及命名规范、文件分层、协作流程的决定
- 涉及技术栈选择、架构约束的决定

**绝对不要直接修改 CLAUDE.md。** 所有候选条目必须经用户 review 后才写入。

### TODO Format

TODO.md 中每条任务必须包含三要素：
```
- [ ] {task description}
  Owner: {name} | Deadline: {date} | Dependencies: {prerequisite}
```
If a user provides a task missing required fields, ask them to fill in. Completed tasks are checked and kept (not deleted).

## Coding Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Project-Specific Rules

(Add project-specific rules and preferences here)
```

**Variable replacements:**
- `{{PROJECT_NAME}}` → answer to Q1
- `{{ONE_LINE_DESCRIPTION}}` → answer to Q2
- `{{CURRENT_STAGE}}` → answer to Q3
- `{{GITHUB_LINE}}` → `- **GitHub：** {{answer}}` if Q4 provided, else empty string
- `{{DATE}}` → today YYYY-MM-DD
- `{{LANGUAGE}}` → answer to Q6 (`en`, `zh`, or `bilingual`)

---

### Template 2: PROJECT.md

**Language adaptation:** Adapt all headers, labels, and descriptions to the configured language using the PROJECT.md entries in the Key Terms Glossary. In bilingual mode, use Chinese headers with English in parentheses.

The project wiki — single file that tells anyone/AI what this project is about.

```
# {{PROJECT_NAME}} — Project Wiki

> 最后同步：{{DATE}}（自动）

## 一句话定义
{{ONE_LINE_DESCRIPTION}}

## 当前阶段
{{CURRENT_STAGE}}

## 模块/章节地图
（AI 在后续 session 中自动填充）

## 文件结构
> 详细目录规则见 STRUCTURE.md

```
.
├── CLAUDE.md                   ← 项目宪法（人工确认）
├── PROJECT.md                  ← 本文件（AI 自动同步）
├── STRUCTURE.md                ← 文件管理规则（AI 自动维护）
├── session-handoff.md          ← 接手指引（AI 自动）
├── TODO.md                     ← 执行清单
├── log/                        ← 会话日志
└── .claude/
    ├── candidates.md           ← 宪法候选池
    └── .file-snapshot.json     ← 文件整理快照
```

## 关键文件索引
| 文件 | 说明 |
|------|------|
| CLAUDE.md | 项目宪法，定义规则和边界 |
| PROJECT.md | 本文件，项目百科全貌 |
| session-handoff.md | 跨会话接手指引 |
| TODO.md | 执行任务清单 |
| .claude/candidates.md | 待确认的宪法候选条目 |
| STRUCTURE.md | 文件管理规则，定义目录组织和匹配条件 |

## 当前进度快照
| 模块 | 状态 | 备注 |
|------|------|------|
| （待填充） | | |

## 相关链接
{{GITHUB_LINK_LINE}}
```

**Variable replacements:**
- `{{GITHUB_LINK_LINE}}` → `- GitHub: https://github.com/{{answer}}` if provided, else `- （待添加）`

---

### Template 3: session-handoff.md

**Language adaptation:** Adapt all headers, labels, and descriptions to the configured language using the session-handoff.md entries in the Key Terms Glossary.

Cross-session handoff — tells the next session where things left off.

```
# Session Handoff — {{PROJECT_NAME}}

> 最后更新：{{DATE}} v0.1

## 项目目标
{{ONE_LINE_DESCRIPTION}}

## 核心产出文件
| 文件 | 状态 | 版本 | 说明 |
|------|------|------|------|
| STRUCTURE.md | 文件管理规则 | v0.1 | 定义目录规则和匹配条件 |
| （待填充） | | | |

## 当前进度
- 项目管理系统初始化完成

## 关键设计决策
| # | 决策 | 理由 | 日期 |
|---|------|------|------|
| 1 | 采用 5 组件管理系统 | Log + Wiki + Structure + Constitution + TODO | {{DATE}} |

## 迭代历史
| 版本 | 日期 | 变更 |
|------|------|------|
| v0.1 | {{DATE}} | 项目管理系统初始化 |

## 下一步
- [ ] 开始项目工作
```

---

### Template 4: TODO.md

**Language adaptation:** Adapt the meta instruction line and section headers to the configured language. Task metadata fields use the TODO.md glossary entries (Owner, Deadline, Dependencies / 负责人, 截止, 依赖).

Execution task list. Simple, actionable, with required metadata per task.

```
# {{PROJECT_NAME}} — TODO

> 每条任务必须包含：负责人 / 截止时间 / 依赖项
> 完成的任务勾选保留（不删除），作为执行历史

## 初始化
- [ ] 完善 PROJECT.md 中的模块地图
  负责人：｜截止：｜依赖：
- [ ] 添加第一批执行任务到 TODO.md
  负责人：｜截止：｜依赖：
```

---

### Template 5: .claude/candidates.md

**Language adaptation:** Adapt section headers using the candidates.md glossary entries.

Constitution candidate pool. AI writes here, user reviews via "review claude".

```
# CLAUDE.md 候选条目

> 以下条目由 AI 自动收集，等待人工 review。
> 触发 review：对 AI 说 "review claude" 或 "更新宪法"

## 待确认（待 review）
（暂无）

## 已驳回
（暂无）

## 已采纳（已写入 CLAUDE.md）
（暂无）
```

Ensure `.claude/` directory exists before writing this file.

---

### Template 6: .cursor/rules/project-system.mdc

**Language adaptation:** This Cursor rules file should mirror the language setting from CLAUDE.md. Use the configured language for all descriptions and instructions.

Only create if user answered yes to Q5. Cursor rules file that mirrors the CLAUDE.md trigger behavior.

```
---
description: Apply at session start and when user says end session / review claude / sync wiki / status / organize files. Defines the 5-component project management system behavior.
---

# {{PROJECT_NAME}} — Project System Rules

## Session Start
Read PROJECT.md and session-handoff.md at the start of every conversation.

## End Session Protocol
When user says "end session" / "结束会话" / "收工":
1. Write log/session-YYYY-MM-DD-{slug}.md (summary, decisions, outputs, next steps)
2. Update session-handoff.md (refresh progress, next steps)
3. Update PROJECT.md if structure or module status changed
4. Update TODO.md (mark completed tasks)
5. Collect CLAUDE.md candidates → append to .claude/candidates.md
6. File structure reorganization (incremental mode) — only process new/changed files, match against STRUCTURE.md rules, organize (create STRUCTURE.md if missing)
7. Output Chinese summary for user confirmation

## Triggers
| Intent | Action |
|--------|--------|
| End session / wrap up (any language) | Write log, update handoff, sync wiki, check TODO, collect candidates, file reorganization, output summary |
| Review constitution (any language) | Show .claude/candidates.md for user to confirm each entry |
| Sync wiki (any language) | Force rescan and update PROJECT.md |
| Check status (any language) | Read PROJECT.md + session-handoff.md summary aloud |
| Organize files (any language) | Scan files and reorganize according to STRUCTURE.md rules |
| Change language (any language) | Execute Language Change Protocol |

## File Roles
| File | Who writes | When |
|------|-----------|------|
| CLAUDE.md | Human only | review claude trigger |
| PROJECT.md | AI auto | end session + structure changes |
| session-handoff.md | AI auto | end session |
| TODO.md | AI + Human | anytime |
| log/session-*.md | AI | end session |
| .claude/candidates.md | AI auto | when stable rules identified |
| STRUCTURE.md | AI auto | end session + file structure changes |
| .claude/.file-snapshot.json | AI auto | end session |
```

---

### Template 7: STRUCTURE.md

**Language adaptation:** Adapt all headers and table column names to the configured language using the STRUCTURE.md entries in the Key Terms Glossary. The 命名规范 (Naming Convention) column values change based on language setting.

File management rules. AI creates this on first end session or project init. Defines how files should be organized based on project type.

```
# {{PROJECT_NAME}} — 文件管理结构

> 最后更新：{{DATE}}

## 项目类型
{{AI 判断：代码项目 / 视频制作 / 商业文档 / 混合型 / 其他}}

## 排除规则
以下目录/文件不参与整理：
- .git/
- node_modules/
- __pycache__/
- .venv/
- dist/
- build/
- vendor/
- .claude/
- log/
- {{项目自定义排除}}

## 目录规则

| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| （AI 根据项目类型自动生成） | | | （kebab-case / 中文 / PascalCase 等） | |

## 待分类
以下文件尚未归类（下次整理时处理）：
- （暂无）

## 整理历史
| 日期 | 操作 | 文件数 |
|------|------|--------|
| {{DATE}} | 初始化结构 | 0 |
```

**Variable replacements:**
- `{{PROJECT_NAME}}` → answer to Q1
- `{{DATE}}` → today YYYY-MM-DD

**Rule generation logic:**

When creating STRUCTURE.md for the first time, the AI must:

1. **Scan all files** in the project (excluding the default exclusion list)
2. **Determine project type** by analyzing file type distribution:
   - Majority `.py`/`.ts`/`.go`/`.java` etc. → 代码项目
   - Majority `.mp4`/`.mov`/`.prproj` etc. → 视频制作
   - Majority `.xlsx`/`.pdf`/`.docx` etc. → 商业文档
   - Mixed without clear majority → 混合型
3. **Generate rules** matching the project type. Use these as reference patterns:

**代码项目参考规则：**
| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| src/ | 源代码 | 按语言和模块组织 | kebab-case.ext | 10 |
| tests/ / test/ | 测试文件 | *test*, *spec* | *.test.ext, *.spec.ext | 20 |
| docs/ | 项目文档 | *.md, *.docx, *.pdf | kebab-case.md (en) / 中文或kebab-case.md (zh) / kebab-case.md (bilingual) | 30 |
| config/ / conf/ | 配置文件 | *.yaml, *.toml, *.json (非 package.json) | kebab-case.yaml | 15 |

**视频制作参考规则：**
| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| footage/ | 原始素材 | *.mp4, *.mov, *.mxf | YYYY-MM-DD-description.ext | 10 |
| scripts/ | 脚本文档 | *.docx, *.md 含脚本相关 | kebab-case.md | 20 |
| editing/ | 剪辑工程 | *.prproj, *.drp, *.fcpxml | project-name.ext | 30 |
| exports/ | 成片输出 | *.mp4 命名含 export/output | project-name-final.ext | 40 |
| assets/ | 设计素材 | *.png, *.jpg, *.ai, *.psd | descriptive-name.ext | 15 |

**商业文档参考规则：**
| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| contracts/ | 合同法务 | *.pdf 含合同/协议 | YYYY-MM-DD-counterparty-type.pdf (en) / YYYY-MM-DD-对方-类型.pdf (zh) | 10 |
| finance/ | 财务报表 | *.xlsx, *.csv 含报表/预算 | YYYY-MM-report-name.xlsx | 20 |
| teams/ | 团队子目录 | 按部门名归类 | kebab-case/ (en) / 部门名/ (zh) | 30 |
| meetings/ | 会议记录 | *.docx, *.md 含会议/纪要 | YYYY-MM-DD-notes.{md/docx} (en) / YYYY-MM-DD-会议纪要.{md/docx} (zh) | 15 |

**Language-specific naming rules:**

When `en`: all user file names use kebab-case or snake_case, English only.
When `zh`: all user file names can use Chinese characters, no restriction to ASCII.
When `bilingual`: English naming preferred; Chinese names acceptable for docs and content files.

These rules are applied during file reorganization (Mode A: deep rename, Mode B: new files only).

4. **These are starting points.** Adapt rules based on actual file content and project context. The AI should refine, merge, or add rules as needed — not blindly copy templates.

---

## File Reorganization Protocol

Two modes with different depth levels, triggered by different commands.

### Mode A: Deep Organize (深度整理)

**Trigger:** "整理文件" / "organize files"

**Philosophy:** Content-aware, OCD-level reorganization. Read every file, understand what it is, enforce naming consistency and structural uniformity across the entire project.

**Prerequisites:**
- Read STRUCTURE.md if it exists
- Read `.claude/.file-snapshot.json` if it exists

**Flow:**

```
1. Full Scan: recursively list all project files
   - Exclude: directories listed in STRUCTURE.md 排除规则 (or defaults)
   - Default exclusions: .git/, node_modules/, __pycache__/, .venv/, dist/, build/, vendor/, .claude/, log/

2. Content Understanding Phase:
   For EACH file in the project (not just new ones):
   a. Read the file content (for .md files; for binary files like .pdf/.png, infer from filename + context)
   b. Classify: what is this file? (company intro? project spec? template? meeting notes?)
   c. Identify naming issues:
      - Does the filename match the STRUCTURE.md 命名规范?
      - Are there spaces, special characters, or inconsistent case?
      - Does it have redundant prefixes (e.g., company name in a file already inside the company folder)?
      - Is the extension duplicated (e.g., .pdf.pdf)?
      - Does the filename follow the language-appropriate naming convention from STRUCTURE.md? (e.g., Chinese names when language is zh, English kebab-case when en)
   d. Identify structural issues:
      - Is it in the correct directory per STRUCTURE.md rules?
      - Should it be in a subdirectory (assets/, reference-answers/)?
      - Are sibling directories inconsistent? (e.g., company-a has ppt-brief.md but company-b has company-b-ppt-brief.md)

3. Reorganization Phase:
   a. Fix naming: rename files to match STRUCTURE.md conventions
   - Apply language-appropriate naming: if language is `zh`, allow Chinese filenames; if `en`, enforce English kebab-case; if `bilingual`, prefer English with Chinese acceptable for docs
   b. Fix structure: move files to correct directories, create subdirectories if needed (assets/, reference-answers/, etc.)
   c. Enforce cross-directory consistency: if one company folder has a certain structure, check if sibling folders should match
   d. For files with no matching rule:
      - Analyze content to infer category
      - If inferable: add new rule to STRUCTURE.md + place file
      - If not: add to 待分类 section

4. Reference Update Phase:
   a. After each rename/move: grep for old path in all .md files
   b. Update any broken links (markdown links, imports, config references)
   c. Check master/index documents for outdated references

5. Safety checks before each file move:
   a. Cross-reference check: grep for old path in other files
      - If references found: update them
   b. Name collision check: does target already have a same-name file?
      - If yes: do NOT overwrite → add to 待分类 with collision note
   c. System file check: never move CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md

6. Update artifacts:
   a. Update .claude/.file-snapshot.json (full refresh)
   b. Update STRUCTURE.md:
      - Add any new naming conventions discovered
      - Add new rules for previously uncategorized files
      - Update 整理历史
   c. Update PROJECT.md file structure section if layout changed

7. Report:
   - Files renamed (with before → after)
   - Files moved (with before → after)
   - Broken links fixed
   - New STRUCTURE.md rules added
   - Files in 待分类 (if any)
```

---

### Mode B: Incremental Organize (增量整理)

**Trigger:** "收工" / "end session" / "结束会话" (embedded in end session protocol)

**Philosophy:** Lightweight maintenance. Only process files that are new or changed since last snapshot. Fast, minimal token usage.

**Prerequisites:**
- Read `.claude/.file-snapshot.json` (required — this is the diff baseline)
- Read STRUCTURE.md for rules (no need to read all file contents)

**Flow:**

```
1. Diff Scan:
   a. List all project files recursively (same exclusions as Mode A)
   b. Compare against .file-snapshot.json
   c. Identify ONLY:
      - New files (not in snapshot)
      - Moved/renamed files (path changed)
   d. Skip all files that are already in snapshot with same path

2. If no new/changed files → skip to step 5 (just update timestamp)

3. Quick Classify (for NEW files only):
   For each new file:
   a. Read content (only if needed to determine category — skip if filename is obvious)
   b. Match against existing STRUCTURE.md rules
   c. If match: place file in target directory with correct naming
   - Apply language-appropriate naming from STRUCTURE.md conventions when placing new files
   d. If no match:
      - Brief content scan to infer category
      - If inferable: add rule + place file
      - If not: add to 待分类

4. Safety checks (same as Mode A):
   - Cross-reference check before moves
   - Name collision check
   - System file check

5. Update .claude/.file-snapshot.json:
   - Add new files
   - Update paths for moved files
   - Remove entries for deleted files

6. Report (in end session summary):
   - Number of new files organized
   - Any new rules added
```

**Token optimization rules:**
- **NEVER re-read files already in snapshot** unless specifically investigating an issue
- **NEVER do cross-directory consistency checks** — that's Mode A's job
- **NEVER rename existing files** — only place new ones
- **NEVER rename files to a different language in Mode B** — language-based renaming only happens in Mode A or via the Language Change Protocol
- If STRUCTURE.md doesn't exist: fall back to Mode A (need to establish baseline first)


### Important Constraints

- **Never move management files**: CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md stay at project root
- **Never move files in exclusion list**: .git/, node_modules/, etc.
- **Preserve git history**: use `git mv` when in a git repo, not bare `mv`
- **Update references**: after moving a file, search for and update any imports/links to its old path
- **No overwrites**: if target has a same-name file, flag instead of clobbering
- **Respect human edits**: if user manually modified STRUCTURE.md rules, honor them. Only add new rules, never remove user-written rules without confirmation

---

## Language Change Protocol

Triggered when user expresses intent to change language (any expression: 切换语言, change language, switch to English, 换成中文, etc.).

### Flow

```
1. Determine target language:
   - If user specifies a language: use that (en / zh / bilingual)
   - If ambiguous: ask using AskUserQuestion

2. Update CLAUDE.md:
   - Change the Language section: - **Language:** {new language}
   - Update all headers and content in CLAUDE.md to the new language
   (Use the Key Terms Glossary for translations)

3. Rewrite all system management files in the new language:
   - PROJECT.md — translate all headers, descriptions, table column names
   - session-handoff.md — translate all headers and content
   - TODO.md — translate meta instructions and headers
   - .claude/candidates.md — translate section headers
   - STRUCTURE.md — translate all headers and table column names;
     update 命名规范 column to reflect new language's naming conventions
   - .cursor/rules/project-system.mdc — translate all content (if exists)

4. Ask user about user file renaming:
   "是否要按新语言的命名规范重命名用户文件？(Rename user files to match new language naming conventions?)"
   → Use AskUserQuestion with yes/no options

5. If user chose yes:
   a. Read STRUCTURE.md naming conventions for the new language
   b. Scan all user files (respecting exclusion rules)
   c. For each file whose name doesn't match the new language convention:
      - Determine the correct new name
      - Safety checks (cross-reference, name collision, system file)
      - Rename using `git mv` if in git repo
      - Update all references in other files
   d. Update STRUCTURE.md 整理历史 with the rename operation
   e. Update .claude/.file-snapshot.json

6. Report:
   - Language changed from {old} to {new}
   - System files rewritten: {count}
   - User files renamed: {count} (or "skipped")
   - References updated: {count}
```

### Safety

- Same constraints as File Reorganization Protocol (no overwrites, preserve git history, update references)
- Never rename system management files (CLAUDE.md, PROJECT.md, etc.)
- Never rename files in exclusion list

---

## Upgrade Mode

When some files already exist:

### Rules
1. **Never overwrite** any existing file content
2. **Create only missing files** with templates
3. **For existing CLAUDE.md**: check if it contains `## 项目管理系统` section. If missing, offer to append the system rules block. If present, check for missing elements from the 5-component system:
   - Does the trigger words table include `整理文件 / organize files`? If not, add it.
   - Does the file roles table include `STRUCTURE.md` and `.claude/.file-snapshot.json`? If not, add them.
   - Does the Session End Protocol include step 6 (整理文件结构)? If not, insert it between step 5 (收集宪法候选) and the last step (输出中文总结), and renumber accordingly.
   - Does it say "4 组件"? If so, update to "5 组件".
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

### Legacy Migration (.claude/memory/ → new system)

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

### Upgrade Report

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

---

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
| Moving files without checking cross-references | Always grep for imports/links to old path and update them |
| Overwriting files on name collision | If same-name file exists at target, flag for manual resolution instead |
| Moving management files (CLAUDE.md, PROJECT.md, etc.) | These must stay at project root. Never reorganize them |
| Using bare mv instead of git mv | In git repos, use git mv to preserve history |
| Removing user-written STRUCTURE.md rules | Only add new rules. Never remove without confirmation |
| Creating STRUCTURE.md rules without scanning project | Rules must be based on actual file analysis, not generic templates |
| Running file reorganization on excluded directories | Always check exclusion list before any file operation |
| Using Mode A (deep) when Mode B (incremental) was triggered | "收工" → Mode B (incremental, only new files). "整理文件" → Mode A (deep, all files). Never mix them. |
| Re-reading unchanged files in Mode B | Mode B only processes files NOT in .file-snapshot.json. Skip everything else to save tokens. |
| Doing content-aware naming in Mode B | Mode B only places new files. Renaming/moving existing files is Mode A's job. |
| Not reading file contents in Mode A | Mode A MUST read each file to understand it. Don't just match by extension/filename. |
| Not checking cross-directory consistency in Mode A | Mode A should detect inconsistencies between sibling directories (e.g., different naming patterns for same file type) |
| Hardcoding trigger words instead of matching intent | Triggers should match semantic intent in any language, not fixed phrases |
| Changing system file names (CLAUDE.md, PROJECT.md) when switching language | System management file names always stay English. Only user files can be renamed. |
| Writing end session summary in wrong language | Always check CLAUDE.md Language setting before generating output |
| Not updating STRUCTURE.md naming conventions when language changes | Language Change Protocol must update both content language AND naming rules |
| Forcing English filenames when language is zh | zh mode allows Chinese filenames for user files |
| Forcing Chinese filenames when language is en | en mode enforces English kebab-case for user files |
