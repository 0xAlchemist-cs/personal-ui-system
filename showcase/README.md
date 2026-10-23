# 可视化组件工作台

阶段 02 首版工作台已完成本轮页面与 Stories 验收。[独立应用](app/README.md) 提供成员管理示范页与 17 个 Story，二者复用同一 Provider。当前验收结论、环境、截图、修复及 Gate 02 核对见 [T5 正式验收](../tests/manual/showcase-v1/review.md)；部件目录与演示参数见 [T4 验证记录](../tests/manual/showcase-v1/t4-stories-check.md)。

当前目录包括基础主题、AppShell、ContentPanel、筛选、表格、编辑弹窗和完整页面；加载仅在 Story 模拟，错误和成功通过真实交互触发。每项预览末尾可展开用途、接口、依赖及验证范围说明。T5 覆盖 375/768/1440px、纯键盘旅程、真实 200% 缩放、状态与对比度；截图是本次人工验收证据，没有建立视觉回归基线。

首批内容为导航、卡片、表格、表单和常见布局。先按实际项目需要选择兼容技术栈与组件体系，再按 [Storybook 官方文档](https://storybook.js.org/docs) 配置对应框架，不为了展示站强制所有消费者使用同一技术栈。

每个实际收录的组件或布局应展示默认态、适用的加载与结果状态、禁用与焦点状态，并说明输入、事件、依赖、预设、密度和验证范围。

工作台中的状态开关属于演示工具，不带入产品页面。`minimal-saas` 仅对本次已测成员管理页面、Stories 与固定 light / comfortable / blue / medium 组合标为 `validated`；其他风格仍为 `draft`，没有 `approved` 资产或公共组件包。历史主题与交互证据保留在 [T2](../tests/manual/showcase-v1/t2-theme-check.md)、[T3](../tests/manual/showcase-v1/t3-interaction-check.md)。

下一张候选任务卡是 [P03-T1｜消费者选型](../docs/superpowers/plans/2026-10-23-phase03-consumer-pilot.md)。Phase 03 尚未启动；按用户指令选择一个有明确技术栈的独立场景，缺少现成消费者时先形成隔离候选方案，再决定是否实施。自动化回归与包分发仍按阶段 04 的条件推进。
