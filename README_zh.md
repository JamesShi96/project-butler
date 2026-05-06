# project-butler

[English](README.md) | **[中文](README_zh.md)**

[![GitHub stars](https://img.shields.io/github/stars/JamesShi96/project-butler?style=social)](https://github.com/JamesShi96/project-butler/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/JamesShi96/project-butler?display_name=tag)](https://github.com/JamesShi96/project-butler/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![AI Coding Assistants](https://img.shields.io/badge/AI%20Coding%20Assistants-Claude%20Code%20%7C%20Cursor%20%7C%20Codex-6B46C1)](docs/compatibility.md)

> 给 AI 编程助手使用的持久项目记忆系统。

project-butler 为 Claude Code、Cursor、Codex 和类似 AI 编程助手提供一套共享的项目记忆栈：会话日志、接手指引、项目 Wiki、TODO、规则、文件结构和更新日志。

你正常工作。结束时说 `end session` / `收工`。下次说 `continue` / `接着上次`。

## 快速开始

作为 Claude Code skill 安装：

```bash
git clone https://github.com/JamesShi96/project-butler.git ~/.claude/skills/project-butler
```

打开任意项目，初始化项目记忆栈：

```text
/project-butler
```

一次工作结束时：

```text
end session
```

下次继续：

```text
continue
```

Cursor、Codex 和其他 AI 助手的使用方式见 [Tool Compatibility](docs/compatibility.md)。

## 为什么需要它

AI 编程助手在一个 session 里很强，但跨 session 很健忘。如果你遇到过这些情况，project-butler 就是为你准备的：

- **"我又要重新解释一遍项目架构。"** 新 session 缺少上下文。
- **"上周命名规范到底怎么定的？"** 决策散落在聊天记录里。
- **"README 和 TODO 总是跟不上实际进展。"** 项目状态和文件开始脱节。
- **"AI 又违反了我早就说过的规则。"** 规则只在脑子里，没有进入项目记忆。
- **"我同时用 Claude Code、Cursor、Codex。"** 不同工具需要同一个事实来源。

project-butler 把项目目录变成这个事实来源。

## 它会创建什么

运行一次 `/project-butler`，它会创建一套基于文件的项目记忆栈：

```text
project-root/
├── CLAUDE.md                   <- 项目规则 / 宪法
├── PROJECT.md                  <- 当前项目 Wiki
├── STRUCTURE.md                <- 文件组织规则
├── UPDATE_LOG.md               <- 里程碑级更新日志
├── session-handoff.md          <- 跨 session 接手指引
├── TODO.md                     <- 执行清单
├── log/                        <- 会话日志
└── .claude/
    ├── candidates.md           <- 待审核规则候选
    └── .file-snapshot.json     <- 文件组织快照
```

核心文件都是普通 Markdown，因此即使某个工具不能原生运行这个 skill，也可以读取这些文件作为共享上下文。

## 常用指令

所有触发都是自然语言。只有首次初始化需要 slash command。

| 你说 | 会发生什么 |
|---|---|
| `/project-butler` | 初始化或升级项目记忆栈。 |
| `end session` / `收工` | 写会话日志、更新接手指引、同步 Wiki、更新 TODO、整理新文件、记录重大变化。 |
| `continue` / `接着上次` | 恢复上一次 session，直接继续，不用重新解释上下文。 |
| `continue full context` / `全面回顾` | 从最近 session 和历史摘要中重建完整项目轨迹。 |
| `review claude` / `审查规则` | 审核候选项目规则，再决定是否写入宪法。 |
| `sync wiki` / `同步项目` | 强制刷新 `PROJECT.md`。 |
| `status` / `项目现状` | 读取当前 Wiki 和接手摘要。 |
| `organize files` / `整理文件` | 按 `STRUCTURE.md` 整理文件结构。 |
| `change language` / `切换语言` | 在英文、中文、双语模式之间切换。 |

会话恢复（`continue` / `continue full context`）通过 project-butler 内部路由执行，不需要安装单独的 `/continue` 命令。

## 工具支持

| 工具 | 状态 | 工作方式 |
|---|---|---|
| Claude Code | 原生 skill | 安装到 `~/.claude/skills/project-butler` 后运行 `/project-butler`。 |
| Cursor | 项目规则 | project-butler 可以生成 `.cursor/rules/project-system.mdc`，让 Cursor 读取同一套项目记忆文件。 |
| Codex | 共享记忆文件 | Codex 可以读取生成的 Markdown 文件（`PROJECT.md`、`TODO.md`、`session-handoff.md`、规则等）作为项目上下文。 |
| 其他 AI 助手 | 文件式接入 | 只要能读取项目文件，就能使用这套记忆栈作为共享上下文。 |

细节和边界见 [docs/compatibility.md](docs/compatibility.md)。

## 工作原理

### 记忆栈

project-butler 按稳定性组织项目记忆：

```text
稳定规则
┌─────────────────────────────────────┐
│  CLAUDE.md / project rules          │  <- 人工审核后的原则
│  ↑ AI 自动收集候选规则              │
└─────────────────────────────────────┘
            ↑ 从工作中沉淀
当前状态
┌─────────────────────────────────────┐
│  PROJECT.md                         │  <- 项目现在是什么
│  STRUCTURE.md                       │  <- 文件应该放哪里
│  UPDATE_LOG.md                      │  <- 里程碑级变化
└─────────────────────────────────────┘
            ↑ 从事实中总结
原始事实
┌──────────────────────┐ ┌───────────────────────┐
│  log/                │ │  TODO.md              │
│  发生了什么          │ │  接下来要做什么       │
└──────────────────────┘ └───────────────────────┘
            ↓
session-handoff.md       <- 下个 session 从哪里继续
```

下层喂养上层，上层约束下层。

- **会话日志**记录发生了什么。
- **接手指引**告诉下一个 AI 从哪里继续。
- **项目 Wiki**总结当前状态。
- **TODO**让执行计划可见。
- **规则 / 宪法**保存需要持续遵守的决策。
- **更新日志**记录里程碑级变化。
- **文件结构规则**防止文件逐渐失控。

### 语言支持

project-butler 支持三种语言模式：

| 模式 | 内容语言 | 用户文件命名 |
|---|---|---|
| `en` | 英文 | 英文命名（`kebab-case`） |
| `zh` | 中文 | 允许中文命名 |
| `bilingual` | 中文为主，英文标注 | 英文优先，中文可接受 |

初始化时选择语言，也可以之后说 `change language` / `切换语言`。

### 升级模式

如果项目里已经有部分管理文件，project-butler 只创建缺失文件，不覆盖已有内容。它也会检测旧版 `.claude/memory/` 结构并建议迁移。

## 示例

完整流程见 [docs/examples.md](docs/examples.md)：

1. 初始化项目，
2. 正常工作，
3. 结束 session，
4. 第二天恢复上下文，
5. 审核沉淀出的规则。

## 环境要求

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI，用于原生 skill 执行
- [jq](https://jqlang.github.io/jq/)，用于 `continue` / `continue full context` 会话恢复
- 可选：[Cursor](https://cursor.sh)，用于生成项目规则
- 可选：Codex 或其他能读取项目 Markdown 文件的 AI 编程助手

## 更新日志

### v1.2.0 (2026-05-05) - 更新日志自动追踪
- 收工时自动判断是否为重大更新。
- 新增 `UPDATE_LOG.md`，记录里程碑级变化。
- 对重大更新提供可选 GitHub Release 创建。
- 支持代码项目和非代码项目。

### v1.1.0 (2026-05-04) - SKILL.md 重构 + Continue 改名
- 将 SKILL.md 从 1175 行重构到 196 行，并按需加载 reference。
- 将 `/resume` 改为 `continue`，`/resume-full` 改为 `continue full context`。
- 所有触发改为自然语言。

### v1.0.0 (2026-05-01) - 会话恢复 + 日志压缩
- 新增会话恢复（`continue` / `continue full context`）。
- 原始日志超过阈值时自动压缩。
- 从 `project-init` 更名为 `project-butler`。

完整更新日志：[UPDATE_LOG.md](UPDATE_LOG.md) | 版本发布：[GitHub Releases](https://github.com/JamesShi96/project-butler/releases)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JamesShi96/project-butler&type=Date)](https://www.star-history.com/#JamesShi96/project-butler&Date)

## 许可证

[MIT](LICENSE)
