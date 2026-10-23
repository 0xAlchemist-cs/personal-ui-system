# 质量与验收

本目录提供 [人工验收记录模板](visual-review-template.md) 与 [T5 正式页面验收](manual/showcase-v1/review.md)。当前报告记录真实页面与 17 个 Story 的响应式、键盘、状态、200% 缩放、对比度、语义及适用工程检查；它是 Gate 02 的验收入口，截图属于本次人工验收证据，尚无视觉回归基线。

历史证据保持原有任务边界：[T1 规格与验收初稿](manual/showcase-v1/t1-spec-check.md)、[T2 主题通路](manual/showcase-v1/t2-theme-check.md)、[T3 核心交互](manual/showcase-v1/t3-interaction-check.md)、[T4 Stories/状态](manual/showcase-v1/t4-stories-check.md)。不要用旧报告的“待 T5 验证”判断当前进度，实际阶段状态查看 [路线图](../docs/roadmap.md)。

独立消费者的证据位于 `manual/consumer-pilot/`：[T1 选型](../docs/records/2026-10-23-p03-t1-consumer-selection.md) 和 [T2 快照报告](../docs/records/2026-10-24-p03-t2-snapshot.md) 关联来源、manifest、静态检查、破坏样本及可恢复 Git 归档。这些证据不代表 T3 的干净检出、依赖安装、应用构建或浏览器验收已执行。

第一阶段检查文档链接、JSON/YAML 结构、Token 引用和预设与 Brief 的一致性；这不等于应用测试或视觉验收。

阶段 02 开始实际预览与人工检查；阶段 04 再按项目需要引入组件行为测试和 Playwright 视觉回归。测试覆盖有意义的行为与风险，不为可逆文案修改或与实现逐字对应的内容编写测试。

实际截图与未来视觉基线均需记录 OS、浏览器版本、字体、视口、缩放、数据、语言、时区、动态效果策略和源码版本。建立或修改回归基线需要人工判断；未执行、不适用、失败与通过必须分开记录。采用 [验收提示词](../prompts/visual-qa.md) 时也遵循这一规则。
