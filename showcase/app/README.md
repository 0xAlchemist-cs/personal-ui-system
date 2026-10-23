# Showcase：最小应用与主题通路

当前交付为 [Phase 02 任务 2](../../docs/superpowers/plans/2026-10-23-showcase-v1.md) 的基础预览。React 应用与一个 Story 共用 `ShowcaseThemeProvider`，验证同一套 Token、Ant Design 主题与反馈上下文。成员管理交互、完整 Stories 状态矩阵和页面验收尚未实现。

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

1. `src/theme/resolve-tokens.ts` 按 [Token 契约](../../design-system/tokens/README.md) 读取原始值、语义值和 `minimal-saas` 覆盖，仅返回已解析的语义值。冲突、非法覆盖、未知引用、循环与反向依赖会报错。
2. `src/theme/antd-theme.ts` 将语义值转换为类型明确的 `ThemeConfig`，尺寸从 `px` 转为数字，行高从无单位字符串转为正数；不将自定义 JSON 直接传给第三方 Provider。
3. `ShowcaseThemeProvider` 是应用与 Storybook 的共同入口，通过 `ConfigProvider`、中文 locale 与 Ant Design `App` 提供主题和反馈。预览使用 `App.useApp()`，没有静态消息调用。
4. 同一份解析结果生成作用于预览容器的 `--pui-*` CSS 变量。768/1024px 媒体条件由 Token 数字生成，不在媒体条件中使用 `var()`。

源文件通过同仓库相对路径读取 `design-system/`。Vite 和 Storybook 的文件访问仅允许应用目录与所需设计资产目录，没有本机绝对导入或跨仓库目录链接。独立项目复用仍按 [快照策略](../../docs/guides/project-reuse.md) 处理。

## 验证与边界

实际检查、浏览器环境、截图及已知限制见 [T2 验证记录](../../tests/manual/showcase-v1/t2-theme-check.md)。本次只验证基础主题预览，没有 30 条成员记录、查询/编辑、完整状态 Stories、视觉回归基线或公共组件包；原始 Brief、Token 与预设成熟度均未改变。

官方核验入口：[Vite](https://vite.dev/guide/)、[Storybook](https://storybook.js.org/docs/get-started/install)、[Ant Design 主题](https://ant.design/docs/react/customize-theme/)、[Vitest](https://vitest.dev/guide/)。真正升级时重新检查 Node 要求、peerDependencies、锁文件与测试结果。
