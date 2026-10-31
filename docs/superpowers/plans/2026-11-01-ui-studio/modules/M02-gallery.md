# M02｜效果图库与真实动态预览

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 交付 36 项可查找、可运行、可加入购物车的效果目录，覆盖基础控件与四类业务场景。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：M01。独立执行入口：[本模块提示词](../prompts/M02-gallery.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 新建：`studio/gallery/registry.tsx`、`catalog.ts`、`GalleryPage.tsx`、`ComponentDetail.tsx`、`gallery.css`（前缀均为 showcase/app/src/features）。
- 新增渲染实现放 `gallery/components/`，按功能区职责组织；已存在成员表格/筛选/编辑弹窗尽可能复用。
- 封面放 `showcase/app/public/studio-covers/`，配来源记录；测试 `studio/gallery/registry.test.ts` 及 Gallery Stories。
- 不把生成截图计入公共组件发布，不修改已安装 Skill 副本。

## 输入与输出接口

按契约实现 ComponentDefinition 与 getDefinition。Gallery 的加入事件传 {componentId, variantId, props} 给 M03；M03 未接入时 Story 用明确的事件记录，不能展示假购物车数量。

## 实施步骤

- [ ] 1. 定义目录元数据与三种支持风格，首批清单见下文。按基础控件/功能区、场景、关键词筛选，条件组合为 AND；空结果提供清除筛选。
- [ ] 2. 使用现有官方组件和小型本地功能区实现；每项声明用途、默认 props、可编辑字段、动态行为和布局角色。重复文案/配色不增加目录数量。
- [ ] 3. 以同一 renderer 在 640×400 画布捕获封面；记录组件 ID、variant、风格、源码 SHA、视口和演示数据。表格等宽组件允许在封面缩略展示，详情进入真实尺寸。
- [ ] 4. 动画封面只代表一个静态时刻；详情挂载真实 React 渲染，提供重新演示/恢复初始状态。图加载失败显示“封面暂不可用”及可用的真实预览，不用概念图占位。
- [ ] 5. detail 切换风格使用本地 Provider 与相同语义值；新增 StudioPreviewProvider 可复用 Resolver、createAntdTheme，不能复制第二份 Token 解析器。
- [ ] 6. 暂停离屏预览；只让当前详情运行，避免 36 个无限动画同时占用资源。尊重 prefers-reduced-motion，说明哪些效果被减弱。
- [ ] 7. 给需要用户输入的控件提供关联标签；详情关闭后焦点回原条目。

## 可判定验收与停止条件

- [ ] 公开目录恰好 36 个唯一 ID，内部布局容器另计；目录元数据能定位实际 renderer，每项至少一套封面、一条用途及可操作的默认态。
- [ ] 首批三种风格下均能检查文字/背景/焦点；无法支持某风格时明确禁用该组合，不生成假预览，并作为未完成项收口。
- [ ] 详情中的 Switch、Tabs、弹窗、轮播与进度指示器实际改变状态；输入和表格不只是截图。
- [ ] 筛选、无结果、封面错误、键盘打开/关闭、加入事件有行为验证；375/768/1440px 页面浏览无整页横向溢出。
- [ ] 动效与交互单独人工检查；现有两套 draft 风格不因目录截图自动晋级。

## 补充边界

## 首批清单：16 个基础控件 + 20 个功能区

下列名称同时作为首版稳定 componentId，区分大小写；字段校验、默认属性及真实 renderer 由该条目的定义提供。

基础控件：Button、IconButton、TextInput、TextArea、Select、Checkbox、RadioGroup、Switch、Slider、DatePicker、Tabs、Tag、Avatar、Tooltip、Skeleton、Progress。

功能区：SiteHeader、SiteFooter、Hero、FeatureGrid、PricingSection、FaqSection、ArticleList、ArticleDetail、AuthorProfile、NewsletterForm、SidebarNavigation、BreadcrumbBar、StatsOverview、SearchFilters、DataTable、PaginationBar、EditDialog、LoginForm、SettingsForm、ActivityFeed。

每个条目只有一个计数；例如 DataTable 的三个颜色变体仍算一项。M00 的 M3 专属按钮不因此强行加入公共清单。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
