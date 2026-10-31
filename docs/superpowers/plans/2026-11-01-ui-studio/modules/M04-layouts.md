# M04｜三套结构方案生成与比较

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 基于当前组件和已确认分组，用确定性规则生成最多三套不同的多页面布局。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：M03。独立执行入口：[本模块提示词](../prompts/M04-layouts.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 新建：`showcase/app/src/features/studio/layouts/generate.ts`、`rules.ts`、`signature.ts`、`CandidateComparison.tsx`。
- 测试：`layouts/generate.test.ts`、`layouts/fixtures.ts`；比较预览使用 M02 的 renderer。
- 不在每种方案里另写一份组件业务代码。

## 输入与输出接口

实现 generateCandidates(project, seed): Candidate[]。inputKey 由风格、按稳定顺序归一化的 cart/props 和确认后的 pagePlan 序列化得到；signature 为忽略实例 ID 和纯颜色差异的结构表达。

## 实施步骤

- [ ] 1. 定义可组合的布局决策：导航在顶部或侧边、主辅区域是否分栏、主内容与辅助内容顺序、卡片网格列数、内容是否受阅读宽度约束。每项决策都检查组件角色和页面类型的适用性。
- [ ] 2. 对营销页使用 Hero+内容区/双栏引导/错落分组的结构规则；对内容页使用阅读列/目录侧栏/文章列表与阅读区；对管理页使用侧导航/顶部导航/工具侧栏与主结果区。它们是规则候选池，不是固定返回三张截图。
- [ ] 3. 将规则实际装配为 DesignDoc；每个分配条目都出现，公共导航按确认归属复用。自动添加的仅为有记录的布局容器和必要页面标题，不能添加假业务统计或删除难摆的组件。
- [ ] 4. 剔除角色冲突、组件丢失、页面根缺失、非法嵌套和明显超宽的组合，再用 signature 去重。最多返回三项，同时列出 2～3 条可理解的差异说明。
- [ ] 5. 同输入同 seed 得到同结果；“换一批”更新 seed，并避开本项目已展示 signature。组合耗尽时告知无更多有效方案，保留现有方案及拼装入口。
- [ ] 6. 比较页默认看桌面，允许按页面和设备切换；选择方案调用 createWorkingDoc，候选原稿不改；“都不喜欢，自己拼装”传 null，保留购物车/页面分组。
- [ ] 7. 工作稿存在时重新生成候选不覆盖它；明确区分“候选已过期”和“当前编辑稿”。

## 可判定验收与停止条件

### 结构决策的首版取值

| 决策 | 允许值 | 约束 |
| --- | --- | --- |
| 主导航位置 | top / side / none | 没有导航角色条目时为 none；同一页不额外虚构第二个导航 |
| Hero 构图 | stacked / text-media / media-text | Hero 的 layoutFields 显式支持 composition，且有媒体区域时才参与；不替换文案和图片 |
| 主辅区域 | single / main-aside / aside-main | 只有辅助内容存在时才可分栏；比例为 2:1 或 3:1，手机重排为主内容在前 |
| 概览与结果顺序 | overview-first / result-first | 只有二者都存在且无明确顺序约束时可切换；筛选始终靠近结果 |
| 重复内容网格 | 1 / 2 / 3 列 | 仅作用 FeatureGrid/卡片或列表容器；不能把 DataTable 拆成三列 |
| 阅读宽度 | 720 / 960 CSS px | 仅 article 内容页；作为布局选择记录到项目，不修改公共 preset |

按这些决策枚举最多 256 组全站组合，先过滤合法性和结构签名，再用 seed 驱动的稳定洗牌选择未展示项。枚举顺序采用页面分组顺序及上表取值顺序，不依赖对象散列顺序。该上限是首版计算预算，不保证穷尽所有理论组合；耗尽时如实显示“当前规则下没有更多方案”。三个有效方案之间至少在两个适用决策上不同；如果输入无法提供两个可变决策，则按真实有效数量返回，不制造差异。

### 检查项

- [ ] Fixture A（官网）：Header+Hero+FeatureGrid+Pricing+Footer，返回三套不同 signature，至少涉及两种结构决策。
- [ ] Fixture B（后台）：SidebarNavigation+SearchFilters+StatsOverview+DataTable+Pagination，能比较主辅位置、导航或区块顺序，不能只换颜色。
- [ ] Fixture C（仅一个 Button）：数量不足三套则显示限制，不输出三个重复布局。
- [ ] 修改购物车得到新 inputKey；重复 seed 可重现；换一批不重复已有 signature，有限池耗尽有解释。
- [ ] 每套页面集合相同、所选组件完整，三设备真实渲染；阅读顺序和筛选靠近结果等约束仍成立。
- [ ] 无 AI 网络请求、无 API Key；不把“规则生成”包装为无限创作。

## 补充边界

随机性只能用于有效决策组合的选择，不能随机坐标破坏可读性。结构签名是可测试的差异依据，人工仍需检查三套是否值得比较。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
