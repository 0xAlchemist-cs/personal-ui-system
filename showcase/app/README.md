# Showcase：成员管理示范页

当前交付到 [Phase 02 任务 5](../../docs/superpowers/plans/2026-10-23-showcase-v1.md)。应用首页为成员管理示范页，支持本地组合筛选、创建时间排序、分页与姓名/邮箱编辑；React 应用与 17 个 Story 共用 `ShowcaseThemeProvider`。真实页面、状态、键盘、响应式与缩放验收见 [T5 正式验收](../../tests/manual/showcase-v1/review.md)。

## 环境与版本

核验日期：2026-10-23。T5 应用检查环境为 Node `22.15.0`、npm `11.16.0`；历史 T2～T4 使用 npm `10.9.2`。支持的 Node 范围见 `package.json`，依赖均固定版本，完整依赖树见 `package-lock.json`；本轮没有升级运行依赖。

| 依赖 | 固定版本 |
| --- | --- |
| React / React DOM | 19.3.1 |
| Ant Design | 6.6.7 |
| Vite / React 插件 | 8.3.5 / 6.1.2 |
| TypeScript | 6.0.3 |
| Storybook / React-Vite 集成 | 10.6.3 |
| Vitest | 5.0.5 |
| Oxlint | 1.88.0 |

应用从官方 `create-vite@9.3.1` 的 `react-ts` 模板建立，沿用其 Oxlint 方案并补充 Storybook/Vitest。TypeScript 保留 6.0 系列，没有仅为追新升级到 7；Node 类型包使用 22 系列。Ant Design 组件版本与工具 CLI 的版本独立核验，即使本次恰好同为 6.6.7。

## 安装与启动

在仓库根目录运行：

```sh
npm --prefix showcase/app ci
npm --prefix showcase/app run dev
```

Vite 默认访问 `http://127.0.0.1:5173/`，若端口被占用，以命令输出为准。另开终端启动 Storybook：

```sh
npm --prefix showcase/app run storybook
```

默认访问 `http://127.0.0.1:6006/`，目录分为“基础”“布局”“成员”；可用左侧搜索查找组件。每项预览底部的“用途与接口”说明可展开。本地服务器只绑定回环地址。T5 实测应用为 `http://127.0.0.1:5185/`，Storybook 为 `http://127.0.0.1:6015/`，可用下列端口参数复现：

```sh
npm --prefix showcase/app run dev -- --port 5185 --strictPort
npm --prefix showcase/app run storybook -- --ci --port 6015
```

如果 Windows PowerShell 的 `npm.ps1` 因用户级 npm 路径不可读而报 `MODULE_NOT_FOUND`，可以将上述命令中的 `npm` 换成 `npm.cmd`。本次实测此方式可用，没有修改全局 npm、PATH 或 MCP 配置。

## Story 目录与操作

| 分组 | 部件 | Story 数量与内容 |
| --- | --- | --- |
| 基础 | 主题通路 | 1：原有 Token/控件/反馈预览，补齐说明 |
| 布局 | AppShell | 2：宽屏导航、小屏抽屉；实际 iframe 宽度决定断点 |
| 布局 | ContentPanel | 1：标题与内容分组，Controls 可改标题和说明 |
| 成员 | MemberFilters | 2：输入事件、组合筛选与清除 |
| 成员 | MemberTable | 4：默认、加载、无初始数据、可滚动表格焦点 |
| 成员 | EditMemberDialog | 3：有效表单、字段错误/禁用原因、键盘圈定与取消返回 |
| 成员 | MembersPage | 4：30 条默认记录、无初始数据、筛选无结果、保存成功 |

MemberTable 的 Controls 仅开放加载、页码与排序，真实表格事件也会同步这些参数；编辑事件记录到 Actions，完整编辑流程使用 MembersPage。加载由 Story 中的官方 Spin 包装实际表格，底下的控件使用 inert，关闭加载参数即可恢复操作；产品应用未添加加载延时。

MemberFilters 的 query Control 是初始值，修改它会重置隔离预览；实际输入由 Story 的局部受控状态同步处理，输入过程不会改写这个初始快照。其他业务状态通过预览中的实际按钮和字段操作；表单规则、数据计算和保存反馈都复用现有实现。

带 play 的 Story 选择后自动准备对应状态，之后仍可操作。保存提示遵循产品原有约 3 秒关闭行为，可再次编辑重现。重新选择或重载 Story 恢复固定初始数据。AppShell 的“小屏抽屉”在实际窄视口打开，在宽视口展示正常桌面布局；可使用 Storybook 视口工具或调整浏览器宽度，预览读取真实 iframe 宽度。

当前使用 Storybook 自带 Controls/Actions/Interactions，没有额外安装文档插件；用途与接口说明直接在 Canvas 中可见。部件覆盖矩阵、稳定 Story ID 和 T4 当时的边界见 [T4 记录](../../tests/manual/showcase-v1/t4-stories-check.md)。T5 对全部 17 个 Story 在 375/768/1440px 的实际 iframe 视口执行了 51 项检查，另在最终修复源码上完成 9 项相关复测，结果与截图入口见 [当前验收报告](../../tests/manual/showcase-v1/review.md)。

## 检查与构建

```sh
npm --prefix showcase/app run typecheck
npm --prefix showcase/app run lint
npm --prefix showcase/app run test
npm --prefix showcase/app run build
npm --prefix showcase/app run build-storybook
```

`test` 使用 `vitest run`，不进入监听模式。类型检查覆盖 `src/` 中的应用、测试、Stories，以及 `.storybook/`、Vite 和 Vitest 配置。应用输出到 `dist/`，Storybook 输出到 `storybook-static/`；生成物与 `node_modules/` 不纳入版本库。

## 主题的唯一通路

`src/theme/tokens.ts` 统一解析固定的 `minimal-saas` 组合，主题 Provider 与响应式导航共用同一份结果。

1. `src/theme/resolve-tokens.ts` 按 [Token 契约](../../design-system/tokens/README.md) 读取原始值、语义值和 `minimal-saas` 覆盖，仅返回已解析的语义值。冲突、非法覆盖、未知引用、循环与反向依赖会报错。
2. `src/theme/antd-theme.ts` 将语义值转换为类型明确的 `ThemeConfig`，尺寸从 `px` 转为数字，行高从无单位字符串转为正数；不将自定义 JSON 直接传给第三方 Provider。
3. `ShowcaseThemeProvider` 是应用与 Storybook 的共同入口，通过 `ConfigProvider`、中文 locale 与 Ant Design `App` 提供主题和反馈。预览使用 `App.useApp()`，没有静态消息调用。
4. 同一份解析结果生成作用于应用容器的 `--pui-*` CSS 变量。768px 内边距媒体条件由 Token 数字生成；1024px 导航使用 Token 的 `matchMedia`，不在媒体条件中使用 `var()`。

源文件通过同仓库相对路径读取 `design-system/`。Vite 和 Storybook 的文件访问仅允许应用目录与所需设计资产目录，没有本机绝对导入或跨仓库目录链接。独立项目复用仍按 [快照策略](../../docs/guides/project-reuse.md) 处理。

## 验证与边界

成员数据与查询位于 `src/features/members/`：30 条固定合成记录，每页 10 条；先按姓名/邮箱与状态筛选，再按创建时间排序，最后分页。编辑仅修改姓名和邮箱，保存在当前页面内存，刷新恢复；停用成员仍可编辑。首屏没有人工加载等待或真实请求。

`src/components/` 的 `AppShell` 与 `ContentPanel` 仅用于本工作台。抽屉和弹窗复用官方组件；实际浏览器发现的 Tab 首尾越界由局部键盘处理补齐，关闭后返回触发按钮，编辑行消失时回到列表标题。

当前检查日志、环境、真实截图、缺陷修复与 Gate 02 结论见 [T5 正式验收](../../tests/manual/showcase-v1/review.md)。最终功能源码 `b71e54727aab2e15f6bf91fbef42892ca7c3171f` 的页面 17 项与三种视口纯键盘 9 项通过；Stories 完成 51 项响应式矩阵后，在同一最终源码补测相关 9 项。另有 38 项对比度、13 项语义检查及真实 200% 缩放证据，各轮检查范围、源码与最终构建日志以报告为准。

T5 修复了手机空态文字随宽表格移出视口的问题，并补齐 Ant Design 语义颜色、控件提示与焦点映射；未改变冻结 Brief 或设计 Token 的颜色和尺寸值。主题、核心交互与 Stories 的历史记录分别保留在 [T2](../../tests/manual/showcase-v1/t2-theme-check.md)、[T3](../../tests/manual/showcase-v1/t3-interaction-check.md)、[T4](../../tests/manual/showcase-v1/t4-stories-check.md)；规格冻结初稿见 [T1](../../tests/manual/showcase-v1/t1-spec-check.md)。

`minimal-saas` 仅在本次成员管理页面与 Stories、固定 light / comfortable / blue / medium 组合及所列浏览器环境内标为 `validated`；其他两套风格仍为 `draft`，没有公共 `approved` 资产、公共组件包或视觉回归基线。公开组件分发与多技术栈兼容性尚未验证；应用和 Storybook 的大包体提示等非阻断限制保留在验收报告中。

Phase 03 尚未启动。下一张候选任务卡为 [P03-T1｜消费者选型](../../docs/superpowers/plans/2026-10-23-phase03-consumer-pilot.md)：先明确独立场景及技术栈；没有现成消费者时先形成隔离候选方案，不自动初始化消费者应用。

官方核验入口：[Vite](https://vite.dev/guide/)、[Storybook](https://storybook.js.org/docs/get-started/install)、[Ant Design 主题](https://ant.design/docs/react/customize-theme/)、[Vitest](https://vitest.dev/guide/)。真正升级时重新检查 Node 要求、peerDependencies、锁文件与测试结果。
