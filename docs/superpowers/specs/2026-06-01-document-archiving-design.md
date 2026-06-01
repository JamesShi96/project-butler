# Document Archiving — Design Spec

> Date: 2026-06-01
> Status: Draft
> Affects: `SKILL.md`, `references/file-templates.md`, `references/upgrade-mode.md`, `references/file-reorganization.md`

## Problem

project-butler treats all projects identically — same file templates, same end session flow. But different projects produce different types of documents (PRDs, tech designs, research reports, meeting notes). These documents are currently scattered in the project root or lost between sessions. There is no mechanism to detect, categorize, and index document output during end session.

## Design

### Overview

Add a document archiving layer to the memory stack: a `docs/` directory for document storage and a `DOCS.md` index file with metadata. Embedded into the end session flow as a new step.

```
Middle layer (current snapshot)
┌─────────────────────────────────────┐
│  PROJECT.md（项目 Wiki）             │
│  STRUCTURE.md（文件管理规则）         │
│  UPDATE_LOG.md（里程碑变化）          │
│  DOCS.md（文档索引 + 元数据）   ← NEW │
└─────────────────────────────────────┘
        ↑
Lower layer
┌────────────────────┐  ┌────────────────────┐
│  docs/（文档仓库）  │  │  log/（会话日志）   │
│  prd/               │  │  TODO.md           │
│  tech-design/       │  └────────────────────┘
│  design/            │
│  research/          │
│  meetings/          │
│  experiments/       │
└────────────────────┘
```

### Preset Document Types

Six preset types. Projects select a subset during initialization. Additional types can be added organically during end session.

| Type | Directory | Description |
|------|-----------|-------------|
| PRD | `docs/prd/` | Product requirements — features, user stories, priorities |
| Tech Design | `docs/tech-design/` | Architecture, API definitions, data models |
| Design Docs | `docs/design/` | UI/UX design, page flows, interaction specs |
| Research | `docs/research/` | Competitor analysis, market research, feasibility studies |
| Meeting Notes | `docs/meetings/` | Meeting records, decision tracking |
| Experiments | `docs/experiments/` | Experiments, test results, data records |

### Document Hierarchy (Main + Sub)

All document types support hierarchical splitting to prevent oversized files:

```
docs/prd/
  main.md              ← Overview PRD (summary + module index)
  auth-module.md       ← Authentication module PRD
  payment-module.md    ← Payment module PRD

docs/tech-design/
  main.md              ← Architecture overview
  auth-system.md       ← Auth system technical design
  payment-integration.md
```

Rules:
- Each type can have a `main.md` (overview) + sub-documents
- Splitting happens when a document grows too large or when the user requests it
- DOCS.md records the hierarchy: main lists its sub-documents

### DOCS.md Format

```markdown
# 文档索引

> 最后更新：{{DATE}}

## PRD
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|
| [docs/prd/main.md](docs/prd/main.md) | 产品需求总览 | 进行中 | 2026-06-01 | auth-module, payment |
| [docs/prd/auth-module.md](docs/prd/auth-module.md) | 认证模块 PRD | 进行中 | 2026-05-28 | - |

## 技术设计
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|
| [docs/tech-design/main.md](docs/tech-design/main.md) | 技术架构总览 | 草稿 | 2026-06-01 | - |

## 设计文档
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|

## 调研
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|

## 会议纪要
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|

## 实验记录
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|

## 整理历史
| 日期 | 操作 | 文档数 |
|------|------|--------|
| {{DATE}} | 初始化 | 0 |
```

**Status values:** 草稿 / 进行中 / 已完成 / 已废弃

**Language adaptation:** Headers adapt to language setting. When `en`: "Document Index", "PRD", "Tech Design", "Design", "Research", "Meeting Notes", "Experiments". Status values: Draft / In Progress / Done / Deprecated.

### Initialization Flow Changes

**Step 2 (Ask Questions) — new question 7:**

```
7. **文档类型** — 选择需要的文档管理类型（多选）
   预设选项：PRD / 技术设计 / 设计文档 / 调研 / 会议纪要 / 实验记录
   AI 根据项目描述推荐默认选项
```

**Recommendation logic** (based on project description from question 2):
- Description contains product/platform/App/SaaS → recommend PRD + Tech Design + Design
- Description contains operations/management/team → recommend PRD + Research + Meeting Notes
- Description contains research/explore/experiment → recommend Research + Experiments
- Description contains video/content/creative → recommend Design + Research

**Step 3 (Create Files) changes:**
- Create `docs/` directory + selected subdirectories (each with `.gitkeep`)
- Create `DOCS.md` with only selected document type sections
- Create `docs/{type}/main.md` placeholder for each selected type (title + overview placeholder)
- Add `docs/` to STRUCTURE.md exclusion rules (docs are managed by DOCS.md, not STRUCTURE.md)

**Step 4 (Output Report) changes:**
- Add line: `✅ docs/ + DOCS.md — 文档归档系统（已创建）`

### End Session Flow Changes

Insert new step 7.5 between current step 7 (file reorganization) and step 8 (update log):

**Step 7.5: Document archiving**

```
7.5. Scan and archive document output from this session
   a. Identify documents created/modified during this session
   b. Classify each document by type:
      - Filename keywords: prd, 需求, requirement → PRD
      - Filename keywords: tech, 架构, architecture, api → Tech Design
      - Filename keywords: design, ui, ux, 交互 → Design Docs
      - Filename keywords: research, 调研, 竞品, 分析 → Research
      - Filename keywords: meeting, 会议, 纪要 → Meeting Notes
      - No match → read first few paragraphs to classify
   c. For each document:
      - Existing file → update content + update DOCS.md metadata
      - New file → move to corresponding docs/ subdirectory + add DOCS.md entry
      - Document too large → suggest splitting into main + sub to user
   d. If document doesn't match any preset type → create new subdirectory + new DOCS.md section
   e. If DOCS.md doesn't exist → create it (upgrade mode compatibility)
```

**Document type identification priority:**
1. Explicit filename keywords (fast, no content reading)
2. File location (already in a docs/ subdirectory — infer type from directory name)
3. Content analysis (read first few paragraphs only for unclassifiable files)

### Upgrade Mode

When upgrading an existing project:
- If `DOCS.md` doesn't exist → create with default types (PRD + Tech Design + Research — most common combination)
- If `docs/` doesn't exist → create directory
- Existing documents in project root are NOT automatically moved — they'll be picked up during the next end session when modified

### STRUCTURE.md Interaction

- `docs/` is added to STRUCTURE.md exclusion list — documents are managed by DOCS.md, not by file reorganization
- File reorganization (Mode A and Mode B) skips the `docs/` directory entirely
- DOCS.md is the single source of truth for document organization

## Files Modified

| File | Change |
|------|--------|
| `SKILL.md` | Add step 7.5 to end session flow. Add question 7 to Step 2. Update Step 3 to create docs/ + DOCS.md. Update Step 4 report. Add DOCS.md to file scan list. Update Reference Loading table. |
| `references/file-templates.md` | Add Template 9: DOCS.md. Add document type placeholder templates. Update init file creation instructions. |
| `references/upgrade-mode.md` | Add DOCS.md to "create if missing" list. Add docs/ directory creation. |
| `references/file-reorganization.md` | Add docs/ to exclusion list. Note that documents are managed by DOCS.md. |

## Files Created

| File | Purpose |
|------|---------|
| `references/document-archiving.md` | Detailed archiving protocol (document type identification rules, DOCS.md update rules, splitting guidelines, common mistakes) |

## Not Modified

- `references/language-adaptation.md` — glossary will need a small update for document type names
- `references/log-compaction.md` — unrelated
- `references/update-log.md` — unrelated
- `references/continue.md` / `continue-full-context.md` — unrelated
- `references/language-change.md` — unrelated

## Open Questions

None. All decisions confirmed by user:
- Document types: 6 presets + extensible
- Trigger: embedded in end session (no new trigger word)
- Architecture: docs/ directory + DOCS.md with metadata
- Hierarchy: main + sub splitting for all types
- Initialization: new question in Step 2 with AI recommendations
