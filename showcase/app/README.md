# Showcase：成员管理示范页

当前交付到 [Phase 02 任务 3](../../docs/superpowers/plans/2026-10-23-showcase-v1.md)。应用首页为成员管理示范页，支持本地组合筛选、创建时间排序、分页与姓名/邮箱编辑；React 应用与一个基础主题 Story 共用 `ShowcaseThemeProvider`。完整 Stories 状态矩阵和正式页面验收尚未完成。

## 环境与版本

核验日期：2026-10-23。实际应用检查环境为 Node `22.15.0`、npm `10.9.2`。支持的 Node 范围见 `package.json`，依赖均固定版本，完整依赖树见 `package-lock.json`。

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

默认访问 `http://127.0.0.1:6006/`，查看“基础 / 主题通路”。本地服务器只绑定回环地址。

如果 Windows PowerShell 的 `npm.ps1` 因用户级 npm 路径不可读而报 `MODULE_NOT_FOUND`，可以将上述命令中的 `npm` 换成 `npm.cmd`。本次实测此方式可用，没有修改全局 npm、PATH 或 MCP 配置。

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

实际检查、浏览器环境、截图及已知限制见 [T3 验证记录](../../tests/manual/showcase-v1/t3-interaction-check.md)，主题通路历史见 [T2 记录](../../tests/manual/showcase-v1/t2-theme-check.md)。完整状态 Stories、200% 缩放与正式页面验收留到后续任务；没有视觉回归基线或公共组件包，冻结 Brief、Token JSON 与预设成熟度未改变。

官方核验入口：[Vite](https://vite.dev/guide/)、[Storybook](https://storybook.js.org/docs/get-started/install)、[Ant Design 主题](https://ant.design/docs/react/customize-theme/)、[Vitest](https://vitest.dev/guide/)。真正升级时重新检查 Node 要求、peerDependencies、锁文件与测试结果。
