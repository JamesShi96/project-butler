# File Templates

> Loaded during: `/project-butler` initialization (fresh or upgrade).

## Variable Replacements

All templates use these variables:
- `{{PROJECT_NAME}}` → Q1 answer
- `{{ONE_LINE_DESCRIPTION}}` → Q2 answer
- `{{CURRENT_STAGE}}` → Q3 answer
- `{{GITHUB_LINE}}` → `- **GitHub：** {{answer}}` if Q4 provided, else empty string
- `{{DATE}}` → today YYYY-MM-DD
- `{{LANGUAGE}}` → Q6 answer (`en`, `zh`, or `bilingual`)

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

本项目使用 5 组件管理系统。

- **Log Compaction Threshold:** 10（每积累 10 个日志文件压缩为 1 个 summary）

### 触发词

| Intent | AI Action |
|--------|-----------|
| End session / wrap up — any expression of "we're done for now" (end session, 结束会话, 收工, wrap up, done for today, etc.) | Write log + update handoff + sync Wiki + check TODO + collect constitution candidates + file reorganization + evaluate update log + output summary in configured language |
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
| UPDATE_LOG.md | AI 自动 | end session + 重大更新时 |

### Session Start Protocol

At session start:

1. Read `PROJECT.md` for project overview, and check the Language setting in CLAUDE.md to determine output language.
2. **Read logs (bounded):**
   - Find the highest level with summaries in `log/summaries/` — read all summaries at that level.
   - Read all unarchived raw logs in `log/` (exclude `summaries/` and `archive/`).
   - Total files read: at most 2 × (threshold − 1), regardless of project age.
   - If `log/` doesn't exist yet, skip this step.

### Session End Protocol

当用户说 "end session" / "结束会话" / "收工" 时，按顺序执行：

1. **写会话日志** → `log/session-YYYY-MM-DD-{主题slug}.md`
   - 同日多次会话用 slug 区分（如 `session-2026-04-21-prd-draft.md`）
2. **Log Compaction** → 检查未归档 raw logs 数量，若 ≥ threshold 则执行压缩（见 Log Compaction Protocol）
3. **更新 session-handoff.md** → 刷新"当前进度 / 下一步"
4. **更新 PROJECT.md** → 如有结构/模块状态变化，同步更新
5. **更新 TODO.md** → 标记本次已完成的任务
6. **收集宪法候选** → 识别本次会话中的规则/偏好/边界，追加到 `.claude/candidates.md`
7. **整理文件结构（增量模式）** → 只处理新增/变更文件，按 STRUCTURE.md 规则快速归类
   - 若 STRUCTURE.md 不存在：先建立规则表（深度模式），再整理
   - 若 STRUCTURE.md 已存在：只匹配新增文件，不重读已有文件
   - 更新 `.claude/.file-snapshot.json`
8. **评估并写入 Update Log** → 评估本次会话是否包含重大更新（新功能、重大修改、3+ 文件变更、用户声明里程碑、重要 TODO 完成）
   - 若是重大更新：在 `UPDATE_LOG.md` 顶部追加一条记录（标题 + 变更要点），可选创建 GitHub Release
   - 若不是：静默跳过
9. **Output summary** → A brief summary of what was done this session, in the configured language

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
| UPDATE_LOG.md | 更新日志，记录重大更新 |

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
| 1 | 采用 5 组件管理系统 | Log + Wiki + Structure + Constitution + TODO | {{DATE}} |

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
description: Apply at session start and when user says end session / review claude / sync wiki / status / organize files. Defines the project memory stack behavior.
---

# {{PROJECT_NAME}} — Project System Rules

## Session Start
1. Read PROJECT.md and session-handoff.md at the start of every conversation.
2. Read logs (bounded): highest-level summaries in log/summaries/ + all unarchived raw logs in log/. Skip if log/ doesn't exist.

## End Session Protocol
When user says "end session" / "结束会话" / "收工":
1. Write log/session-YYYY-MM-DD-{slug}.md (summary, decisions, outputs, next steps)
2. Log Compaction — compact unarchived raw logs if count ≥ threshold (see Log Compaction Protocol)
3. Update session-handoff.md (refresh progress, next steps)
4. Update PROJECT.md if structure or module status changed
5. Update TODO.md (mark completed tasks)
6. Collect CLAUDE.md candidates → append to .claude/candidates.md
7. File structure reorganization (incremental mode) — only process new/changed files, match against STRUCTURE.md rules, organize (create STRUCTURE.md if missing)
8. Evaluate and write update log — if significant changes, prepend entry to UPDATE_LOG.md; optionally offer GitHub Release
9. Output summary in configured language

## Triggers
| Intent | Action |
|--------|--------|
| End session / wrap up (any language) | Write log, update handoff, sync wiki, check TODO, collect candidates, file reorganization, evaluate update log, output summary |
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
| UPDATE_LOG.md | AI auto | end session + significant updates |
```

---

## Template 7: STRUCTURE.md

Adapt headers and column names using the STRUCTURE.md glossary. The 命名规范 column values change based on language setting.

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
- log/summaries/
- log/archive/
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

**Rule generation logic:**

When creating STRUCTURE.md for the first time:

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

4. **These are starting points.** Adapt rules based on actual file content and project context. Refine, merge, or add rules as needed — not blindly copy templates.

---

## Template 8: UPDATE_LOG.md

Adapt headers using the UPDATE_LOG glossary. Content language follows the project's configured language.

```
# Update Log

> 记录项目的重大更新（AI 在 end session 时自动判断是否写入）。
```
