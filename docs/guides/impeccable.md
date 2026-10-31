# Impeccable 候选工具

状态：候选，按需使用。评估与首次源码试点日期：2026-10-31。

## 固定来源

- 仓库：[pbakaus/impeccable](https://github.com/pbakaus/impeccable)。
- 评估提交：`2f97a85a4a87a80066a693bd3546b092bd300772`，其 package.json 声明版本 4.8.0。
- [固定 README](https://github.com/pbakaus/impeccable/blob/2f97a85a4a87a80066a693bd3546b092bd300772/README.md)、[Skill](https://github.com/pbakaus/impeccable/blob/2f97a85a4a87a80066a693bd3546b092bd300772/.agents/skills/impeccable/SKILL.md)、[audit 方法](https://github.com/pbakaus/impeccable/blob/2f97a85a4a87a80066a693bd3546b092bd300772/.agents/skills/impeccable/reference/audit.md)。
- 上游为 [Apache-2.0](https://github.com/pbakaus/impeccable/blob/2f97a85a4a87a80066a693bd3546b092bd300772/LICENSE)，另有 [NOTICE](https://github.com/pbakaus/impeccable/blob/2f97a85a4a87a80066a693bd3546b092bd300772/NOTICE.md)。本次只保存链接和本库评估，没有复制上游 Skill 正文；以后分发副本时保留适用许可、署名及修改说明。

## 使用位置

作为 [设计评审](../../prompts/design-review.md) 的可选补充：用 audit 梳理技术问题，用 critique 组织可用性判断；需要实施时，按具体任务选择 layout、typeset、clarify 或 polish。组件 API 仍查项目所用组件体系的官方资料。

本库 Brief、预设、Token 与项目约束优先。上游的固定圆角、字体和装饰偏好只供判断，不自动改写已选预设。harden 限于真实需求；极低概率防护遵守用户确认要求，外部数据在边界校验后不重复内部校验。extract 先确认实际复用价值，不为单次逻辑增加抽象，也不自动晋级公共资产。

## 已验证接入

首次试点通过 npm 临时缓存运行固定版本检测器：

```sh
npm exec --yes --package=impeccable@4.8.0 -- impeccable detect --json showcase/app/src
```

该命令用于本仓库源码，依赖 npm 分发的版本化程序；Git 提交固定的是评估资料，尚未核对 npm 包与该提交逐字节一致。源码模式不能覆盖最终组件 DOM、实际对比度或真实交互。检测结果需结合源码和任务复核，不能将空结果当作页面验收通过。

[试点报告](../records/2026-10-31-impeccable-pilot.md) 记录实际结果。尚未安装全局或项目 Skill、Hook，未执行 install/init/document/live，未新增 PRODUCT.md、DESIGN.md 或 CI 门槛。检测器运行会使用 npm 缓存及其运行环境，这不同于只阅读 Markdown。

后续如需完整 Skill，优先选择项目级、固定来源的试用，明确引擎、Hook 和上下文文件的影响，并复核与已有 frontend-design 的触发重叠。浏览器检测和完整命令流程通过实际试用后再扩大接入；既有 [验收约定](../../tests/README.md) 保持有效。
