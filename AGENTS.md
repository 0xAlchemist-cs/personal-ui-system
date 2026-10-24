# Personal UI System — 项目入口

本仓库是个人 AI 前端设计知识库。开始任何设计、开发或评审任务前，先阅读 [前端开发总控规范](prompts/frontend-development.md)，再按任务读取下列资产。

## 阅读顺序

1. [README](README.md)：当前阶段、可用资产和能力边界。
2. [设计原则](design-system/principles.md)：信息层级、密度、交互与无障碍要求。
3. [风格目录](design-system/styles/README.md)：选择一套风格，再读取对应说明和 JSON。
4. [Token 约定](design-system/tokens/README.md)：解释原始值、语义别名和覆盖顺序。
5. 按需读取 `patterns/`、`templates/`、`prompts/` 中与当前任务相关的文件，不一次性加载整个仓库。
6. 涉及组件体系时读取 [选型入口](components/README.md) 与 [工具接入记录](docs/guides/ui-tooling.md)，再按实际技术栈读取对应 Skill。
7. 查找计划、指南与历史记录时使用 [文档索引](docs/README.md)；用户要求执行阶段计划时，先读取 [计划总纲](docs/superpowers/MASTER-PLAN.md)，再按指定任务范围推进。

## 当前范围

- 设计知识库基础已建立，继续维护规范、参考来源、三套候选风格、Token、页面规格、UI Brief 和提示词。
- 阶段 02 已完成 T0～T5，[正式验收](tests/manual/showcase-v1/review.md) 记录 Gate 02 证据；`showcase/app/` 有独立的 React/Vite/Ant Design 成员管理示范页和 17 个 Story。运行依赖仅在该应用内；顶层 `components/` 和 `templates/` 中的说明仍不是已发布组件或页面实现，尚无自动视觉回归基线。
- `minimal-saas` 仅在其说明列出的固定组合与页面验收范围为 `validated`；其余两套风格为 `draft`，未自动 `approved`。不将单页验收推广为跨框架、跨浏览器或公共组件保证。
- 阶段 03 已完成 T1～T4，[收口报告](docs/records/2026-10-24-p03-t4-closeout.md) 核对 Gate 03 通过；一个独立消费者按固定快照完成安装/构建和页面验收，16 项来源资产自 T2 未改。继续固定快照，公共组件与风格成熟度未晋级，分发条件尚未触发。
- 阶段 04 已完成 [A1 持续静态校验](docs/records/2026-10-24-p04-a1-quality-checks.md)：独立质量工具执行完整 Brief Schema、YAML、Token 和 Markdown 目标检查，两项真实 CI job 通过；Showcase 沿用自身检查与锁文件。下一张为 P04-A2，尚无自动浏览器/视觉回归基线或 Gate 04 完成结论。
- 后续阶段见 [实施路线](docs/roadmap.md)。用户明确要求进入后续阶段时再落实相应能力。

## 任务决策

- 下游项目的明确约束优先于本库默认偏好；记录冲突、采用方案与原因。
- 先查目标项目已有组件。Ant Design 项目优先官方组件、官方 Skill 和 `ConfigProvider`；其他技术栈复用设计规则与变量，不迁移框架。
- API 和依赖版本以目标项目锁文件及对应官方文档为准。本库的资料核验日期不等于版本兼容保证。
- UI Brief 是本库的自定义约定，入口为 [格式说明](briefs/README.md)；它不是框架或第三方工具的标准。
- 不将项目绑定到本机绝对路径，不通过跨仓库源码引用或目录链接共享资产。复用采用可复制、可记录来源版本的快照；稳定组件的包分发留到后续阶段。
- 新风格、组件与模式先作为候选资产，按 [资产生命周期](docs/guides/asset-lifecycle.md) 经验证和审核后晋级。
- 已接入 Ant Design、shadcn/ui、Material UI、Chakra UI、Nuxt UI 的相关知识。只有项目已采用相应库，或用户明确选用它时才加载其 Skill；通用需求不能因全局 Skill 的宽泛触发描述而被强制使用某个库。
- 已安装 Skill 不等于已安装组件或已启用 MCP。只报告实际验证的能力；不为了满足 Skill 示例擅自初始化框架、迁移组件库或启用付费服务。

## 检查与汇报

本阶段检查 Markdown 链接、JSON/YAML 语法、Token 引用和 Brief 一致性。没有应用时，不宣称 TypeScript、Lint、Build、浏览器或视觉回归检查已经通过。

进入实现阶段后执行目标项目已有且适用的检查，并启动页面验证实际渲染、典型交互、响应式和主要状态。最终说明复用、新增、验证证据和剩余风险。

<!-- antd-cli setup start -->
## Ant Design CLI Skill

Use the shared Ant Design skill at `.agents/skills/antd/SKILL.md` before working on Ant Design code in this repository.

The skill teaches agents when and how to call `@ant-design/cli` commands such as `antd info`, `antd doc`, `antd demo`, `antd token`, `antd semantic`, and `antd changelog`.

<!-- antd-cli setup end -->
