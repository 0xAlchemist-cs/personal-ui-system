# 组件体系选型

先沿用目标项目已采用的体系；新项目再根据任务、技术栈和维护需求选型。安装多个 Skill，不代表同一项目应混用多个组件库。

| 体系 | 技术栈与适用方向 | 本库接入 |
| --- | --- | --- |
| Ant Design | React；企业后台、复杂表单与数据管理 | [选型约定](ant-design/README.md)，CLI 生成的项目级 `antd` Skill |
| shadcn/ui | React；掌握组件源码、较多定制的页面与设计系统 | [官方 Skill](../.agents/skills/shadcn/SKILL.md)，通过官方 CLI 获取组件与文档 |
| Material UI | React；采用 MUI 的产品及其主题与样式集成 | [样式](../.agents/skills/material-ui-styling/SKILL.md)、[主题](../.agents/skills/material-ui-theming/SKILL.md)、[Next.js](../.agents/skills/material-ui-nextjs/SKILL.md)、[Tailwind](../.agents/skills/material-ui-tailwind/SKILL.md) |
| Chakra UI | React；语义 Token、Recipes 与组合布局 | [搭建](../.agents/skills/chakra-ui-builder/SKILL.md)、[迁移](../.agents/skills/chakra-ui-migrate/SKILL.md)、[重构](../.agents/skills/chakra-ui-refactor/SKILL.md) |
| Nuxt UI | Vue/Nuxt 与 Vue + Vite；组件、表单与应用布局 | [官方 Skill](../.agents/skills/nuxt-ui/SKILL.md) |

以上是本库结合官方能力做的选型判断，不是性能排名或跨版本兼容保证。实际范围以目标项目版本、所选 Skill 和官方文档为准。

## 使用顺序

1. 检查目标项目的框架、锁文件、已有组件与主题。
2. 已有体系优先复用，缺失能力先查该库，不为单个控件引入第二套主题与 Provider。
3. 只读取与实际体系和当前任务相关的 Skill。MUI 的 Next.js、Tailwind 专题仅在对应集成时使用。
4. Ant Design 先查 CLI；shadcn 先查项目配置和组件文档；其他库结合官方资料或已经启用的 MCP 核实 API。
5. 将本库语义 Token 映射到目标库主题机制，不把本库自定义 JSON 直接当作第三方原生配置。

本目录仍没有公共组件实现。Skill 是开发知识资产；官方组件与本库 `draft` 风格的页面组合仍需真实验收。

安装、来源、CLI 与可选 MCP 见 [UI 工具接入](../docs/guides/ui-tooling.md)。
