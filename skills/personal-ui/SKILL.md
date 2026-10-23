---
name: personal-ui
description: 使用 Personal UI System 的视觉预设、Token 和 UI Brief 进行前端设计选型、开发或评审；适用于明确采用该系统的项目，不处理无关的通用代码任务。
---

# Personal UI

本 Skill 是知识库内的阅读入口，没有安装全局工具、组件包或 MCP Server。它通过相对路径读取仓库资产；单独复制本文件不能构成完整安装。

先读取目标项目的 AGENTS.md、依赖和已有 UI 资产，再读取本库 [项目入口](../../AGENTS.md) 与 [前端规范](../../prompts/frontend-development.md)。项目明确约束优先，说明冲突与取舍。

按需选择：

- 需求和风格不明确：使用 [Brief 约定](../../briefs/README.md) 与 [风格目录](../../design-system/styles/README.md)，把任务、密度、布局和状态写清楚。只有影响结果且无法推断的信息才询问用户。
- 设计与实现：读取所选预设的说明与 JSON、[Token 约定](../../design-system/tokens/README.md) 和相关模式。成熟度与验证范围以 [风格目录](../../design-system/styles/README.md) 为准，不将单个页面的验证推广到其他主题或技术栈；顶层模板和组件目录仍以规格为主，工作台实现及验收见 [Showcase](../../showcase/README.md)。
- 组件体系：按 [选型入口](../../components/README.md) 读取目标项目已经使用或用户选定的官方 Skill，不因本机安装多个体系而混用它们。工具是否已安装、MCP 是否可用以 [接入记录](../../docs/guides/ui-tooling.md) 和实际环境为准。
- Ant Design 项目：参考 [组件选型约定](../../components/ant-design/README.md)，优先已有官方组件与官方 Skill。若官方 Skill 不可用，查对应版本官方文档并说明，不伪称已经调用。
- 评审或验收：使用 [设计评审](../../prompts/design-review.md) 或 [视觉验收](../../prompts/visual-qa.md)，只报告实际观察与已执行检查。

其他技术栈复用变量、结构和规则，不为了本库改换框架。新增资产按 [生命周期](../../docs/guides/asset-lifecycle.md) 验证与审核；独立项目按 [复用策略](../../docs/guides/project-reuse.md) 保存闭合快照，不依赖本机目录。

最终说明所用预设与成熟度、复用与新增资产、适用检查结果和未验证项。用户已授权的工作连续完成；不要额外发明审批步骤。
