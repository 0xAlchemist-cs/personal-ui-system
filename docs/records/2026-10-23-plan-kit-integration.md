# 计划包导入与文档分类记录

日期：2026-10-23。用户要求解压完整计划包并整理仓库文件。本次范围为文档导入、审阅、分类与引用维护，没有执行计划中的开发任务。

## 来源与整合

- 来源为用户提供的 `personal-ui-system-plan-kit.zip`，共 5 份 Markdown；解压原件保存在 [来源档案](../imports/personal-ui-system-plan-kit/README.md)。
- 附件写作基线与本次开始时的仓库 HEAD 均为 `31e29456a610efd12e89a6957a26a90d967aa415`，初始工作区干净。
- 新增 [计划总纲](../superpowers/MASTER-PLAN.md) 与 [Phase 03](../superpowers/plans/2026-10-23-phase03-consumer-pilot.md)、[Phase 04](../superpowers/plans/2026-10-23-phase04-quality-and-distribution.md) 条件计划。
- 向既有 [Phase 02 计划](../superpowers/plans/2026-10-23-showcase-v1.md) 追加任务导航与微型 Prompt，保留原任务正文。现有引用仅因文档迁移更新。
- 增加 [文档分类索引](../README.md)，从根 README、项目入口与路线图链接到整理后的文档。

## 文件迁移

| 原路径 | 新位置 |
| --- | --- |
| `docs/asset-lifecycle.md` | [docs/guides/asset-lifecycle.md](../guides/asset-lifecycle.md) |
| `docs/project-reuse.md` | [docs/guides/project-reuse.md](../guides/project-reuse.md) |
| `docs/ui-tooling.md` | [docs/guides/ui-tooling.md](../guides/ui-tooling.md) |
| `docs/implementation-plan.md` | [docs/records/phase01-implementation.md](phase01-implementation.md) |
| `docs/validation-report.md` | [docs/records/phase01-validation.md](phase01-validation.md) |
| `docs/ui-tooling-validation.md` | [docs/records/ui-tooling-validation.md](ui-tooling-validation.md) |

设计系统、Brief、组件知识、模式、模板、个人 Skill、提示词、工作台与测试模板继续按原顶层职责归类。官方 Skill 快照、许可证和来源清单未改动。

## 审阅后调整

- 将附件的立即进入实施、每次只执行一张卡等绝对表述改为计划建议，执行范围以用户当前任务为准。本次不因导入附件启动 Phase 02/03/04。
- 总纲增加可点击的内部引用，指南和历史记录路径同步分类；原包原文保留不改。
- Gate 02 明确关键失败须修复，记录失败本身不能使阶段通过。
- Phase 04 明确视觉基线仅在决定启用视觉回归后才是交付要求；分发继续按需求触发。
- Phase 03 的消费者 manifest 是待实现契约，不等于已有校验器；与来源档案的 SHA-256 清单用途不同。
- 复用指南明确本库 `personal-ui` Skill 尚未全局注册，避免与已安装官方 Skill 混淆。

## 检查范围

| 项目 | 实际结果 |
| --- | --- |
| Markdown 本地引用 | 扫描 99 份 Markdown，292 处本地链接目标均存在且位于仓库内 |
| 数据语法 | 13 份 JSON、4 份 YAML 均可解析 |
| 原件来源 | 压缩包 SHA-256 与清单一致，5 份原件的字节数与 SHA-256 均匹配，并与 ZIP 内容逐字节相同 |
| 文件分类 | 6 处旧路径已迁移；活跃文档无旧路径残留，迁移记录和来源原件保留历史路径 |
| 既有 Phase 02 | 对照基线提交，原计划正文除必要路径迁移外保持不变；新增内容为末尾任务 Prompt |
| 独立复审 | 分类、来源区分、推进门槛与未实施边界通过只读复审；修正了可选视觉回归在 Prompt 中被写成必做的表述 |
| Git 差异 | 自有文档的暂存差异空白检查通过；5 份原件的 Git 暂存内容也与来源 SHA-256 一致；未改动第三方 Skill、设计数据、Brief、许可证或上游来源清单 |

来源原件保留上游格式，以字节和哈希核验，不为满足自有文档格式规则改写。未安装运行时依赖，根目录没有 `package.json`，`showcase/app/` 尚不存在。未执行 TypeScript、Lint、Build、Storybook 或浏览器验收，风格成熟度未调整。
