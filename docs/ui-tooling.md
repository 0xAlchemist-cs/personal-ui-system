# UI 工具接入记录

核验日期：2026-10-23。接入官方知识与命令入口；本仓库仍是知识库，没有初始化 React、Vue、Nuxt 或 Next.js 应用。

## 安装范围

为 Codex 安装以下 9 个全局 Skill，并在 `.agents/skills/` 保存独立副本。副本保留官方内容，不通过本机路径导入全局目录；文件清单与 Git Blob SHA-1 见 [来源清单](../tooling/upstream-skill-files.json)。

| 官方来源 | 本次安装的 Skill | 快照文件数 |
| --- | --- | --- |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) | `shadcn` | 21 |
| [mui/material-ui](https://github.com/mui/material-ui/tree/master/skills) | `material-ui-styling`、`material-ui-theming`、`material-ui-nextjs`、`material-ui-tailwind` | 20 |
| [chakra-ui/chakra-ui](https://github.com/chakra-ui/chakra-ui/tree/main/skills) | `chakra-ui-builder`、`chakra-ui-migrate`、`chakra-ui-refactor` | 6 |
| [nuxt/ui](https://github.com/nuxt/ui/tree/v4/skills/nuxt-ui) | `nuxt-ui` | 15 |

此前的 Ant Design 全局 Skill 和 CLI 生成的项目级 `antd` Skill 继续使用。Skill 的存在不自动选择技术栈，也不授予迁移、覆盖主题或发布外部内容的权限。

`npx skills` 的整库拉取耗时较长；在 shadcn 落盘后停止该批次，其余 8 个 Skill 改用 `skill-installer` 的 Git 稀疏检出安装。选中目录按官方清单检查完整性，再复制为项目快照。

## 官方安装入口

全局安装使用以下命令，项目级安装移除 `--global`。明确列出 Skill 名称，避免装入上游维护者专用规则。

```sh
npx --yes skills add shadcn-ui/ui --global --agent codex --skill shadcn --yes
npx --yes skills add mui/material-ui --global --agent codex --skill material-ui-styling material-ui-theming material-ui-nextjs material-ui-tailwind --yes
npx --yes skills add chakra-ui/chakra-ui --global --agent codex --skill chakra-ui-builder chakra-ui-migrate chakra-ui-refactor --yes
npx --yes skills add nuxt/ui --global --agent codex --skill nuxt-ui --yes
```

快照更新时复核上游差异、重新记录来源与哈希，并验证当前项目。全局更新不自动覆盖仓库副本；新检出项目不依赖个人电脑路径。

## CLI 边界

| 体系 | 入口 | 本阶段用途 |
| --- | --- | --- |
| Ant Design | 本机已有 `antd`，实测 `6.6.7` | 按项目版本查询 API、Demo、Token，修改组件后运行适用检查 |
| shadcn/ui | `npx shadcn@latest`，实测 `4.22.1` | 读取上下文、查文档与 Registry；本次仅验证命令可运行 |
| Chakra UI | `npx @chakra-ui/cli@latest`，临时环境实测 `3.37.0` | 在实际 Chakra 应用中生成 Snippets、主题类型；命令需要可解析的 `@chakra-ui/react` |
| Material UI | 四个专题 Skill + 官方文档 | 本次不额外引入通用 CLI 或 codemod |
| Nuxt UI | 官方 Skill + 文档 / 按需 MCP | 应用或模块安装在真正选择 Vue/Nuxt 的项目中进行 |

不要对本知识库执行应用 `init`、组件 `add` 或主题生成。CLI 的项目配置跟随具体应用和锁文件，不要求所有消费者安装同一框架。Chakra CLI 的官方使用方式是应用内开发依赖，本次不会为版本查询向知识库添加 React 运行时。

## MCP：按需接入，当前未新增配置

本次沿用 Skill + CLI 方案，没有修改 Codex 的 MCP 配置，也没有进行 MCP 连接实测。官方入口如下：

| 体系 | 服务入口 | 官方说明 |
| --- | --- | --- |
| shadcn/ui | `npx -y shadcn@latest mcp` | [MCP 文档](https://ui.shadcn.com/docs/mcp) |
| Material UI | `npx -y @mui/mcp@latest` | [MCP 文档](https://mui.com/material-ui/getting-started/mcp/) |
| Chakra UI | `npx -y @chakra-ui/react-mcp` | [MCP 文档](https://chakra-ui.com/docs/get-started/ai/mcp-server) |
| Nuxt UI | `https://ui.nuxt.com/mcp`，HTTP | [MCP 文档](https://ui.nuxt.com/docs/getting-started/ai/mcp) |

Nuxt UI Skill 将具体组件 API 查询交给 MCP，真实任务使用这部分能力前应完成连接与查询验证。其他 Skill 的 MCP 专属能力也不能仅凭安装 Skill 宣称已可调用。Chakra Pro 模板需要额外许可和 API Key，本次范围为公开 Skill 与工具入口。

## 验证与许可

9 个全局 Skill 与项目副本共 62 份源文件，逐文件核对官方 Git Blob SHA-1；Windows 检出产生的 CRLF 允许还原 LF 后比较。该检查不代表组件代码、所有示例或页面视觉质量已经验证。

第三方许可见 [许可证目录说明](../third-party-licenses/README.md)，实际安装与命令检查见 [接入验证记录](ui-tooling-validation.md)。
