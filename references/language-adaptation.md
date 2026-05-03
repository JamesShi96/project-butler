# Language Adaptation

> Loaded during: initialization, language change.

## Language Modes

| Mode | Code | Description |
|------|------|-------------|
| English | `en` | All content in English |
| 中文 | `zh` | All content in Chinese |
| 中英双语 | `bilingual` | Chinese with English annotations |

Language is stored in CLAUDE.md: `## Language / 语言` → `- **Language:** en | zh | bilingual`

## Adaptation Rules

When creating or updating files, adapt based on the configured language:

1. **Headers & section names**: Use corresponding terms from the glossary below
2. **Descriptions & instructions**: Write in the configured language
3. **Trigger intent descriptions**: Describe in the configured language, but match any language
4. **Session log headers**: Use configured language
5. **End session summary**: Output in the configured language
6. **Bilingual mode**: Chinese primary with English in parentheses for headers, e.g. `## 项目概况 (Project Overview)`

## Key Terms Glossary

### CLAUDE.md

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

### PROJECT.md

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

### session-handoff.md

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

### TODO.md

| Context | 中文 | English |
|---------|------|---------|
| Meta line | 每条任务必须包含 | Each task must include |
| Meta line | 负责人 | Owner |
| Meta line | 截止时间 | Deadline |
| Meta line | 依赖项 | Dependencies |
| Meta line | 完成的任务勾选保留（不删除），作为执行历史 | Checked tasks are kept as execution history |

### candidates.md

| Context | 中文 | English |
|---------|------|---------|
| Title | CLAUDE.md 候选条目 | CLAUDE.md Candidate Entries |
| Meta line | 以下条目由 AI 自动收集，等待人工 review | Entries auto-collected by AI, awaiting human review |
| Meta line | 触发 review | Trigger review |
| Section | 待确认（待 review） | Pending Review |
| Section | 已驳回 | Rejected |
| Section | 已采纳（已写入 CLAUDE.md） | Adopted (Written to CLAUDE.md) |

### STRUCTURE.md

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

### Session Log

| Context | 中文 | English |
|---------|------|---------|
| Section | 本次目标 | Session Goal |
| Section | 关键操作（按时间顺序） | Key Actions (Chronological) |
| Section | 决策与理由 | Decisions & Rationale |
| Section | 产出文件 | Output Files |
| Section | 未完事项 / 下次接手点 | Unfinished Items / Next Session Pickup |
| Section | 候选 CLAUDE.md 条目（如有） | CLAUDE.md Candidates (if any) |

## Common Mistakes

| Mistake | Correct Behavior |
|---------|-----------------|
| Writing end session summary in wrong language | Always check CLAUDE.md Language setting before generating output |
| Not updating STRUCTURE.md naming conventions when language changes | Language Change Protocol must update both content language AND naming rules |
| Forcing English filenames when language is zh | zh mode allows Chinese filenames for user files |
| Forcing Chinese filenames when language is en | en mode enforces English kebab-case for user files |
| Hardcoding trigger words instead of matching intent | Triggers should match semantic intent in any language, not fixed phrases |
