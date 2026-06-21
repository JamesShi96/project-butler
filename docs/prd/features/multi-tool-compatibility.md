# Multi-Tool Compatibility — Roadmap

Status: Phase 1 implemented; Phase 2-3 planned
Last updated: 2026-06-21

## Background

project-butler 当前在三个工具上的支持度不一致：

| Feature | Claude Code | Cursor | Codex |
|---|---|---|---|
| **Profile System** (v1.6.0) | ✅ Native（SKILL.md 路由 + Profile JSON + Full Close） | 🟡 部分（setup 时生成 `.cursor/rules/project-system.mdc` 镜像触发词；Profile JSON 是文件 Cursor 能读） | 🟡 文件读（能读 Profile JSON 但不会主动触发 Profile System 操作） |
| **File Reorganization** (v1.3.0) | ✅ Native（"整理文件" 触发四阶段流程） | 🟡 部分（.cursor/rules 镜像触发词） | 🟡 文件读（无主动触发） |
| **Version Update Check** (v1.7.0) | ✅ Native（SKILL.md Step -1 + `<EXTREMELY_IMPORTANT>`） | ❌ 不支持（spec 明确 out of scope） | ❌ 不支持 |

**Goal**：让三个 feature 在三个工具上都有合理的支持级别，**诚实承认 Cursor/Codex 没有 CC 的 skill lifecycle**。

Compatibility target:

- Claude Code remains the only fully native automation path.
- Cursor and Codex can share project memory files and may get best-effort adapters, but they must not be described as having Claude Code parity.
- Version Update Check becomes manually runnable outside Claude Code in Phase 1. Automatic per-invocation checking remains Claude Code-only unless a future Cursor extension or Codex-native lifecycle mechanism exists.

## Architecture Principle

**共享项目记忆 + runtime core + 三 adapter**。

```
User project root
┌─────────────────────────────────────────────────────┐
│  Project Memory Core (shared by all tools)          │
│  ├── PROJECT.md / session-handoff.md / TODO.md      │
│  ├── STRUCTURE.md / DOCS.md / UPDATE_LOG.md         │
│  ├── .claude/project-profile.json                   │
│  ├── .claude/profile-pending.json                   │
│  └── log/                                           │
└─────────────────────────────────────────────────────┘

project-butler install / skill repo
┌─────────────────────────────────────────────────────┐
│  Runtime Core                                       │
│  └── scripts/check-update.sh  (Phase 1 新增)        │
└─────────────────────────────────────────────────────┘

Adapters
┌──────────────────┬────────────────────────┬──────────────────┐
│ Claude Code      │ Cursor                 │ Codex            │
│ SKILL.md         │ .cursor/rules/         │ AGENTS.md        │
│ CLAUDE.md        │ project-system.mdc     │                  │
└──────────────────┴────────────────────────┴──────────────────┘
```

- **Project Memory Core**：项目根目录里的长期记忆文件。三个工具都读写这一套。
- **Runtime Core**：project-butler 安装目录里的工具无关脚本。不是用户项目文件。
- **Adapter layer**：每个工具一个 entry 文件，引用 core，尽量不复制 executable logic。

## Why Phased

不一次性做完整三阶段：
- **Phase 1** 先达到最小三端可用：Claude Code native，Cursor rules，Codex AGENTS.md，update-check 手动入口
- **Phase 2** 打磨 setup / upgrade 体验，让新旧项目都能选择性启用适配器
- **Phase 3** 做验证和漂移控制

每个 phase 独立可 ship，独立有 value。

---

## Phase 1: Minimum Multi-Tool Usability

**Estimation**: ~5-6 hours including regression validation (script extraction ~1h, Codex AGENTS.md full mirror ~2h, Cursor rule audit + gap fill ~1h, coverage matrix + docs ~1h, test plan verification ~1h)
**Trigger**: 现在就可以做（不依赖外部反馈）

### What

让 Claude Code / Cursor / Codex 都有清晰入口，并把 update-check 的 bash 逻辑从 `references/update-check.md` 提取到独立 `scripts/check-update.sh`。

Deliverables:

1. `scripts/check-update.sh` becomes the detection logic source of truth.
2. Claude Code keeps automatic Step -1 update checking through `references/update-check.md`.
3. Cursor `project-system.mdc` gets a manual/on-demand update-check trigger and any missing core workflow coverage.
4. Codex gets an `AGENTS.md` template with the same core workflow coverage, and setup can create it when Codex support is enabled.
5. Upgrade mode preserves existing `AGENTS.md` files and offers append/patch updates instead of overwriting.
6. A lightweight adapter coverage matrix records what each adapter supports.

Cursor/Codex update checking remains **manual/on-demand best-effort**, not automatic per invocation.

### Why

1. **实现最小三端入口**：Claude Code 用 skill，Cursor 用 rules，Codex 用 `AGENTS.md`。这比只抽脚本更贴近“多工具都能使用”的目标。
2. **消除 runtime 内联**：当前 detection logic 嵌在 `references/update-check.md`。提取到 script 后，bug fix（如 `GIT_SSH_COMMAND` ConnectTimeout）只改 executable source of truth；PRD/spec 只描述行为。
3. **工具无关 executable core**：script 可被任何 adapter 调用，也可直接从 shell 跑。
4. **防止 adapter 一开始就漂移**：轻量 coverage matrix 在新增 `AGENTS.md` 同时建立，不等 Phase 3。

### File Changes

| Operation | Path | Notes |
|---|---|---|
| New | `scripts/check-update.sh` | Tool-agnostic bash。≤80 行。 |
| Modify | `references/update-check.md` | 移除 inline ~50 行 bash；改为 `bash "$SKILL_DIR/scripts/check-update.sh" "$SKILL_DIR"` 调用。保留 Steps / Rules / Edge Cases。 |
| Modify | `docs/prd/features/version-freshness-check.md` | How It Works：说明 script is detection source of truth，reference remains CC adapter source of truth。 |
| Unchanged | `SKILL.md` Step -1 | 仍通过 `references/update-check.md` 触发。 |
| Modify | `references/file-templates.md` | Audit and update Cursor rule template; add Codex `AGENTS.md` template with session start / continue / status / end session / Profile System / file organization / manual update-check coverage. |
| Modify | `SKILL.md` Init Flow | Add Codex support question and create AGENTS.md when enabled. |
| Modify | `references/upgrade-mode.md` | Preserve existing AGENTS.md and offer project-butler append/patch updates after confirmation. |
| New | `docs/test-reports/adapter-coverage-matrix.md` | Lightweight matrix: adapters × core workflows. Documentation only, not CI. |
| Modify | `README.md` / `README_zh.md` | Updating section 增加可手动运行 script 的说明；明确 Cursor/Codex 仍非自动。 |
| Modify | `docs/compatibility.md` | 说明 Claude Code native、Cursor rules best-effort、Codex AGENTS.md best-effort。 |
| Modify | `UPDATE_LOG.md` | 记录 update-check runtime 从 inline bash 改为 script source of truth。 |
| Unchanged | `.gitignore` | Cache path 不变，仍忽略 `.claude/.version-check.txt`。 |

### Key Decisions

1. **Script 解析 SKILL_DIR 优先级**：
   - `$1`（位置参数）
   - `PROJECT_BUTLER_SKILL_DIR` env var
   - script 自身路径：`BASH_SOURCE[0]` → parent repo root（推荐主路径）
   - `git rev-parse --show-toplevel`（fallback；仅当从 skill repo 内调用时可靠）
   - 默认 `$HOME/.claude/skills/project-butler`

   Rationale: users may run the script from a normal project repo. In that case, `git rev-parse --show-toplevel` would resolve the user project, not the project-butler skill repo. The script's own path is the safest fallback because the script lives inside the skill repo.

2. **Script 不含任何 CC-specific 逻辑**。不提 SKILL.md / Step -1 / Base directory line / `<EXTREMELY_IMPORTANT>`——那是 adapter 的事。

3. **CC adapter 仍是 LLM-side 行为的 source of truth**——single Bash call、never paraphrase banner、never auto-pull、debug external-shell only。Script 只做 detection and banner stdout。

4. **Cursor/Codex adapter 是 best-effort**。它们提供触发词和规则，但不承诺自动执行。特别是 update-check 只能是 manual/on-demand。

5. **Codex `AGENTS.md` template 默认完整镜像 core workflow**。不要只写 update-check 章节，否则 Codex adapter 会变成半截入口。

6. **无 template engine**。Script 是手写 bash，reference/templates 是手写 markdown，靠 coverage matrix 防漂移。

### Test Plan

1. Script standalone：从外部 shell 跑，行为跟当前 inline snippet 一致。
2. CC adapter still works：真 CC session 触发 `/project-butler`，验证 Step -1 仍跑 check（现在通过 script）。
3. SKILL_DIR 解析：测试 `$1`、env var、script 自身路径、`git rev-parse` fallback、默认路径。
4. Path safety：测试 skill path 含空格、从普通项目 git repo 内调用、非 git/plugin path、缺少 origin/main。
5. Invocation style：测试 `bash scripts/check-update.sh` 和 `./scripts/check-update.sh`（若 executable bit 已设置）。
6. Cursor template coverage：确认 `.cursor/rules/project-system.mdc` 包含 session start / continue / status / end session / Profile System / file organization / manual update-check。
7. Codex template coverage：确认 `AGENTS.md` template 包含同一组 core workflows，并明确 best-effort/manual-on-demand 边界。
8. Coverage matrix：确认 Claude Code / Cursor / Codex 三列都列出 core workflow 支持级别。
9. No regression：v1.7.0 的已验证行为仍通过：
   - first install creates cache,
   - cache hit avoids fetch,
   - pull recovery clears banner after SHA mismatch,
   - SSH fail-fast remains bounded,
   - `VERSION_NOTICE` three-line block remains byte-for-byte compatible.

---

## Phase 2: Follow-Up Polish

**Estimation**: ~2-3 hours
**Trigger**: Phase 1 shipped 后；根据真实使用反馈继续打磨三端体验

### What

1. Improve setup wording if users are confused by best-effort Cursor/Codex support.
2. Add more examples for switching between Claude Code, Cursor, and Codex in one project.
3. Tighten adapter wording based on real Cursor/Codex behavior.

### Why

- Phase 1 让三端最小可用；Phase 2 只做使用反馈驱动的体验打磨。
- Existing user files must continue to be preserved. `AGENTS.md` and Cursor rules should be offered as append/patch, not overwritten.
- Documentation should tell users which tool gives native automation and which tools are best-effort.

### File Changes

| Operation | Path | Notes |
|---|---|---|
| Modify | `README.md` / `README_zh.md` | Add more usage examples if needed. |
| Modify | `docs/compatibility.md` | Tighten support-level wording if needed. |
| Modify | adapter templates | Patch confusing wording discovered through real usage. |

### Key Decisions

1. **Setup 默认 Codex support = no**。避免污染所有项目的 AGENTS.md。用户 opt-in。
2. **Cursor 选项扩展现有 `project-system.mdc`**，不新建文件——减少 adapter 文件数。

Note: "AGENTS.md 是 best-effort" already covered in Phase 1 Key Decision #4.

### Test Plan

1. Cursor/Codex live session：观察 agent 实际是否遵循 adapter（informational，不是 pass/fail——best-effort 性质）。
2. Confirm any wording changes preserve the best-effort/manual-on-demand boundary.

---

## Phase 3: Validation + Drift Control

**Estimation**: ~2-3 hours
**Trigger**: Phase 2 之后，三套 adapter 出现明显漂移，或正式 release v2.0 时

### What

1. Review CLAUDE.md / Cursor rule / AGENTS.md against the coverage matrix.
2. Add a fuller release-time test report if drift risk becomes real.
3. Decide whether a generator/template engine is worth it only after repeated drift appears.

### Why

Phase 1 already creates the minimum matrix. Phase 3 is the heavier validation pass for release hygiene, not the first time drift is considered.

### Key Decisions

1. **不引入 template engine**。对齐靠人工 review + 测试矩阵 enforcement。如果漂移严重到人工 review 扛不住，再考虑 generator。
2. **测试矩阵是 documentation，不是 CI**。每个 phase ship 后手动跑一遍，记录到 `docs/test-reports/`。CI 化推到 v2.0 之后。

### File Changes

| Operation | Path | Notes |
|---|---|---|
| Modify | `docs/test-reports/adapter-coverage-matrix.md` | Expand lightweight matrix if needed. |
| Modify | CLAUDE.md template / Cursor rule template / AGENTS.md template | 按矩阵对齐不一致项。 |
| Modify | `docs/compatibility.md` | Tighten support-level wording if user feedback shows ambiguity. |

### Test Plan

1. **Matrix 完整性**：所有共同规则在三个 adapter 都有对应行。
2. **行为一致性**：同一触发词在三个工具上产生相同的核心文件操作（虽然 LLM-side 表达可能不同）。
3. **漂移检测**：手动对照三套 adapter，记录任何不一致。

---

## Total Estimation

| Phase | 工作量 | Trigger |
|---|---|---|
| Phase 1 | ~5-6h | 现在可做 |
| Phase 2 | ~2-3h | Phase 1 后 |
| Phase 3 | ~2-3h | Phase 2 之后漂移明显 / v2.0 release |
| **Total** | **~9-12h** | |

## What We're Not Doing

- **不假装 Cursor/Codex 有 CC 的 skill lifecycle**。Cursor rule 和 AGENTS.md 是被动 context，LLM 不一定执行。
- **不引入 template engine**。三套 adapter 手维护，靠测试矩阵防漂移。
- **不做 Codex plugin / Cursor extension**。Codex 没有 plugin 系统，Cursor extension 是另一个产品方向。
- **不主动测 Codex/Cursor 实际 LLM 执行率**。没有 telemetry（by design）。靠用户反馈。
- **不强制所有用户启 Codex/Cursor 支持**。Setup 时 opt-in，默认 no。

## Open Questions

1. **Script 命名**：`scripts/check-update.sh`（短，友好）vs `scripts/project-butler-update-check.sh`（长，可搜索）？倾向短的。
2. **Script executable bit**：`chmod +x` 让 `./scripts/check-update.sh` 直接跑 vs 必须 `bash scripts/check-update.sh`？倾向加 executable bit，但文档仍推荐 `bash scripts/check-update.sh` 以降低 shell/path 差异。
