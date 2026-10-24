# P04-A3 — 质量轨道收口

日期：2026-10-24。仅执行 [Task A3](../superpowers/plans/2026-10-23-phase04-quality-and-distribution.md#task-a3--完成质量门禁收口)。基线为 `86ff31b42a40a017d8ca7551fd7c2c0793d336b8`；实现提交为 `d78eadfb16a4acb241cb7f90bcb29e68cbc57825`。不改写既有计划，不执行分发轨道 B，不改变 Brief、Token、资产成熟度或消费者。

**A3 已完成，质量轨道 A1～A3 收口。** [本轮真实 CI 40089500737](https://github.com/0xAlchemist-cs/personal-ui-system/actions/runs/40089500737) 对上述实现 SHA 的两个 job 均成功。分发轨道未执行，不据此宣称整个 Gate 04 通过。

## 已有证据复核与本次变更

[前置核对](../../tests/manual/quality-a3/preflight.json) 保存远端 main、保护状态和基线 CI 的真实查询结果；远端 main 与 [基线 CI 40087965908](https://github.com/0xAlchemist-cs/personal-ui-system/actions/runs/40087965908) 的精确 SHA 均为上述基线，运行成功结论已重新查询。该提交的 main 运行 40088084686 也成功，本轮隔离分支从该 SHA 继续。

[独立证据审计](../../tests/manual/quality-a3/audit.json) 对 A1 的 15 份原始日志及 A2 的 45 份附件重新计算 SHA-256，全部匹配，A2 字节数也一致。原有生产浏览器结果实际为 11 通过；额外实验为 11 项各执行 2 次、共 22 通过，均无 unexpected / skipped / flaky。23 组运行源码、锁文件、工作流、冻结契约及历史证据路径未改。本轮没有在本地重跑应用、Storybook 或消费者，不把这些历史结果冒充新运行。

实际文件变更：

- 扩充 [tests/README.md](../../tests/README.md) 这一既有唯一验收约定：机器/人工分工、合并与候选交付检查、失败留证和修复复核、升级边界及未来基线人工审核。
- 新增 [PR 模板](../../.github/PULL_REQUEST_TEMPLATE.md)：简短记录受检 SHA、CI、人工证据与限制，完整 URL 引用唯一约定。模板合入默认分支后供后续 PR 使用；本轮未新建 PR 或实测 PR 表单自动填充。文件位置和默认分支要求核对了 [GitHub 官方说明](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)。
- 更正 [质量工具说明](../../tools/quality/README.md) 中仍称“没有浏览器”的过时内容，指向现有 11 项浏览器检查与统一验收职责。
- 更新 AGENTS、README、文档索引、路线图和 CHANGELOG 的当前状态；新增本报告和本轮 JSON 证据。没有新增运行依赖、校验器、组件、基线、平台规则或发布流水线。

## A3 与质量轨道核对

| 原任务要求 | 实际落点与结论 |
| --- | --- |
| 机器检查与人工 UX 分工 | [验收矩阵](../../tests/README.md#pr-与候选发布前核对) 按契约、工程、关键旅程、UX 与消费者分别说明；自动通过不等于视觉、完整无障碍或公共资产批准 |
| 失败、基线审核和异常升级 | [处理路径](../../tests/README.md#失败修复与异常升级) 保留 SHA/run/命令/环境、7 天浏览器 artifact 到期前的重要归档、原因与复测链；既有授权内的常规修复继续执行，真实边界才升级 |
| 适用 PR / 候选交付检查 | 交付前核对实际受检 SHA 的两个 job 成功；PR 合并提交记录 head/base；源码变化不能沿用旧 SHA 的绿灯。消费者仅使用自己的适用工具 |
| 质量轨道完成条件 | 本轮真实 CI 从锁文件安装并完成有效检查，关键旅程有实际输出；机器/人工职责与失败可追踪路径均已落盘，质量轨道 A 通过 |
| 可选视觉基线 | 当前不启用，人工基线批准不适用。现有截图仍属诊断/人工实测；未来若启用，先固定环境并由人工审阅初次和变更图片 |

涉及审美、信息层级、密度、文案取舍及真实需求接受仍须人工判断。完整全站 Tab、200% 缩放、读屏、多浏览器/真实移动设备等属于本轮自动化未覆盖范围，不表示它们永久不能借助工具；受影响时按目标项目补充适用检查。A2 的少量行为断言继续按原范围使用。

## 本轮验证与边界

[验证记录](../../tests/manual/quality-a3/validation.json) 保存命令、退出码和输出。实施者初次在 Windows 沙箱运行质量命令，因 `fs.realpath` 权限报 EPERM 而退出 1；同一命令提升后实际退出 0，未删除路径检查。本地检查覆盖完整 Schema、YAML、Token、JSON 与 Markdown 目标；没有为本次文档修改新增低价值测试。

[本轮 CI 记录](../../tests/manual/quality-a3/ci-run.json) 对应实现 SHA `d78eadfb16a4acb241cb7f90bcb29e68cbc57825`，两个干净 job 均成功：知识契约校验、39 项质量测试（0 跳过）、类型/Lint、78 项应用测试、应用/Storybook 构建和 11 项浏览器检查。记录保存 job/step 结论、日志计数摘录、真实报告 artifact ID 与摘要；完整原始日志由运行页定位，未再次复制两套完整日志。工作流沿用 A2 的固定 Node/npm、Actions SHA、两份 npm 锁文件及固定 Playwright，没有扩大验收范围。

[远端设置快照](../../tests/manual/quality-a3/preflight.json) 实际返回 `protected:false`、required contexts 为空。本次只形成维护流程和复核入口，没有配置平台保护，不能声称 GitHub 已强制阻止失败合并；平台强制检查与模板是不同能力，见 [GitHub 分支保护说明](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)。

视觉基线继续不启用。当前 Windows 与 Ubuntu 的实际字形未固定，无人工核准的 Linux 参考图；未来差异须人工辨别环境与产品变化，不能自动更新。运行环境会影响截图这一边界核对了 [Playwright 官方说明](https://playwright.dev/docs/test-snapshots)。Node 原生 TS 实验性提示、既有包体警告以及 A2 未覆盖范围继续按原记录保留。

## 停止位置与后续条件

本轮只收口质量轨道 A；不替 B1 作新的分发判断，不把 B1 标为 Not needed / 已完成，也不单凭 A3 宣称整个 Gate 04 通过。原有固定快照策略与资产成熟度保持既有结论。

**下一候选任务卡：[P04-B1｜分发必要性评估](../superpowers/plans/2026-10-23-phase04-quality-and-distribution.md#p04-b1分发必要性评估)。** 原计划要求至少两个明确消费者或明确发布目标；当前只有一个独立消费者，条件尚未触发，没有可自动启动的下一张实施卡。出现相应需求并由用户要求推进时，再按原卡评估；本轮不启动 npm、Registry 或 MCP 工程。
