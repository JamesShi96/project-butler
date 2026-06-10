# File Templates

> Loaded during: `/project-butler` initialization (fresh or upgrade).

## Variable Replacements

All templates use these variables:
- `{{PROJECT_NAME}}` → Q1 answer
- `{{ONE_LINE_DESCRIPTION}}` → Q2 answer
- `{{CURRENT_STAGE}}` → Q3 answer
- `{{GITHUB_LINE}}` → `- **GitHub：** {{answer}}` if Q4 provided, else empty string
- `{{GITHUB_LINK_LINE}}` → `- GitHub: https://github.com/{{answer}}` if Q4 provided, else `- （待添加）`
- `{{DATE}}` → today YYYY-MM-DD
- `{{LANGUAGE}}` → Q6 answer (`en`, `zh`, or `bilingual`)
- `{{DOC_TYPES}}` → Q7 answers (list of selected document type directories, e.g., `prd, tech-design, research`)
- `{{DOC_SECTIONS}}` → DOCS.md sections generated from Q7 selected document types
- `{{VERSION_STYLE}}` → Q8 answer (`semantic`, `codename`, `patch`, or `date`)
- `{{VERSION_INITIAL}}` → initial version calculated from Q8 (`v0.1.0`, `<project name> 0.1`, `Patch 1`, or `{YYYY.MM}.1`)
- `{{PROFILE_STATUS}}` → `enabled` when Foundation Setup creates profile files, otherwise `not enabled`
- `{{PROFILE_SHAPE}}` → generated project shape label from Foundation Setup, or empty when profile is not enabled

For language adaptation: adapt headers, labels, and descriptions to the configured language. See `references/language-adaptation.md` for glossaries.

When creating `log/` directory, also create `log/.gitkeep` (empty file) so git tracks the directory even when empty.

---

## Template 1: CLAUDE.md

The most critical file — auto-loaded by Claude Code, defines all ongoing behavior.

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

日常只需要记住三个动作：

- `end session` — 保存进度和下一步
- `continue` — 下次接着干
- `status` — 查看项目现状

- **Log Compaction Threshold:** 10（每积累 10 个日志文件压缩为 1 个 summary）

### 主要触发词

| Intent | AI Action |
|--------|-----------|
| End session / wrap up — any expression of "we're done for now" (end session, 结束会话, 收工, wrap up, done for today, etc.) | Save progress, refresh next steps, and record important changes |
| Continue — any expression of "pick up where we left off" (接着上次, continue, 上次做到哪了, etc.) | Read last session log + session-handoff.md + PROJECT.md + TODO.md + UPDATE_LOG.md + DOCS.md + rules to recover context |
| Check status — any expression of "what's the current state" (status, 项目现状, where are we, etc.) | Show compact dashboard: Project, Active Work, Recent Change, Next Best Step |
| Normal close / Full close — explicit profile-aware close mode | Save session and either defer profile updates or align affected profile docs with a bounded Scope Plan |

### 高级触发词

| Intent | AI Action |
|--------|-----------|
| Review constitution — any expression of "check/update rules" (review claude, 更新宪法, check rules, etc.) | Show .claude/candidates.md for confirmation one by one |
| Sync wiki — any expression of "update project overview" (sync wiki, 同步项目, refresh overview, etc.) | Force rescan and update PROJECT.md |
| Organize files — any expression of "clean up files" (organize files, 整理文件, clean up, sort files, etc.) | Scan project files, organize per STRUCTURE.md rules |
| Change language — any expression of "switch language" (切换语言, change language, switch to English, 换成中文, etc.) | Update Language setting, rewrite management files in the new language, optionally rename user files per STRUCTURE.md |
| Continue full context — any expression of "full project review" (全面回顾, full context, 项目全景, etc.) | Full project trajectory recovery across all sessions + management files |
| Profile setup / foundation repair — explicit profile-system request | Create or repair project profile files and baseline reference docs after confirmation |

### 内部机制：文件职责

本项目使用 7 组件基础管理系统。若启用 Profile System，会额外维护 2 个可选 profile JSON 文件。用户日常不需要手动维护这些文件；AI 按触发词自动更新。

| File | Who writes | When |
|------|-----------|------|
| CLAUDE.md | 人工确认 | review claude 时 |
| PROJECT.md | AI 自动 | end session + 文件结构变化时 |
| session-handoff.md | AI 自动 | end session 时 |
| TODO.md | AI + 人 | 随时 |
| log/session-*.md | AI | end session 时 |
| .claude/candidates.md | AI 自动 | 过程中识别到稳定规则时 |
| STRUCTURE.md | AI 自动 | end session + 文件结构变化时 |
| .claude/file-snapshot.json | AI 自动 | end session 时 |
| UPDATE_LOG.md | AI 自动 | end session + 重大更新时 |
| DOCS.md | AI 自动 | end session + 文档归档时 |
| .claude/project-profile.json | AI 自动 | Foundation Setup + 用户确认的 profile 变更时 |
| .claude/profile-pending.json | AI 自动 | Normal Close / Full Close 记录画像待处理项时 |

### Session Start Protocol

At session start:

1. Read `PROJECT.md` for project overview, `session-handoff.md` for current progress / next steps, `TODO.md` for active tasks, `UPDATE_LOG.md` for milestone history, and `DOCS.md` for document index if present. If `.claude/project-profile.json` or `.claude/profile-pending.json` exists, read them for profile shape, document policies, pending profile debt, and review queue. Check the Language setting in CLAUDE.md to determine output language.
2. **Read logs (bounded):**
   - Find the highest level with summaries in `log/summaries/` — read all summaries at that level.
   - Read all unarchived raw logs in `log/` (exclude `summaries/` and `archive/`).
   - Total files read: at most 2 × (threshold − 1), regardless of project age.
   - If `log/` doesn't exist yet, skip this step.

### Session End Protocol

当用户表达本次工作结束（如 "end session" / "结束会话" / "收工" / "wrap up" / "done for today"）时，按顺序执行：

1. **写会话日志** → `log/session-YYYY-MM-DD-{主题slug}.md`
   - 同日多次会话用 slug 区分（如 `session-2026-04-21-prd-draft.md`）
2. **Log Compaction** → 检查未归档 raw logs 数量；若 ≥ threshold，则生成 `log/summaries/L1-{seq}.md` 并把原始日志归档到 `log/archive/raw-{seq}/`（不删除）
3. **更新 session-handoff.md** → 刷新"当前进度 / 下一步"
4. **更新 PROJECT.md** → 如有结构/模块状态变化，同步更新
5. **更新 TODO.md** → 标记本次已完成的任务
6. **收集宪法候选** → 识别本次会话中的规则/偏好/边界，追加到 `.claude/candidates.md`
7. **Profile impact scan** → 若 `.claude/project-profile.json` 存在，或用户明确要求 Normal Close / Full Close，先扫描本次会话是否影响 PRD、架构、Roadmap、Evals、Research、Design、Delivery 等长期画像文档
   - Normal Close：只把画像影响写入 `.claude/profile-pending.json`
   - Full Close：先生成 Scope Plan，经确认后只在边界内做安全更新
   - 不自动改 protected sections、document policies 或 stable baselines
8. **整理文件结构（增量模式）** → 只处理新增/变更文件，按 STRUCTURE.md 规则快速归类
   - 若 STRUCTURE.md 不存在：先建立规则表（深度模式），再整理
   - 若 STRUCTURE.md 已存在：只匹配新增文件，不重读已有文件
   - 更新 `.claude/file-snapshot.json`
9. **文档归档** → 扫描本次会话产出的新增/变更文档，按类型归档并更新文档索引
   - 识别并分类文档（PRD / 技术设计 / 设计文档 / 调研 / 会议纪要 / 实验记录）
   - 归档到 `docs/` 对应子目录 + 更新 `DOCS.md` 索引元数据
   - 若 DOCS.md 不存在：创建（升级兼容）
10. **评估并写入 Update Log** → 评估本次会话是否包含重大更新（新功能、重大修改、3+ 文件变更、用户声明里程碑、重要 TODO 完成）
   - 若是重大更新：判断版本递增级别（major/minor/patch），计算新版本号，在 `UPDATE_LOG.md` 顶部追加版本化条目，可选创建 GitHub Release
   - 若不是：静默跳过
11. **Output summary** → result-focused summary in the configured language

### Output Style

After `end session`, summarize outcomes instead of listing internal protocol steps:

Shape:
- `Session saved.`
- `Updated:` include only applicable outcomes: handoff, TODO counts, wiki sync, profile normal/full close result, archived documents, update-log version or skipped
- `Next:` list the next concrete actions

Omit lines that do not apply. For `status`, answer as a compact dashboard:

Shape:
- `Current Status`
- `Project:` stage and current focus
- `Active Work:` active TODOs or current work
- `Recent Change:` latest update-log entry or "No milestone update yet"
- `Profile:` profile shape / pending debt / review needed, only when profile files exist
- `Next Best Step:` one recommended next step

### Session Log Format

Session log headers adapt to the configured language. Use the headings below, translated to the configured language when needed.

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

**绝对不要自动把候选条目提升到 CLAUDE.md。** 所有候选条目必须经用户 review 明确确认后才写入。

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

---

## Template 2: PROJECT.md

Adapt headers using the PROJECT.md glossary. In bilingual mode, use Chinese headers with English in parentheses.

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
├── UPDATE_LOG.md               ← 更新日志（重大更新时写入）
├── DOCS.md                    ← 文档索引（AI 自动归档）
├── docs/                      ← 文档仓库
│   ├── prd/                   ← PRD
│   ├── tech-design/           ← 技术设计
│   └── ...                    ← 其他文档类型
├── log/                        ← 会话日志
└── .claude/
    ├── candidates.md           ← 宪法候选池
    ├── project-profile.json    ← Project Profile 配置（可选）
    ├── profile-pending.json    ← Profile 待处理队列（可选）
    └── file-snapshot.json     ← 文件整理快照
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
| UPDATE_LOG.md | 更新日志，记录重大更新 |
| DOCS.md | 文档索引，记录所有文档的元数据和层级关系 |
| .claude/project-profile.json | Project Profile 配置：项目形态、目录层级、文档策略 |
| .claude/profile-pending.json | Profile 待处理队列：pending、profile debt、review queue |

## 当前进度快照
| 模块 | 状态 | 备注 |
|------|------|------|
| （待填充） | | |

## 相关链接
{{GITHUB_LINK_LINE}}
```

Variable: `{{GITHUB_LINK_LINE}}` → `- GitHub: https://github.com/{{answer}}` if provided, else `- （待添加）`

---

## Template 3: session-handoff.md

Adapt headers using the session-handoff.md glossary.

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
| 1 | 采用 7 组件基础管理系统 | Constitution + Wiki + Structure + Update Log + Docs + Log + TODO；Profile System 为可选扩展 | {{DATE}} |

## 迭代历史
| 版本 | 日期 | 变更 |
|------|------|------|
| v0.1 | {{DATE}} | 项目管理系统初始化 |

## 下一步
- [ ] 开始项目工作
```

---

## Template 4: TODO.md

Adapt meta instructions using the TODO.md glossary.

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

## Template 5: .claude/candidates.md

Adapt section headers using the candidates.md glossary. Ensure `.claude/` directory exists before writing.

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

---

## Template 6: .cursor/rules/project-system.mdc

Only create if user answered yes to Q5. Mirror the language setting from CLAUDE.md.

```
---
description: Apply at session start and when user says end session / review claude / sync wiki / status / organize files / change language / continue / continue full context. Defines project memory behavior.
---

# {{PROJECT_NAME}} — Project System Rules

## Daily Workflow
Users only need these daily commands:

- `end session` — save progress and next steps
- `continue` — resume next time
- `status` — check current project state

## Session Start
1. Read PROJECT.md, session-handoff.md, TODO.md, UPDATE_LOG.md, and DOCS.md if present at the start of every conversation. If .claude/project-profile.json or .claude/profile-pending.json exists, read them for profile shape, document policies, profile debt, and review queue. Check the Language setting in CLAUDE.md to determine output language.
2. Read logs (bounded): highest-level summaries in log/summaries/ + all unarchived raw logs in log/. Skip if log/ doesn't exist.

## End Session Protocol
When user expresses that the work session is done, such as "end session" / "结束会话" / "收工" / "wrap up" / "done for today":
1. Write log/session-YYYY-MM-DD-{slug}.md (summary, decisions, outputs, next steps)
2. Log Compaction — if unarchived raw log count ≥ threshold, write `log/summaries/L1-{seq}.md` and archive raw logs under `log/archive/raw-{seq}/` without deleting history
3. Update session-handoff.md (refresh progress, next steps)
4. Update PROJECT.md if structure or module status changed
5. Update TODO.md (mark completed tasks)
6. Collect CLAUDE.md candidates → append to .claude/candidates.md
7. Profile impact scan — if .claude/project-profile.json exists or user requested Normal Close / Full Close, classify profile-impacting changes; Normal Close records pending items, Full Close requires a Scope Plan before changing profile docs
8. File structure reorganization (incremental mode) — only process new/changed files, match against STRUCTURE.md rules, organize (create STRUCTURE.md if missing)
9. Document archiving — scan new/changed document output, classify by type, archive under docs/, update DOCS.md index
10. Evaluate and write update log — if significant changes, determine version bump level (major/minor/patch), calculate new version, prepend versioned entry to UPDATE_LOG.md; optionally offer GitHub Release
11. Output result-focused summary in configured language

## Output Style
After `end session`, summarize outcomes instead of listing internal protocol steps:

Shape:
- `Session saved.`
- `Updated:` include only applicable outcomes: handoff, TODO counts, wiki sync, profile normal/full close result, archived documents, update-log version or skipped
- `Next:` list the next concrete actions

Omit lines that do not apply. For `status`, answer as a compact dashboard:

Shape:
- `Current Status`
- `Project:` stage and current focus
- `Active Work:` active TODOs or current work
- `Recent Change:` latest update-log entry or "No milestone update yet"
- `Profile:` profile shape / pending debt / review needed, only when profile files exist
- `Next Best Step:` one recommended next step

## Primary Triggers
| Intent | Action |
|--------|--------|
| End session / wrap up (any language) | Save progress, refresh next steps, and record important changes |
| Continue (any language) | Read last session log + management files to recover the last working context |
| Check status (any language) | Show compact dashboard: Project, Active Work, Recent Change, Next Best Step |
| Normal close / Full close (any language) | Save session and either defer profile updates or align affected profile docs with Scope Plan |

## Advanced Triggers
| Intent | Action |
|--------|--------|
| Review constitution (any language) | Show .claude/candidates.md for user to confirm each entry |
| Sync wiki (any language) | Force rescan and update PROJECT.md |
| Organize files (any language) | Scan files and reorganize according to STRUCTURE.md rules |
| Change language (any language) | Update language setting, rewrite management files in the new language, optionally rename user files per STRUCTURE.md |
| Continue full context (any language) | Recover full project trajectory from session history + management files |
| Profile setup / foundation repair (any language) | Create or repair project profile files and baseline reference docs after confirmation |

## Internals: File Roles
This project uses a 7-component base memory stack internally. When Profile System is enabled, it also maintains 2 optional profile JSON files. Users should not need to manage these files by hand.

| File | Who writes | When |
|------|-----------|------|
| CLAUDE.md | Human-confirmed | review claude trigger |
| PROJECT.md | AI auto | end session + structure changes |
| session-handoff.md | AI auto | end session |
| TODO.md | AI + Human | anytime |
| log/session-*.md | AI | end session |
| .claude/candidates.md | AI auto | when stable rules identified |
| STRUCTURE.md | AI auto | end session + file structure changes |
| .claude/file-snapshot.json | AI auto | end session |
| UPDATE_LOG.md | AI auto | end session + significant updates |
| DOCS.md | AI auto | end session + document archiving |
| .claude/project-profile.json | AI auto | Foundation Setup + confirmed profile changes |
| .claude/profile-pending.json | AI auto | Normal Close / Full Close profile pending queue |
```

---

## Template 7: STRUCTURE.md

Adapt headers and column names using the STRUCTURE.md glossary. The 命名规范 column values change based on language setting.

```
# {{PROJECT_NAME}} — 文件管理结构

> 最后更新：{{DATE}}

## 项目类型
{{determined by module map — see Rule Generation below}}

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
- docs/
- log/
- log/summaries/
- log/archive/
- {{项目自定义排除}}

## 目录规则

| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| （AI 根据项目分析自动生成） | | | （kebab-case / 中文 / PascalCase 等） | |

## 待分类
以下文件尚未归类（下次整理时处理）：
- （暂无）

## 整理历史
| 日期 | 操作 | 文件数 |
|------|------|--------|
| {{DATE}} | 初始化结构 | 0 |
```

**Rule generation logic:**

When creating STRUCTURE.md during initialization:

1. **Run a lightweight discovery** — scan all files in the project (excluding the default exclusion list):
   - File type distribution (glob only, no content reading)
   - Existing directory structure
   - Naming patterns in filenames
   - If the project has import/require patterns, grep for module boundaries

2. **Generate rules from discovery** — based on what you actually found, not generic templates:
   - For each distinct file group (by type, by directory, by naming pattern), create a row in the directory rules table
   - Match condition: describe what files belong here (file extensions, name patterns, content keywords)
   - Naming convention: based on the language setting and what the existing files already use
   - Priority: lower number = higher priority when a file matches multiple rules

3. **If the project is empty** (no files yet), use a minimal starter rule based on the project type determined from user answers in Step 2:
   - If the one-line description mentions code/software: create a minimal src/ rule
   - Otherwise: leave the rules table empty with a note "（AI will populate rules after project files are created）"

4. **Language-specific naming rules:**

When `en`: all user file names use kebab-case or snake_case, English only.
When `zh`: all user file names can use Chinese characters, no restriction to ASCII.
When `bilingual`: English naming preferred; Chinese names acceptable for docs and content files.

---

## Template 8: UPDATE_LOG.md

Adapt headers using the UPDATE_LOG glossary. Content language follows the project's configured language. Version style comes from Q8 answer.

**Semantic:**
```
# Update Log

> 记录项目的重大更新（AI 在 end session 时自动判断是否写入）。

<!-- version-style: semantic -->

## v0.1.0 ({{DATE}})

### Minor: 初始发布

- 项目管理系统初始化

---
```

**Codename:**
```
# Update Log

> 记录项目的重大更新（AI 在 end session 时自动判断是否写入）。

<!-- version-style: codename -->
<!-- version-codename: {{PROJECT_NAME}} -->

## {{PROJECT_NAME}} 0.1 ({{DATE}})

### Minor: 初始发布

- 项目管理系统初始化

---
```

**Patch:**
```
# Update Log

> 记录项目的重大更新（AI 在 end session 时自动判断是否写入）。

<!-- version-style: patch -->

## Patch 1 ({{DATE}})

### Minor: 初始发布

- 项目管理系统初始化

---
```

**Date:**
```
# Update Log

> 记录项目的重大更新（AI 在 end session 时自动判断是否写入）。

<!-- version-style: date -->

## YYYY.MM.1 ({{DATE}})

### Minor: 初始发布

- 项目管理系统初始化

---
```

Note: For date style, replace `YYYY.MM.1` with the actual current year and month, e.g., `2026.06.1`.

---

## Template 9: DOCS.md

Adapt headers using the DOCS.md glossary in `references/language-adaptation.md`. Generate sections only for document types selected during initialization (Q7) or confirmed by Foundation Setup; do not create sections for unselected types.

```
# {{PROJECT_NAME}} — 文档索引

> 最后更新：{{DATE}}

{{DOC_SECTIONS}}

## 整理历史
| 日期 | 操作 | 文档数 |
|------|------|--------|
| {{DATE}} | 初始化 | 0 |
```

Build `{{DOC_SECTIONS}}` from Q7 using this mapping:

- PRD: directory `docs/prd/`, title `## PRD`, initial row `[docs/prd/main.md](docs/prd/main.md) | 产品需求总览 | 草稿 | {{DATE}} | -`
- 技术设计: directory `docs/tech-design/`, title `## 技术设计`, initial row `[docs/tech-design/main.md](docs/tech-design/main.md) | 技术设计总览 | 草稿 | {{DATE}} | -`
- 设计文档: directory `docs/design/`, title `## 设计文档`, initial row `（暂无） | | | | |`
- 调研: directory `docs/research/`, title `## 调研`, initial row `（暂无） | | | | |`
- 会议纪要: directory `docs/meeting-notes/`, title `## 会议纪要`, initial row `（暂无） | | | | |`
- 实验记录: directory `docs/experiments/`, title `## 实验记录`, initial row `（暂无） | | | | |`

Each generated section uses this table header:

```
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|
```

**Directory creation:** For each selected type, create `docs/{type}/` with a `.gitkeep` file. For types with a main.md placeholder, create the placeholder file:

```
# {Type Name} 总览

> 最后更新：{{DATE}}

## 概述
（待填充）
```

**Variable:** `{{DOC_TYPES}}` — comma-separated list of selected type directory names (e.g., `prd, tech-design, design, research`).

---

## Profile System Template Notes

When Foundation Setup is enabled, use `references/project-profile-system.md` as the source of truth for `.claude/project-profile.json`, `.claude/profile-pending.json`, document tiers, protected sections, and profile-aware close behavior.

Do not duplicate the full profile schema in this file. This file only needs generated project rules to know that profile files may exist and should be read during session start, status, and end session.

Baseline docs generated from Foundation Setup should use this minimum shape:

```markdown
# {Document Title}

> Last updated: {{DATE}}
> Status: draft

## Stable Baseline
Known facts and confirmed scope. Do not rewrite without explicit user approval.

## Active Scope
Current working scope that Full Close may patch when policy allows it.

## Open Questions
- TBD

## Index
Sub-doc links and related documents.

## Change Log
- {{DATE}} — Created by Foundation Setup.
```
