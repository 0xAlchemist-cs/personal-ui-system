# M03｜购物车和页面分组

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 允许多选真实组件，并在生成前让用户明确每项属于哪个页面及其作用。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：M02。独立执行入口：[本模块提示词](../prompts/M03-cart-pages.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 新建：`showcase/app/src/features/studio/cart/CartPanel.tsx`、`PageGrouping.tsx`、`suggest-pages.ts`。
- 测试：`cart/suggest-pages.test.ts`、CartPanel/PageGrouping Stories。
- 数据写入 M01 的 StudioProject，不另建持久化购物车格式。

## 输入与输出接口

接收 Gallery 的加入事件，输出 cart、pagePlan、planConfirmed。suggestPages 按 ComponentDefinition.defaultPageKind 和 roles 生成建议，页面标题可编辑。

## 实施步骤

- [ ] 1. 同 componentId + variantId 重复点击加入时定位已有条目，不叠加副本；用户点“复制一份”才创建新 CartItem.id。数量是实例数。
- [ ] 2. 支持移除单项、清空购物车与查看详情。移除已分组条目同时移除该 assignment；清空整车要求一次明确确认。
- [ ] 3. 默认分组优先使用场景与用途：营销类→官网，blog 场景的文章详情/列表→内容页，账户类→账户页，其余 admin/webapp 的 dashboard/listing→管理页；同一条目存在多种候选归属时保留待分配并说明。基础控件未有上下文时放“待分配”，不能自作主张生成十六个独立页面。
- [ ] 4. 公共 header/navigation/footer 允许明确分配到多个页面；主内容默认一个页面。给同页两种互斥主导航显示冲突，用户选择保留、移页或明确设为备选。
- [ ] 5. 支持新建、重命名、删除空页面及移动组件归属。删除含组件的页面先要求选择移入页面或取消，不能直接丢掉组件。
- [ ] 6. “确认分组并生成”要求非空车、至少一页、没有待分配和未处理冲突；确认后的 cart/分组变化将 planConfirmed 设 false，旧候选标过期，工作稿不删除。
- [ ] 7. 不依赖模型解析自然语言；规则无法判断时保留待分配并展示原因。

## 可判定验收与停止条件

- [ ] 用 Hero+ArticleList+DataTable+LoginForm 得到四类分组；额外 Button 进入待分配而不是凭空生成页面。
- [ ] 一个 SiteHeader 可分到官网及内容页，输出保留同一 sourceCartId；从车移除后全部归属消失。
- [ ] 两种主导航冲突被展示并能解除；空车、待分配时不能进入自动生成，但可回图库。
- [ ] 确认前后编辑规则可复现，不丢工作稿；完整保存交给 M07。
- [ ] 提供分组矩阵截图与操作路径，不把建议称为语义理解结果。

## 补充边界

入口可提供“先去自由拼装”，但仍需确定至少一个画板；未分配条目继续在插入区，不为了让用户进入画布而自动丢弃。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
