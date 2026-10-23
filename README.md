# Personal UI System

你的个人 AI 前端设计系统。一套设计能力，服务博客、管理后台和 Web App 等独立项目。

当前版本：**0.1.0 · 设计知识库与阶段 02 工作台**。已完成首版规格、主题通路和成员管理核心交互；完整状态 Stories 与正式页面验收尚未完成。

已补充五套组件体系的开发知识接入；按目标项目选用，见 [组件选型](components/README.md) 和 [工具接入记录](docs/guides/ui-tooling.md)。

公开仓库：[0xAlchemist-cs/personal-ui-system](https://github.com/0xAlchemist-cs/personal-ui-system) · 开源许可：[MIT](LICENSE)。

## 从这里开始

1. 阅读 [AGENTS.md](AGENTS.md) 和 [前端开发规范](prompts/frontend-development.md)。
2. 根据页面类型选择 [风格预设](design-system/styles/README.md)，读取对应的设计规则和 Token。
3. 复制 [UI Brief 示例](briefs/examples/user-management.yaml)，按 [Brief 约定](briefs/README.md) 描述真实需求。
4. 开发时结合目标项目现有组件，完成后使用 [设计评审](prompts/design-review.md) 和 [视觉验收](prompts/visual-qa.md) 提示词。

知识库本身无需根目录运行依赖。独立的 [showcase/app](showcase/app/README.md) 已提供成员管理示范页、基础主题预览与一个 Story，启动和检查命令见应用说明。顶层页面模板仍是设计规格，尚无公共组件包。

**下一张任务卡：P02-T4。** 按 [首个工作台实施计划](docs/superpowers/plans/2026-10-23-showcase-v1.md) 补齐实际部件的 Stories 与适用状态；核心交互的实现、检查与截图见 [T3 验证记录](tests/manual/showcase-v1/t3-interaction-check.md)。Gate 02 尚未通过。

完整规划见 [计划总纲](docs/superpowers/MASTER-PLAN.md)。所有计划、长期指南、历史验证记录与附件原件已按 [文档分类索引](docs/README.md) 归类，Phase 03/04 计划保留启动条件。

## 三套候选风格

| 预设 | 适合 | 默认外观 | 说明 |
| --- | --- | --- | --- |
| `minimal-saas` | 工作台、设置、轻量 SaaS | 浅色、蓝色强调、舒适密度 | [设计规则](design-system/styles/minimal-saas.md) |
| `developer-editorial` | 技术博客、个人主页、长文 | 深色、薄荷色强调、阅读优先 | [设计规则](design-system/styles/developer-editorial.md) |
| `enterprise-data` | 数据后台、复杂表单、运营管理 | 浅色、蓝色强调、紧凑密度 | [设计规则](design-system/styles/enterprise-data.md) |

它们都是待真实页面验证的起始偏好，不代表已经确认你的最终审美。不同风格复用同一套语义命名，组件代码不必因此分成三套。

## 资产导航

| 资产 | 入口 | 当前能力 |
| --- | --- | --- |
| 设计语言 | [原则](design-system/principles.md)、[参考](design-system/references.md)、[Tokens](design-system/tokens/README.md) | 颜色、排版、间距、布局与决策规则 |
| 组件知识 | [体系选型](components/README.md)、[Ant Design](components/ant-design/README.md)、[自定义组件](components/custom/README.md) | 五套体系的知识接入与收录边界，没有公共组件实现 |
| 交互模式 | [导航](patterns/navigation/README.md)、[表单](patterns/forms/README.md)、[数据展示](patterns/data-display/README.md) | 候选规则，供首个项目验证 |
| 页面规格 | [Dashboard](templates/dashboard/README.md)、[Blog](templates/blog/README.md)、[SaaS](templates/saas/README.md)、[Landing Page](templates/landing-page/README.md) | 信息结构与状态要求，没有页面源码 |
| AI Knowledge | [个人 Skill](skills/personal-ui/SKILL.md)、[Prompts](prompts/frontend-development.md)、[Brief](briefs/README.md)、[官方工具](docs/guides/ui-tooling.md) | 官方 Skill 全局安装及项目快照；个人 Skill 仍为仓库内入口，MCP 按需接入 |
| Quality Control | [人工验收模板](tests/visual-review-template.md)、[工作台](showcase/README.md)、[T3 实测](tests/manual/showcase-v1/t3-interaction-check.md) | Token/适配/成员查询单元测试与任务交互证据；尚无视觉回归基线 |

## 以后如何描述需求

> 我要做一个偏 Linear 的管理系统，使用 `minimal-saas` 预设，遵守 Personal UI System。先读取本项目的 AGENTS.md、随项目保存的设计资产和 UI Brief，沿用现有技术栈与组件，再说明选型和验收结果。

“偏 Linear”用于辅助沟通；实际决定来自 Brief 中的布局、密度、语义 Token 和状态规则。不要凭品牌名猜测完整设计。

## 独立项目复用

按 [复用策略](docs/guides/project-reuse.md) 将所需规范和 Token 保存为目标项目内的快照，并记录版本、来源与本地修改。快照内的引用必须闭合，项目应能独立检出、构建和部署。

不要把 `D:\personal-ui-systerm` 或其他本机路径写进项目依赖、构建脚本或导入语句。官方 Skill 副本及来源随仓库保存；Storybook、Playwright、组件包与 Registry 分发仍按 [路线图](docs/roadmap.md) 演进。

## 维护

- [资产生命周期](docs/guides/asset-lifecycle.md)：候选、验证、审核与兼容性。
- [变更记录](CHANGELOG.md)：按版本记录知识资产变化。
- [第一阶段实施记录](docs/records/phase01-implementation.md)：知识库基础交付范围和检查方式。
- [第一阶段验证记录](docs/records/phase01-validation.md)：2026-10-22 静态检查证据与未验证范围。
- [文档索引](docs/README.md)：计划、指南、历史记录与来源档案。

## 保存更新到 GitHub

本地仓库的 `origin` 指向上述公开仓库，主分支为 `main`。修改文件后需要提交并推送，云端才会保存本次更新：

```sh
git status
git add .
git commit -m "docs: update personal UI knowledge"
git push
```
