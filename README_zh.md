# project-butler

[English](README.md) | **[中文](README_zh.md)**

[![GitHub stars](https://img.shields.io/github/stars/JamesShi96/project-butler?style=social)](https://github.com/JamesShi96/project-butler/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/JamesShi96/project-butler?display_name=tag)](https://github.com/JamesShi96/project-butler/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![AI Coding Assistants](https://img.shields.io/badge/AI%20Coding%20Assistants-Claude%20Code%20%7C%20Cursor%20%7C%20Codex-6B46C1)](docs/compatibility.md)

> 让 AI 编程助手在不同 session 之间记住你的项目。

project-butler 让 Claude Code、Cursor、Codex 和类似 AI 编程助手更像长期项目成员，而不是每次重新开始。

日常使用只需要记住四个动作：

```text
/project-butler   设置项目记忆
end session       保存进度和下一步
continue          下次接着干
status            查看项目现状
```

## 快速开始

作为 Claude Code skill 安装：

```bash
git clone https://github.com/JamesShi96/project-butler.git ~/.claude/skills/project-butler
```

打开任意项目，设置项目记忆：

```text
/project-butler
```

正常工作。一次工作结束时：

```text
end session
```

下次不用重新解释项目，直接继续：

```text
continue
```

这已经足够日常使用。Cursor、Codex 和其他 AI 助手的使用方式见 [工具兼容性](docs/compatibility.md)。

## 为什么需要它

AI 编程助手在一个 session 里很强，但跨 session 很健忘。如果你遇到过这些情况，project-butler 就是为你准备的：

- **"我又要重新解释一遍项目架构。"** 新 session 缺少上下文。
- **"上周命名规范到底怎么定的？"** 决策散落在聊天记录里。
- **"README 和 TODO 总是跟不上实际进展。"** 项目状态和文件开始脱节。
- **"AI 又违反了我早就说过的规则。"** 规则只在脑子里，没有进入项目记忆。
- **"我同时用 Claude Code、Cursor、Codex。"** 不同工具需要同一个事实来源。

project-butler 把项目目录变成这个事实来源，让下一次 AI session 能从上次停止的地方继续。

## 主要指令

所有触发都是自然语言。只有首次初始化需要 slash command。

| 指令 | 什么时候用 |
|---|---|
| `/project-butler` | 设置或升级项目记忆。 |
| `end session` / `收工` | 保存进度、刷新下一步、记录重要变化。 |
| `continue` / `接着上次` | 恢复上一次 session，不用重新解释上下文。 |
| `status` / `项目现状` | 查看当前项目状态和下一步建议。 |

## 高级指令

| 指令 | 什么时候用 |
|---|---|
| `continue full context` / `全面回顾` | 长时间中断或切换助手后，重建完整项目轨迹。 |
| `review claude` / `审查规则` | 审核候选项目规则，再决定是否成为长期规则。 |
| `sync wiki` / `同步项目` | 强制刷新 `PROJECT.md`。 |
| `organize files` / `整理文件` | 按 `STRUCTURE.md` 清理新增文件。 |
| `change language` / `切换语言` | 在英文、中文、双语模式之间切换。 |

会话恢复（`continue` / `continue full context`）通过 project-butler 内部路由执行，不需要安装单独的 `/continue` 命令。

## 它会维护什么

运行一次 `/project-butler`，它会在项目里维护这些普通 Markdown 文件：

```text
project-root/
├── CLAUDE.md                   <- 项目规则 / 宪法
├── PROJECT.md                  <- 当前项目 Wiki
├── STRUCTURE.md                <- 文件组织规则
├── UPDATE_LOG.md               <- 里程碑级更新日志
├── DOCS.md                     <- 文档索引和元数据
├── session-handoff.md          <- 跨 session 接手指引
├── TODO.md                     <- 执行清单
├── docs/                       <- 已归档项目文档
├── log/                        <- 会话日志
└── .claude/
    ├── candidates.md           <- 待审核规则候选
    └── .file-snapshot.json     <- 文件组织快照
```

核心文件都是普通 Markdown，因此即使某个工具不能原生运行这个 skill，也可以读取这些文件作为共享上下文。

实际效果是：

- 让当前项目状态始终可读。
- 让跨 session 的下一步保持清楚。
- 让项目文档可索引、可查找。
- 记录里程碑变化，让项目历史清楚。
- 防止新增文件逐渐散落到随机目录。
- 只有经过用户审核的规则才会成为长期规则。

## 工具支持

| 工具 | 状态 | 工作方式 |
|---|---|---|
| Claude Code | 原生 skill | 安装到 `~/.claude/skills/project-butler` 后运行 `/project-butler`。 |
| Cursor | 项目规则 | project-butler 可以生成 `.cursor/rules/project-system.mdc`，让 Cursor 读取同一套项目记忆文件。 |
| Codex | 共享记忆文件 | Codex 可以读取生成的 Markdown 文件（`PROJECT.md`、`TODO.md`、`session-handoff.md`、`STRUCTURE.md`、`UPDATE_LOG.md`、`DOCS.md`、规则等）作为项目上下文。 |
| 其他 AI 助手 | 文件式接入 | 只要能读取项目文件，就能使用这套记忆栈作为共享上下文。 |

细节和边界见 [docs/compatibility.md](docs/compatibility.md)。

## 工作原理

### 内部机制：记忆栈

project-butler 内部使用 7 组件记忆栈，按稳定性组织项目记忆：

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
│  DOCS.md                            │  <- 文档索引
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
- **文档索引**把项目文档统一组织到 `docs/` 下。

### 语言支持

project-butler 支持三种语言模式：

| 模式 | 内容语言 | 用户文件命名 |
|---|---|---|
| `en` | 英文 | 英文命名（`kebab-case`） |
| `zh` | 中文 | 允许中文命名 |
| `bilingual` | 中文为主，英文标注 | 英文优先，中文可接受 |

初始化时选择语言，也可以之后说 `change language` / `切换语言`。

### 版本命名

初始化时，project-butler 会询问项目使用哪种版本命名方式：

| 方式 | 示例 | 适合 |
|---|---|---|
| Semantic | `v0.1.0` | 工程项目和库 |
| Codename | `Project Name 0.1` | 产品、品牌和创意项目 |
| Patch | `Patch 1` | 游戏和迭代内容发布 |
| Date | `2026.06.1` | 调研日志、运营项目和文档型工作 |

当 `end session` 判断本次工作值得写入 `UPDATE_LOG.md` 时，会按该方式计算下一个版本。

### 升级模式

如果项目里已经有部分管理文件，project-butler 只创建缺失文件，不替换已有文件；如果系统段落需要更新，会先询问，再做小范围定向 patch。它也会检测旧版 `.claude/memory/` 结构并建议迁移。

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

### v1.5.1 (2026-06-03) - 产品降噪
- README 围绕四个主动作重写：`/project-butler`、`end session`、`continue`、`status`。
- 将内部机制后置到“工作原理”，示例改成结果导向。
- 生成的 CLAUDE/Cursor 规则区分日常工作流和高级指令。

### v1.5.0 (2026-06-03) - 版本化更新日志系统
- 初始化时新增版本命名方式选择：Semantic、Codename、Patch、Date。
- 收工更新日志会按所选方式计算下一个版本。
- 同步 README、示例、兼容性文档、生成规则、continue 恢复、文档归档、升级模式和触发路由，使其匹配当前记忆栈。

### v1.4.1 (2026-06-02) - 交叉引用和流程一致性
- 修复 DOCS.md、文件快照、语言切换、continue 恢复和模板一致性问题。
- 对齐文档归档、文件整理和 Cursor 规则模板。

### v1.3.0 (2026-06-01) - 四阶段文件整理
- 将模板式文件整理替换为 Discover、Ask or Plan、Plan、Execute 四阶段流程。
- 增加置信度路由、安全移动计划和 never-delete 清理策略。

### v1.2.1 (2026-05-09) - Skill 加载兼容性
- 将 `continue` 相关恢复流程移动到 `references/`，不再使用嵌套 `SKILL.md` 文件。
- 缩短 skill metadata，满足 loader 长度限制。
- 保持会话恢复由 project-butler 主 skill 统一路由。

完整更新日志：[UPDATE_LOG.md](UPDATE_LOG.md) | 版本发布：[GitHub Releases](https://github.com/JamesShi96/project-butler/releases)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JamesShi96/project-butler&type=Date)](https://www.star-history.com/#JamesShi96/project-butler&Date)

## 许可证

[MIT](LICENSE)
