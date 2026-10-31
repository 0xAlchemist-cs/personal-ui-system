# Impeccable 首次限定试点

日期：2026-10-31。结论：收录为候选工具；源码检测入口可运行，评审方法可补充现有提示词。尚不足以评价浏览器检测准确率、完整 Skill 效果或自动修复质量。

## 对象与方法

本库受检应用来源：`146c50cf5865c15d9e530afa226529fd94372235`。在独立分支 codex/impeccable-pilot 上评审成员管理页，应用源码未修改。上游来源、版本与许可见 [候选指南](../guides/impeccable.md)。

人工借用固定 audit 的五维分类阅读源码；没有调用完整 $impeccable audit/critique，没有执行 Skill 的 context 引擎流程，不将本次称为完整上游命令验收。不输出无法由本次证据支撑的 /20 或 WCAG 合规评分。

实际执行：

```sh
npm exec --yes --package=impeccable@4.8.0 -- impeccable detect --json showcase/app/src
```

Windows / PowerShell 下通过 npm.cmd 执行，退出码 0，stdout 为 `[]`，见 [原始 JSON 结果](../../tests/manual/impeccable-pilot/source-detect.json)。npm 使用临时缓存；未执行安装器，未设置 Hook 或修改消费者。

## 五维评审

| 维度 | 本轮核对证据 | 判断与限制 |
| --- | --- | --- |
| 无障碍 | MemberFilters 的 label/id；EditMemberDialog 的 Form 标签、禁用原因和对话框焦点；MembersPage 的触发元素与标题焦点回退 | 已有针对性实现；读屏、实际 Tab 顺序与渲染对比度本轮未测 |
| 性能 | MembersPage 的本地查询和固定演示数据，MemberTable 独立分页 | 未发现当前规模需要新增缓存或虚拟列表的依据；无本轮性能测量，不据此宣称性能通过 |
| 主题 | members.css 使用语义 CSS 变量；固定 minimal-saas 组合 | 不因未提供深色切换判为缺陷；本轮不修改 Token |
| 响应式 | members-filters 的 flex-wrap、表格局部 overflow-x、焦点滚动与触控高度样式 | 局部横向表格符合本库方案；不能将 min-width:770px 单独判为整页溢出；本轮没有新浏览器验收 |
| 实现一致性 | 官方 Ant Design 组件；明确标注演示数据与刷新恢复；检测输出 [] | 范围内没有确认的新 P0/P1 问题；没有检测命中，无法计算准确率或误报率 |

实际阅读文件：[MembersPage](../../showcase/app/src/features/members/MembersPage.tsx)、[MemberFilters](../../showcase/app/src/features/members/MemberFilters.tsx)、[MemberTable](../../showcase/app/src/features/members/MemberTable.tsx)、[EditMemberDialog](../../showcase/app/src/features/members/EditMemberDialog.tsx)、[样式](../../showcase/app/src/features/members/members.css)。

阅读过程中先尝试的 rg 在当前 Shell 不可用，随后直接读取已知文件；误写的 MemberEditModal.tsx 路径不存在，已改读实际 EditMemberDialog.tsx。这些是调查命令问题，不是应用缺陷。

## 适配结论

最有价值的是把技术评审拆成可核对的维度，并把布局、排版、文案改进分成明确动作。本页已有规范覆盖大部分检查，因此本轮未产生有证据的新修复，也未增加离线支持、重复校验、额外抽象或视觉装饰。

需要人工过滤的规则包括：固定浅色页无需新增深色模式；允许的局部表格滚动不等于响应式失败；已选圆角和字体不因上游审美偏好而改变。这是方法适配判断，不是检测器实际误报。

没有源码命中不能证明检测器有效或无效。下一次真实页面改进需求可验证 URL 模式与具体命中的准确性，再决定项目级 Skill/Hook 接入。完整 critique、实时变体、自动修复、跨项目效果均未验证；不改变风格成熟度、阶段状态或消费者快照。
