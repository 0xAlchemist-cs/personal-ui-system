# 质量与验收

本目录提供 [人工验收记录模板](visual-review-template.md)、[首版规格与验收初稿](manual/showcase-v1/review.md)、[T2 主题通路证据](manual/showcase-v1/t2-theme-check.md)、[T3 交互证据](manual/showcase-v1/t3-interaction-check.md) 及 [T4 Stories/状态证据](manual/showcase-v1/t4-stories-check.md)。当前工作台有 Token/适配/成员查询单元测试和真实预览检查；T5 正式页面验收及视觉回归基线尚未完成。

第一阶段检查文档链接、JSON/YAML 结构、Token 引用和预设与 Brief 的一致性；这不等于应用测试或视觉验收。

阶段 02 开始实际预览与人工检查；阶段 04 再按项目需要引入组件行为测试和 Playwright 视觉回归。测试覆盖有意义的行为与风险，不为可逆文案修改或与实现逐字对应的内容编写测试。

视觉基线需记录 OS、浏览器版本、字体、视口、缩放、数据、语言、时区和动态效果策略。基线变化需要人工判断；未执行、不适用和通过必须分开记录。采用 [验收提示词](../prompts/visual-qa.md) 时也遵循这一规则。
