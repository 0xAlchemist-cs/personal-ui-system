# UI Brief 1.0

这是 Personal UI System 自定义的 UI 需求约定，不是现有框架、Storybook 或组件库的标准。YAML 面向人和 AI 阅读；[JSON Schema](ui-brief.schema.json) 约束 YAML 解析后的 JSON 数据。已提供 [仓库内质量命令](../tools/quality/README.md) 解析 YAML 并使用完整 Draft 2020-12 引擎校验；没有页面代码生成器或通用安装器。

## 使用

复制 [管理页示例](examples/user-management.yaml) 或 [博客示例](examples/blog.yaml)，替换真实目标、技术栈、数据和行为。示例中的组件名是界面职责名，不代表仓库已经存在同名组件；实现前先检查目标项目再映射到实际组件。

不确定控件或布局的名称时，可先查 [术语与需求表达参考](../design-system/references.md#ai-术语与需求表达)，再在 `interaction`、`states` 和 `acceptance` 中写清实际行为与验收条件。

| 字段 | 内容 |
| --- | --- |
| `schema_version` | 固定为字符串 `"1.0"`，避免 YAML 把版本解析为数字 |
| `page / purpose` | 页面标识、用户和核心任务 |
| `stack` | 目标项目现有框架、语言、UI 体系；不因示例使用 Next.js 而迁移项目 |
| `design` | 三套预设之一，与预设固定的 theme / density / accent / radius 一致 |
| `layout` | 信息结构、导航和内容响应方式；不等于已经存在布局组件 |
| `components` | 需要查找与映射的界面职责，不是安装列表 |
| `data` | 来源、字段、分页方式、持久化边界；演示数据不能冒充真实服务 |
| `interaction` | 每个交互的唯一 ID 和具体行为，包括筛选、页码、排序、保存和取消 |
| `states` | loading / empty / error / success / disabled 五类检查入口 |
| `state_details` | 五类状态的实际表现；无实际适用行为时明确理由，不虚构加载或提交 |
| `constraints` | 复用、依赖、Token、无障碍等约束 |
| `acceptance` | 可实际检查的交付条件，代码检查仅在目标项目适用时执行 |

## 语法与一致性

Schema 禁止未知顶层字段和未知预设；使用 snake_case 字段名，版本值显式加引号。`interaction` 采用对象而非仅列关键词，让筛选重置页码、模拟保存等行为可检验。

Schema 只约束结构和预设组合。人工仍需确认组件名能否映射、数据字段是否真实、交互 ID 是否唯一、状态描述是否适用、验收条件是否可执行。

当前固定组合：`minimal-saas = light / comfortable / blue / medium`；`developer-editorial = dark / comfortable / mint / medium`；`enterprise-data = light / compact / blue / small`。希望改变组合时先提交候选变体，不静默忽略字段。

使用支持 JSON Schema Draft 2020-12 的工具时，可按 `ui-brief.schema.json` 校验 YAML 解析结果；结构通过不能证明页面好看或业务逻辑正确。
