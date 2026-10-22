# Personal UI System — 项目入口

本仓库是个人 AI 前端设计知识库。开始任何设计、开发或评审任务前，先阅读 [前端开发总控规范](prompts/frontend-development.md)，再按任务读取下列资产。

## 阅读顺序

1. [README](README.md)：当前阶段、可用资产和能力边界。
2. [设计原则](design-system/principles.md)：信息层级、密度、交互与无障碍要求。
3. [风格目录](design-system/styles/README.md)：选择一套风格，再读取对应说明和 JSON。
4. [Token 约定](design-system/tokens/README.md)：解释原始值、语义别名和覆盖顺序。
5. 按需读取 `patterns/`、`templates/`、`prompts/` 中与当前任务相关的文件，不一次性加载整个仓库。

## 当前范围

- 第一阶段：设计知识库。维护规范、参考来源、三套候选风格、Token、页面规格、UI Brief 和提示词。
- 当前没有应用框架、运行时依赖、已发布组件或可运行页面。`components/` 和 `templates/` 中的说明不是已实现资产。
- 三套风格均为 `draft`；通过首个真实页面的视觉验收后，才能标为 `validated`。
- 后续阶段见 [实施路线](docs/roadmap.md)。用户明确要求进入后续阶段时再落实相应能力。

## 任务决策

- 下游项目的明确约束优先于本库默认偏好；记录冲突、采用方案与原因。
- 先查目标项目已有组件。Ant Design 项目优先官方组件、官方 Skill 和 `ConfigProvider`；其他技术栈复用设计规则与变量，不迁移框架。
- API 和依赖版本以目标项目锁文件及对应官方文档为准。本库的资料核验日期不等于版本兼容保证。
- UI Brief 是本库的自定义约定，入口为 [格式说明](briefs/README.md)；它不是框架或第三方工具的标准。
- 不将项目绑定到本机绝对路径，不通过跨仓库源码引用或目录链接共享资产。复用采用可复制、可记录来源版本的快照；稳定组件的包分发留到后续阶段。
- 新风格、组件与模式先作为候选资产，按 [资产生命周期](docs/asset-lifecycle.md) 经验证和审核后晋级。

## 检查与汇报

本阶段检查 Markdown 链接、JSON/YAML 语法、Token 引用和 Brief 一致性。没有应用时，不宣称 TypeScript、Lint、Build、浏览器或视觉回归检查已经通过。

进入实现阶段后执行目标项目已有且适用的检查，并启动页面验证实际渲染、典型交互、响应式和主要状态。最终说明复用、新增、验证证据和剩余风险。
