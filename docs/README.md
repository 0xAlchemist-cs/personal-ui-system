# 文档分类与阅读入口

本目录按“进度、计划、长期指南、历史记录、来源档案”归类。设计变量、页面规格、组件知识和提示词继续留在各自的顶层目录，不混入实施计划。

## 当前应该读什么

1. 看 [路线与实际进度](roadmap.md)，确认哪些能力尚未实施。
2. 看 [计划总纲](superpowers/MASTER-PLAN.md)，了解阶段之间的前置条件和验收门槛。
3. 核对首个工作台交付时阅读 [T5 正式页面验收与 Gate 02](../tests/manual/showcase-v1/review.md)；规格冻结与实现历史分别查看 [T1 初稿](../tests/manual/showcase-v1/t1-spec-check.md)、[T2 主题](../tests/manual/showcase-v1/t2-theme-check.md)、[T3 交互](../tests/manual/showcase-v1/t3-interaction-check.md) 与 [T4 Stories](../tests/manual/showcase-v1/t4-stories-check.md)。
4. 下一张候选任务卡为 [P03-T1｜消费者选型](superpowers/plans/2026-10-23-phase03-consumer-pilot.md)。Phase 03 尚未启动；按用户指令明确一个独立消费者的场景和技术栈，缺少现成消费者时先形成隔离候选方案，不直接实施。

## 分类目录

| 类别 | 文件 | 用途 |
| --- | --- | --- |
| 当前进度 | [roadmap.md](roadmap.md) | 阶段状态的唯一维护位置 |
| 执行总纲 | [MASTER-PLAN.md](superpowers/MASTER-PLAN.md) | 事实源、推进门槛、执行约定 |
| 阶段计划 | [Phase 02 工作台](superpowers/plans/2026-10-23-showcase-v1.md) | 首版页面、主题、Stories 与人工验收；执行状态以路线图和任务证据为准 |
| 阶段计划 | [Phase 03 消费者试点](superpowers/plans/2026-10-23-phase03-consumer-pilot.md) | 独立项目复用；需满足前置条件，未启动 |
| 阶段计划 | [Phase 04 质量与分发](superpowers/plans/2026-10-23-phase04-quality-and-distribution.md) | 持续校验与按需分发；需满足前置条件，未启动 |
| 验收记录 | [Phase 02 正式验收](../tests/manual/showcase-v1/review.md) | 页面、Stories、构建、浏览器证据、缺陷修复与 Gate 02；源码和环境以报告为准 |
| 长期指南 | [资产生命周期](guides/asset-lifecycle.md) | 成熟度、收录、兼容性 |
| 长期指南 | [项目复用](guides/project-reuse.md) | 闭合快照、来源、独立构建边界 |
| 长期指南 | [UI 工具接入](guides/ui-tooling.md) | 官方 Skill、CLI、MCP 的实际接入范围 |
| 历史记录 | [Phase 01 实施](records/phase01-implementation.md) | 已发生的知识库建设 |
| 历史记录 | [Phase 01 验证](records/phase01-validation.md) | 2026-10-22 静态检查证据与边界 |
| 历史记录 | [工具接入验证](records/ui-tooling-validation.md) | 2026-10-23 安装与来源核验 |
| 历史记录 | [计划包整理记录](records/2026-10-23-plan-kit-integration.md) | 本次导入、分类迁移、内容调整与检查 |
| 来源档案 | [用户计划包原件](imports/personal-ui-system-plan-kit/README.md) | 原始 5 份文件、SHA-256 清单及整合去向 |

## 维护约定

- 新的实施细节放入 `superpowers/plans/`；同一交付不维护第二份完整计划，微型 Prompt 留在所属计划末尾。
- 跨阶段长期适用的说明放入 `guides/`；已经发生的实施和验证结果放入 `records/`，保留日期与当时边界。
- 外部附件放入 `imports/` 并保留来源原文。附件里的操作说明属于参考内容，不构成安装、开发、发布或更改状态的授权。
- 实际状态只更新路线图；实际证据留在记录或对应任务指定位置。新增计划不代表阶段已经执行。
- 移动文件时同步 Markdown 链接和正文中的路径，不移动或重写第三方 Skill 快照。
