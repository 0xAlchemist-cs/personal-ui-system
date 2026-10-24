# 质量与验收

本目录提供 [人工验收记录模板](visual-review-template.md) 与 [T5 正式页面验收](manual/showcase-v1/review.md)。当前报告记录真实页面与 17 个 Story 的响应式、键盘、状态、200% 缩放、对比度、语义及适用工程检查；它是 Gate 02 的验收入口，截图属于本次人工验收证据，尚无视觉回归基线。

历史证据保持原有任务边界：[T1 规格与验收初稿](manual/showcase-v1/t1-spec-check.md)、[T2 主题通路](manual/showcase-v1/t2-theme-check.md)、[T3 核心交互](manual/showcase-v1/t3-interaction-check.md)、[T4 Stories/状态](manual/showcase-v1/t4-stories-check.md)。不要用旧报告的“待 T5 验证”判断当前进度，实际阶段状态查看 [路线图](../docs/roadmap.md)。

独立消费者的证据位于 `manual/consumer-pilot/`：[T4 收口与 Gate 03](../docs/records/2026-10-24-p03-t4-closeout.md) 已核对固定来源、manifest、闭合快照、独立安装/构建及浏览器证据；原始页面结果见 [T3](../docs/records/2026-10-24-p03-t3-independent-validation.md)。历史 T1/T2 仍按当时边界保留。

[A1 质量与 CI](../docs/records/2026-10-24-p04-a1-quality-checks.md) 提供完整 Brief Schema、YAML、Token 与 Markdown 文件目标检查、39 项正负例和 Showcase 原有检查的真实 CI 日志，存放在 `manual/quality-a1/`。运行命令与边界见 [tools/quality](../tools/quality/README.md)；A1 历史记录不提供浏览器或视觉验收结论，workflow 尚未配置强制分支保护。

[A2 浏览器冒烟](../docs/records/2026-10-24-p04-a2-browser-smoke.md) 在三个视口执行 11 项成员/导航检查，额外 22 项本地重复实验（11 项各执行 2 次）与真实 CI 均通过；原始失败、焦点修复、诊断截图、trace、环境和 CI 日志存放在 `manual/browser-a2/`。执行入口是应用的 `test:e2e`，需先构建；CI 报告保留 7 天。截图属于诊断证据，没有像素比较基线，不替代人工视觉验收。

第一阶段检查文档链接、JSON/YAML 结构、Token 引用和预设与 Brief 的一致性；这不等于应用测试或视觉验收。

阶段 02 已有实际预览与人工检查；阶段 04 的 A1/A2 已提供静态、构建与浏览器 CI，下一张为 A3 收口。测试覆盖有意义的行为与风险，不为可逆文案修改或与实现逐字对应的内容编写测试。

实际截图与未来视觉基线均需记录 OS、浏览器版本、字体、视口、缩放、数据、语言、时区、动态效果策略和源码版本。建立或修改回归基线需要人工判断；未执行、不适用、失败与通过必须分开记录。采用 [验收提示词](../prompts/visual-qa.md) 时也遵循这一规则。
