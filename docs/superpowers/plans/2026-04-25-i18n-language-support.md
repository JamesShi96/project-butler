# i18n Language Support — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add configurable language support (en/zh/bilingual) to the project-init skill, covering all templates, trigger words, session logs, and a language switch protocol.

**Architecture:** Add a Language Adaptation system to SKILL.md with a key terms glossary. All templates adapt via glossary-based translation (no 3x template duplication). Trigger words change from fixed phrases to semantic intent descriptions. New Language Change Protocol handles switching.

**Tech Stack:** Markdown skill file, no code dependencies.

**Target file:** `/Users/sjw/.claude/skills/project-init/SKILL.md`

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| SKILL.md:1-4 (frontmatter) | Modify | Mention i18n in description |
| SKILL.md:6-33 (diagram + intro) | Modify | Add language as a system feature |
| SKILL.md (after diagram, before Step 0) | Create | New "Language Adaptation" section with glossary |
| SKILL.md:39-64 (Step 0) | Modify | Add language change trigger (Type D) |
| SKILL.md:84-97 (Step 2) | Modify | Add language question (Q6) |
| SKILL.md:99-133 (Step 3+4) | Modify | Pass language to templates; update report |
| SKILL.md:135-244 (Template 1: CLAUDE.md) | Modify | Add language section, semantic triggers, language-aware content |
| SKILL.md:246-338 (Templates 2-3) | Modify | Add language adaptation notes |
| SKILL.md:340-358 (Template 4: TODO.md) | Modify | Add language adaptation notes |
| SKILL.md:360-382 (Template 5: candidates.md) | Modify | Add language adaptation notes |
| SKILL.md:384-429 (Template 6: cursor rules) | Modify | Add semantic triggers, language notes |
| SKILL.md:431-515 (Template 7: STRUCTURE.md) | Modify | Add language-aware naming conventions |
| SKILL.md:517-656 (File Reorganization Protocol) | Modify | Use language-appropriate naming |
| SKILL.md (after Reorganization, before Upgrade) | Create | New "Language Change Protocol" section |
| SKILL.md:658-750 (Upgrade Mode) | Modify | Detect missing language setting |
| SKILL.md:752-756 (Common Mistakes) | Modify | Add i18n entries |
| README.md | Modify | Mention language support |
| README_zh.md | Modify | Mention language support |

---

### Task 1: Add Language Adaptation Section + Update Frontmatter

**Files:**
- Modify: `SKILL.md:1-4` (frontmatter)
- Modify: `SKILL.md:6-33` (diagram + intro)
- Create: New section after diagram, before Step 0

- [ ] **Step 1: Update frontmatter description**

Change the description to mention i18n:

```markdown
---
name: project-init
description: "Use when initializing or upgrading a project's management system, or when ending a work session. Triggers on /project-init, '初始化项目', 'setup project', '项目初始化', 'end session', '结束会话', '收工', '整理文件', 'organize files', '切换语言', 'change language', or when a project lacks management files (CLAUDE.md, PROJECT.md, STRUCTURE.md, session-handoff.md, TODO.md). Creates a 5-component system: session logs, project wiki, file structure management, constitution tracking, and task execution. Supports 3 language modes (English, Chinese, bilingual). When triggered by session-end keywords, execute the full end session protocol including file reorganization. When triggered by '整理文件' alone, only execute the File Reorganization Protocol. Supports fresh install and non-destructive upgrade for existing projects."
---
```

- [ ] **Step 2: Update intro line**

Change:
```
Core idea: bottom feeds top, top constrains bottom. Logs and TODOs are raw facts. Wiki is the current snapshot. Structure manages file organization. Constitution is stable principles.
```
To:
```
Core idea: bottom feeds top, top constrains bottom. Logs and TODOs are raw facts. Wiki is the current snapshot. Structure manages file organization. Constitution is stable principles.

Supports 3 language modes: English, Chinese (中文), or bilingual. All content adapts to the selected language.
```

- [ ] **Step 3: Add Language Adaptation section after diagram, before Step 0**

Insert the following new section between the architecture diagram and the `## Execution Flow` heading:

```markdown
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
```

- [ ] **Step 4: Commit**

```bash
git add SKILL.md
git commit -m "feat: add Language Adaptation section with key terms glossary"
```

---

### Task 2: Update Step 0 — Add Language Change Trigger + Update Step 2

**Files:**
- Modify: `SKILL.md` Step 0 (trigger handling)
- Modify: `SKILL.md` Step 2 (interactive questions)
- Modify: `SKILL.md` Step 4 (output report)

- [ ] **Step 1: Add Type D trigger to Step 0**

In Step 0, after the Type C block (initialization keywords), add:

```markdown
**D. Triggered by language change intent (切换语言 / change language / 换个语言 / switch to English, etc.):**
1. Skip initialization steps (Step 1-4)
2. Execute the **Language Change Protocol** section below
3. Report results and stop
```

- [ ] **Step 2: Add language question to Step 2**

In Step 2, after Q5, add Q6:

```markdown
6. **语言 / Language** — 选择管理文件内容语言 / Select content language for management files：
   - `en` — English
   - `zh` — 中文
   - `bilingual` — 中英双语（默认 / default）
```

- [ ] **Step 3: Update Step 3 to pass language variable**

In Step 3, add a note at the top:

```markdown
Use the language setting from Q6 when generating all file content. Apply the Language Adaptation rules and Key Terms Glossary above.
```

Add `{{LANGUAGE}}` to the variable list:
```markdown
- `{{LANGUAGE}}` → answer to Q6 (`en`, `zh`, or `bilingual`)
```

- [ ] **Step 4: Update Step 4 output report**

In the report, add a language status line after the Cursor rules line:

```markdown
  🌐 Language: {{LANGUAGE}}
```

And update 下一步 section to mention language:
```markdown
下一步：
1. 根据项目需要，在 TODO.md 添加第一批任务
2. 正常开始工作
3. 结束时说 "end session" 即可自动记录
4. 切换语言随时说 "change language" / "切换语言"
```

- [ ] **Step 5: Commit**

```bash
git add SKILL.md
git commit -m "feat: add language trigger, question, and report"
```

---

### Task 3: Update CLAUDE.md Template (Template 1) — Language + Semantic Triggers

**Files:**
- Modify: `SKILL.md` Template 1 (CLAUDE.md template)

This is the most important template. Changes: add language section, replace fixed trigger words with semantic intent descriptions.

- [ ] **Step 1: Add language section to CLAUDE.md template**

In Template 1, after `## 项目概况` and before `## 项目管理系统`, insert:

```markdown
## Language / 语言
- **Language:** {{LANGUAGE}}
```

- [ ] **Step 2: Replace fixed trigger table with semantic intent table**

Replace the current 触发词 table:

```markdown
| 你说 | AI 执行 |
|------|---------|
| end session / 结束会话 / 收工 | 写 log + 更新 handoff + 同步 Wiki + 校对 TODO + 收集宪法候选 + 输出中文总结 |
| review claude / 更新宪法 | 展示 .claude/candidates.md 逐条确认 |
| sync wiki / 同步项目 | 强制重扫并更新 PROJECT.md |
| status / 项目现状 | 朗读 PROJECT.md + session-handoff.md 摘要 |
| 整理文件 / organize files | 扫描项目文件，按 STRUCTURE.md 规则整理 |
```

With:

```markdown
| Intent | AI Action |
|--------|-----------|
| End session / wrap up — any expression of "we're done for now" (end session, 结束会话, 收工, wrap up, done for today, etc.) | Write log + update handoff + sync Wiki + check TODO + collect constitution candidates + file reorganization + output summary in configured language |
| Review constitution — any expression of "check/update rules" (review claude, 更新宪法, check rules, etc.) | Show .claude/candidates.md for confirmation one by one |
| Sync wiki — any expression of "update project overview" (sync wiki, 同步项目, refresh overview, etc.) | Force rescan and update PROJECT.md |
| Check status — any expression of "what's the current state" (status, 项目现状, where are we, etc.) | Read PROJECT.md + session-handoff.md summary aloud |
| Organize files — any expression of "clean up files" (organize files, 整理文件, clean up, sort files, etc.) | Scan project files, organize per STRUCTURE.md rules |
| Change language — any expression of "switch language" (切换语言, change language, switch to English, 换成中文, etc.) | Execute Language Change Protocol |
```

- [ ] **Step 3: Update 文件职责 table column headers**

Change column headers from Chinese to language-aware:

```markdown
| File | Who writes | When |
|------|-----------|------|
| CLAUDE.md | Human only (via review) | review constitution trigger |
| PROJECT.md | AI auto | end session + structure changes |
| session-handoff.md | AI auto | end session |
| TODO.md | AI + Human | anytime |
| log/session-*.md | AI | end session |
| .claude/candidates.md | AI auto | when stable rules identified |
| STRUCTURE.md | AI auto | end session + file structure changes |
| .claude/.file-snapshot.json | AI auto | end session |
```

- [ ] **Step 4: Update Session Start Protocol**

Change from:
```markdown
每次会话开始时，先读 `PROJECT.md` 获取项目全貌。
```
To:
```markdown
At session start, read `PROJECT.md` for project overview, and check the Language setting in CLAUDE.md to determine output language.
```

- [ ] **Step 5: Update Session End Protocol step 7 (summary language)**

Change:
```markdown
7. **输出中文总结** → 一段话概括本次做了什么，给你确认
```
To:
```markdown
7. **Output summary** → A brief summary of what was done this session, in the configured language
```

- [ ] **Step 6: Update Session Log Format section header**

Change the section from:
```markdown
### Session Log 格式
```
To:
```markdown
### Session Log Format
```

And update the template section headers to use a language-aware note:

```markdown
Session log headers adapt to the configured language. Use the Session Log entries from the Key Terms Glossary.
```

Then update the code block to show English headers with a note:

````markdown
```markdown
# Session YYYY-MM-DD — {topic}

## Session Goal
## Key Actions (Chronological)
## Decisions & Rationale
## Output Files
## Unfinished Items / Next Session Pickup
## CLAUDE.md Candidates (if any)
```

(Adapt all headers to configured language using the glossary.)
````

- [ ] **Step 7: Update 宪法候选识别规则 header**

Change:
```markdown
### 宪法候选识别规则
```
To:
```markdown
### Constitution Candidate Rules
```

- [ ] **Step 8: Update TODO 格式 section**

Change:
```markdown
### TODO 格式
```
To:
```markdown
### TODO Format
```

And update the format example:
```markdown
- [ ] {task description}
  Owner: {name} | Deadline: {date} | Dependencies: {prerequisite}
```

Change the instruction below:
```markdown
用户给的任务缺要素时，主动追问补全。完成的任务勾选保留（不删除）。
```
To:
```markdown
If a user provides a task missing required fields, ask them to fill in. Completed tasks are checked and kept (not deleted).
```

- [ ] **Step 9: Update variable replacements**

Add `{{LANGUAGE}}` to the variable replacement list:

```markdown
- `{{LANGUAGE}}` → answer to Q6
```

- [ ] **Step 10: Commit**

```bash
git add SKILL.md
git commit -m "feat: update CLAUDE.md template with language setting and semantic triggers"
```

---

### Task 4: Update Templates 2-5 — Language Adaptation Notes

**Files:**
- Modify: `SKILL.md` Template 2 (PROJECT.md)
- Modify: `SKILL.md` Template 3 (session-handoff.md)
- Modify: `SKILL.md` Template 4 (TODO.md)
- Modify: `SKILL.md` Template 5 (candidates.md)

Each template gets a brief adaptation instruction. The AI uses the glossary to generate correct content.

- [ ] **Step 1: Add adaptation note to Template 2 (PROJECT.md)**

At the top of Template 2, add:

```markdown
**Language adaptation:** Adapt all headers, labels, and descriptions to the configured language using the PROJECT.md entries in the Key Terms Glossary. In bilingual mode, use Chinese headers with English in parentheses.
```

Update the template's meta line from:
```
> 最后同步：{{DATE}}（自动）
```
To:
```
> Last synced: {{DATE}} (auto) — or in zh: > 最后同步：{{DATE}}（自动）
```

Update the file description column in 关键文件索引:
```markdown
| CLAUDE.md | Project constitution — rules and boundaries |
| PROJECT.md | This file — project overview |
| session-handoff.md | Cross-session handoff |
| TODO.md | Execution task list |
| .claude/candidates.md | Pending constitution candidates |
| STRUCTURE.md | File management rules — directory organization and matching conditions |
```

- [ ] **Step 2: Add adaptation note to Template 3 (session-handoff.md)**

At the top of Template 3, add:

```markdown
**Language adaptation:** Adapt all headers, labels, and descriptions to the configured language using the session-handoff.md entries in the Key Terms Glossary.
```

- [ ] **Step 3: Add adaptation note to Template 4 (TODO.md)**

At the top of Template 4, add:

```markdown
**Language adaptation:** Adapt the meta instruction line and section headers to the configured language. Task metadata fields use the TODO.md glossary entries (Owner, Deadline, Dependencies / 负责人, 截止, 依赖).
```

- [ ] **Step 4: Add adaptation note to Template 5 (candidates.md)**

At the top of Template 5, add:

```markdown
**Language adaptation:** Adapt section headers using the candidates.md glossary entries.
```

- [ ] **Step 5: Commit**

```bash
git add SKILL.md
git commit -m "feat: add language adaptation notes to Templates 2-5"
```

---

### Task 5: Update Templates 6-7 — Cursor Rules + STRUCTURE.md

**Files:**
- Modify: `SKILL.md` Template 6 (cursor rules)
- Modify: `SKILL.md` Template 7 (STRUCTURE.md)

- [ ] **Step 1: Update Template 6 (cursor rules) triggers**

Replace the fixed trigger words table in the cursor template with semantic intent descriptions:

```markdown
## Triggers
| Intent | Action |
|--------|--------|
| End session / wrap up (any language) | Write log, update handoff, sync wiki, check TODO, collect candidates, file reorganization, output summary |
| Review constitution (any language) | Show .claude/candidates.md for user to confirm each entry |
| Sync wiki (any language) | Force rescan and update PROJECT.md |
| Check status (any language) | Read PROJECT.md + session-handoff.md summary aloud |
| Organize files (any language) | Scan files and reorganize according to STRUCTURE.md rules |
| Change language (any language) | Execute Language Change Protocol |
```

Add language adaptation note at the top of Template 6:

```markdown
**Language adaptation:** This Cursor rules file should mirror the language setting from CLAUDE.md. Use the configured language for all descriptions and instructions.
```

- [ ] **Step 2: Update Template 7 (STRUCTURE.md) — add language-aware naming conventions**

In Template 7, change the 目录规则 table to include a 命名规范 (Naming Convention) column that varies by language:

Replace the reference rule tables. For each reference rule table (代码项目, 视频制作, 商业文档), add a **Naming Convention** column:

**代码项目参考规则：**
```markdown
| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| src/ | 源代码 | 按语言和模块组织 | kebab-case.ext | 10 |
| tests/ / test/ | 测试文件 | *test*, *spec* | *.test.ext, *.spec.ext | 20 |
| docs/ | 项目文档 | *.md, *.docx, *.pdf | kebab-case.md (en) / 中文或kebab-case.md (zh) / kebab-case.md (bilingual) | 30 |
| config/ / conf/ | 配置文件 | *.yaml, *.toml, *.json (非 package.json) | kebab-case.yaml | 15 |
```

**视频制作参考规则：**
```markdown
| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| footage/ | 原始素材 | *.mp4, *.mov, *.mxf | YYYY-MM-DD-description.ext | 10 |
| scripts/ | 脚本文档 | *.docx, *.md 含脚本相关 | kebab-case.md | 20 |
| editing/ | 剪辑工程 | *.prproj, *.drp, *.fcpxml | project-name.ext | 30 |
| exports/ | 成片输出 | *.mp4 命名含 export/output | project-name-final.ext | 40 |
| assets/ | 设计素材 | *.png, *.jpg, *.ai, *.psd | descriptive-name.ext | 15 |
```

**商业文档参考规则：**
```markdown
| 路径 | 用途 | 匹配条件 | 命名规范 | 优先级 |
|------|------|----------|----------|--------|
| contracts/ | 合同法务 | *.pdf 含合同/协议 | YYYY-MM-DD-counterparty-type.pdf (en) / YYYY-MM-DD-对方-类型.pdf (zh) | 10 |
| finance/ | 财务报表 | *.xlsx, *.csv 含报表/预算 | YYYY-MM-report-name.xlsx | 20 |
| teams/ | 团队子目录 | 按部门名归类 | kebab-case/ (en) / 部门名/ (zh) | 30 |
| meetings/ | 会议记录 | *.docx, *.md 含会议/纪要 | YYYY-MM-DD-notes.{md/docx} (en) / YYYY-MM-DD-会议纪要.{md/docx} (zh) | 15 |
```

Also add a **Language Naming Rules** subsection after the reference rules:

```markdown
**Language-specific naming rules:**

When `en`: all user file names use kebab-case or snake_case, English only.
When `zh`: all user file names can use Chinese characters, no restriction to ASCII.
When `bilingual`: English naming preferred; Chinese names acceptable for docs and content files.

These rules are applied during file reorganization (Mode A: deep rename, Mode B: new files only).
```

- [ ] **Step 3: Commit**

```bash
git add SKILL.md
git commit -m "feat: update Templates 6-7 with semantic triggers and language-aware naming"
```

---

### Task 6: Update File Reorganization Protocol — Language-Aware Naming

**Files:**
- Modify: `SKILL.md` File Reorganization Protocol section

- [ ] **Step 1: Add language-aware naming to Mode A (Deep Organize)**

In Mode A, step 2c (Identify naming issues), add a language check:

After the existing bullet:
```
   - Is the extension duplicated (e.g., .pdf.pdf)?
```

Add:
```
   - Does the filename follow the language-appropriate naming convention from STRUCTURE.md? (e.g., Chinese names when language is zh, English kebab-case when en)
```

In Mode A, step 3a (Fix naming), add:

After:
```
   a. Fix naming: rename files to match STRUCTURE.md conventions
```

Add:
```
   - Apply language-appropriate naming: if language is `zh`, allow Chinese filenames; if `en`, enforce English kebab-case; if `bilingual`, prefer English with Chinese acceptable for docs
```

- [ ] **Step 2: Add language-aware naming to Mode B (Incremental Organize)**

In Mode B, step 3c (place file), add:

After:
```
   c. If match: place file in target directory with correct naming
```

Add:
```
   - Apply language-appropriate naming from STRUCTURE.md conventions when placing new files
```

- [ ] **Step 3: Update Mode B token optimization rules**

Add to the end of the token optimization rules:

```
- **NEVER rename files to a different language in Mode B** — language-based renaming only happens in Mode A or via the Language Change Protocol
```

- [ ] **Step 4: Commit**

```bash
git add SKILL.md
git commit -m "feat: add language-aware naming to File Reorganization Protocol"
```

---

### Task 7: Add Language Change Protocol

**Files:**
- Create: New section after File Reorganization Protocol, before Upgrade Mode

- [ ] **Step 1: Add the Language Change Protocol section**

Insert the following between the File Reorganization Protocol's "Important Constraints" block and the `## Upgrade Mode` heading:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add SKILL.md
git commit -m "feat: add Language Change Protocol"
```

---

### Task 8: Update Session End Protocol + Upgrade Mode + Common Mistakes

**Files:**
- Modify: `SKILL.md` Session End Protocol (in Template 1)
- Modify: `SKILL.md` Upgrade Mode section
- Modify: `SKILL.md` Common Mistakes section

- [ ] **Step 1: Update Upgrade Mode — detect missing language**

In the Upgrade Mode rules, after rule 10 (existing .cursor/rules/), add:

```markdown
11. **For language setting in CLAUDE.md**: if CLAUDE.md exists but has no `## Language` section, add one with default value `bilingual`. If it exists, skip.
```

In the Upgrade Report template, add:

```markdown
  🌐 Language setting      — 已添加（默认 bilingual）/ 已存在，跳过
```

- [ ] **Step 2: Add i18n Common Mistakes**

Add these rows to the Common Mistakes table:

```markdown
| Hardcoding trigger words instead of matching intent | Triggers should match semantic intent in any language, not fixed phrases |
| Changing system file names (CLAUDE.md, PROJECT.md) when switching language | System management file names always stay English. Only user files can be renamed. |
| Writing end session summary in wrong language | Always check CLAUDE.md Language setting before generating output |
| Not updating STRUCTURE.md naming conventions when language changes | Language Change Protocol must update both content language AND naming rules |
| Forcing English filenames when language is zh | zh mode allows Chinese filenames for user files |
| Forcing Chinese filenames when language is en | en mode enforces English kebab-case for user files |
```

- [ ] **Step 3: Commit**

```bash
git add SKILL.md
git commit -m "feat: update Upgrade Mode and Common Mistakes for i18n"
```

---

### Task 9: Update README.md and README_zh.md

**Files:**
- Modify: `README.md`
- Modify: `README_zh.md`

- [ ] **Step 1: Add language support section to README.md**

In README.md, after the "## The 4 Components" section and before "## Trigger Words", add:

```markdown
## Language Support

project-init supports 3 language modes:

| Mode | Content Language | User File Naming |
|------|-----------------|------------------|
| `en` (English) | All content in English | English naming (kebab-case) |
| `zh` (中文) | All content in Chinese | Chinese naming allowed |
| `bilingual` (default) | Chinese with English annotations | English preferred, Chinese acceptable |

Set during `/project-init` setup, or change anytime by saying "change language" / "切换语言".

When switching language, you're asked whether to rename user files to match the new language's naming conventions. System files (CLAUDE.md, PROJECT.md, etc.) keep their English names regardless.
```

- [ ] **Step 2: Add language support section to README_zh.md**

In README_zh.md, add the corresponding Chinese section:

```markdown
## 语言支持

project-init 支持 3 种语言模式：

| 模式 | 内容语言 | 用户文件命名 |
|------|---------|-------------|
| `en` (英文) | 全部英文 | 英文命名（kebab-case） |
| `zh` (中文) | 全部中文 | 允许中文命名 |
| `bilingual` (默认) | 中文为主，英文标注 | 英文优先，中文可接受 |

在 `/project-init` 设置时选择，或随时说"切换语言" / "change language"更改。

切换语言时，会询问是否按新语言的命名规范重命名用户文件。系统文件（CLAUDE.md, PROJECT.md 等）始终保持英文名。
```

- [ ] **Step 3: Update Trigger Words section in both READMEs**

In README.md, update the Trigger Words table to reflect semantic matching:

```markdown
| You say (any expression of...) | What happens |
|---------|-------------|
| "we're done" / "end session" | Write log + update handoff + sync Wiki + organize files + output summary |
| "check the rules" / "review claude" | Show candidate rules for you to confirm one by one |
| "update overview" / "sync wiki" | Force rescan and update PROJECT.md |
| "where are we" / "status" | Read Wiki + handoff summary aloud |
| "clean up files" / "organize" | Scan and reorganize files per STRUCTURE.md rules |
| "switch language" / "切换语言" | Change content language for all management files |
```

Do the corresponding update in README_zh.md with Chinese examples.

- [ ] **Step 4: Update "The 4 Components" heading**

Change "The 4 Components" to reflect the new language feature. Add a brief mention.

- [ ] **Step 5: Commit**

```bash
git add README.md README_zh.md
git commit -m "docs: add language support documentation to READMEs"
```

---

### Task 10: Final Verification

- [ ] **Step 1: Read the complete updated SKILL.md and verify consistency**

Read the full file and check:
- [ ] Language Adaptation section exists with glossary covering all templates
- [ ] Step 0 includes Type D (language change trigger)
- [ ] Step 2 includes Q6 (language question)
- [ ] CLAUDE.md template has `## Language / 语言` section
- [ ] CLAUDE.md template uses semantic intent table (not fixed trigger words)
- [ ] All templates have language adaptation notes
- [ ] STRUCTURE.md template has 命名规范 column with language rules
- [ ] File Reorganization Protocol mentions language-aware naming
- [ ] Language Change Protocol section exists with complete flow
- [ ] Upgrade Mode detects missing language setting
- [ ] Common Mistakes includes i18n entries
- [ ] No references to hardcoded trigger phrases that conflict with semantic matching
- [ ] "输出中文总结" is replaced with language-aware summary instruction

- [ ] **Step 2: Fix any issues found**

- [ ] **Step 3: Final commit if fixes were needed**

```bash
git add SKILL.md
git commit -m "fix: consistency fixes after i18n language support update"
```
