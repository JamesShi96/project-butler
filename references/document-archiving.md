# Document Archiving Protocol

> Loaded during: end session document archiving, initialization (for template creation).

## Document Types

Six preset types. Additional types can be created organically.

| Type | Directory | Filename Keywords |
|------|-----------|-------------------|
| PRD | `docs/prd/` | prd, 需求, requirement, product-req |
| Tech Design | `docs/tech-design/` | tech, 架构, architecture, api-design, system-design |
| Design Docs | `docs/design/` | design, ui, ux, 交互, wireframe, mockup |
| Research | `docs/research/` | research, 调研, 竞品, 分析, market, feasibility |
| Meeting Notes | `docs/meetings/` | meeting, 会议, 纪要, minutes, notes |
| Experiments | `docs/experiments/` | experiment, 实验, test-report, benchmark |

## End Session Archiving Flow

**Trigger:** Embedded in end session after file reorganization and before update-log evaluation.

**Prerequisites:**
- Read `DOCS.md` if it exists (for current document index)
- Read `STRUCTURE.md` exclusion rules if it exists

**Flow:**

```
1. Scan: Identify documents created/modified during this session
2. Classify: Determine document type for each
3. Archive: Move/index each document
4. Update: Refresh DOCS.md metadata
```

### Step 1: Scan

Identify files created or significantly modified during this session that appear to be documents (not code, config, or logs):

- Files with `.md` extension that contain structured content (headers, sections, lists)
- Files created/modified during the session (check tool use history)
- Files already in `docs/` subdirectories (always process these)
- Exclude: CLAUDE.md, PROJECT.md, STRUCTURE.md, UPDATE_LOG.md, TODO.md, session-handoff.md, DOCS.md, files in log/, files in .claude/

### Step 2: Classify

For each identified document, determine its type:

1. **Directory match** — if the file is already in a `docs/` subdirectory, use that directory's type
2. **Filename keywords** — match against the keyword table above
3. **Content analysis** — read first 3-5 paragraphs for unclassifiable files:
   - Mentions features, user stories, requirements → PRD
   - Mentions architecture, APIs, data models, system design → Tech Design
   - Mentions UI, UX, screens, interactions, wireframes → Design Docs
   - Mentions competitors, market, research, analysis → Research
   - Mentions meeting, attendees, decisions → Meeting Notes
   - Mentions experiment, results, hypothesis → Experiments
4. **No match** → create new type section in DOCS.md, ask user for directory name

### Step 3: Archive

For each classified document:

**If the document is NOT in its target directory:**
- Move to `docs/{type}/` using `git mv` (or `mv` if not a git repo)
- If target directory doesn't exist: create it with `.gitkeep`
- Update any cross-references (links in other files pointing to old path)

**If the document IS already in its target directory:**
- No move needed, just update metadata

**For all documents (moved or not):**
- If the document is large (>500 lines or clearly multi-topic): suggest splitting to user
- When splitting: create main.md (overview + index) + sub-documents, update DOCS.md hierarchy

**After all documents are archived:**
- Update `.claude/file-snapshot.json`: update paths for moved files, add new files in docs/
- Note: file reorganization Mode B may already have updated the snapshot earlier this session, so this step only needs to update entries for files that document archiving moved again

### Step 4: Update DOCS.md

**If DOCS.md doesn't exist** — create it (see Initialization section below).

**If DOCS.md exists:**

For each document processed:
1. Check if document already has an entry in DOCS.md
2. **Existing entry**: update "最后更新" date and "状态" if changed
3. **New entry**: add row to the appropriate type section
4. **New sub-document**: add row + update parent's "Sub 文档" column

**Entry format:**
```
| [docs/{type}/{filename}](docs/{type}/{filename}) | {title from first heading} | {状态} | {DATE} | {comma-separated sub doc names, or -} |
```

**Status values:** 草稿 / 进行中 / 已完成 / 已废弃

If the session creates a new document type not in the preset six:
- Create new `docs/{custom-type}/` directory
- Add new section to DOCS.md with the same table format
- Use the custom type name as both directory and section header

## DOCS.md Template (for end session fallback)

This fallback template is used only when DOCS.md must be created during end session for upgrade compatibility. During initialization, create the richer project-prefixed DOCS.md template with selected document-type sections and optional main.md placeholders.

Adapt headers to language setting. When `en`: "Document Index", section names in English.

```
# 文档索引

> 最后更新：{{DATE}}

{{For each selected type, add a section:}}
## {TYPE_NAME}
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|
| （暂无） | | | | |

## 整理历史
| 日期 | 操作 | 文档数 |
|------|------|--------|
| {{DATE}} | 初始化 | 0 |
```

## Document Type Selection (for initialization)

When initializing, present these options:

```
选择需要的文档管理类型（多选）：
☐ PRD — 产品需求文档
☐ 技术设计 — 架构方案、接口定义
☐ 设计文档 — UI/UX 设计、页面流程
☐ 调研 — 竞品分析、市场研究
☐ 会议纪要 — 会议记录、决策追踪
☐ 实验记录 — 实验、测试结果
```

**AI recommendation based on project description:**
- Mentions product/platform/App/SaaS → pre-select: PRD, 技术设计, 设计文档
- Mentions operations/management/team → pre-select: PRD, 调研, 会议纪要
- Mentions research/explore/experiment → pre-select: 调研, 实验记录
- Mentions video/content/creative → pre-select: 设计文档, 调研

## Common Mistakes

| Mistake | Correct Behavior |
|---------|-----------------|
| Archiving code files as documents | Only process .md files with structured document content, not source code |
| Moving documents without updating DOCS.md | Every move/create/update must be reflected in DOCS.md |
| Moving documents without fixing cross-references | Grep for old path in all project files and update links |
| Creating all 6 document directories regardless of selection | Only create directories for types the user selected |
| Overwriting existing documents | Never overwrite. If a name collision occurs, flag for manual resolution |
| Treating DOCS.md like a document content file | DOCS.md is an index only. Document content lives in docs/ subdirectories |
| Forgetting to exclude docs/ from STRUCTURE.md | docs/ must be in STRUCTURE.md exclusion list — documents are managed by DOCS.md |
| Reading entire document contents for classification | Only read first 3-5 paragraphs. Filename and directory should be sufficient for most cases |
| Auto-splitting documents without asking | Large documents: suggest splitting, but let user decide |
| Removing DOCS.md entries for deleted documents | If a document was deleted, mark entry as "已废弃" rather than removing the row |
| Not updating file-snapshot.json after moving documents | After archiving, update file-snapshot.json with new paths. Otherwise Mode B will see moved files as "new" next session |
