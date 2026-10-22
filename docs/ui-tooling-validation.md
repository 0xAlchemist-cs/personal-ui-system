# UI 工具接入验证

日期：2026-10-23。范围为本次安装与项目内接入。

## 已执行

- 9 个全局 Skill 的入口存在，名称与安装清单一致。
- 9 个项目副本与全局副本的目录清单一致，共 62 份源文件。
- 每份文件与 [官方来源清单](../tooling/upstream-skill-files.json) 的 Git Blob SHA-1 一致；Windows 文本换行按 CRLF → LF 规范化后比较。
- 四套上游许可证已保存到 `third-party-licenses/`。
- 解析 12 份 JSON、4 份 YAML，并检查 192 处本地 Markdown 引用，未发现缺失目标。
- 根目录没有新增 `package.json`、`components.json` 或 `node_modules`，没有选择应用框架。

## CLI 实测

| 命令 / 环境 | 结果 |
| --- | --- |
| `antd --cli-version`，现有全局 CLI | `6.6.7` |
| `npx --yes shadcn@latest --version` | `4.22.1` |
| Chakra CLI，仅在知识库目录运行 | 提示找不到 `@chakra-ui/react`，不满足其项目环境要求 |
| 在含 CLI 与 React 包的 npx 临时目录运行 Chakra CLI 版本命令 | `3.37.0`，退出码 0 |

Chakra CLI 在加载命令时通过当前工作目录解析 `@chakra-ui/react`。因此，即使 npx 缓存中同时提供 CLI 和 React 包，在本知识库目录执行仍会失败；本次改在已有这两个包的 npx 临时目录中验证。原知识库不添加运行时依赖。

`personal-ui` Skill 的 `quick_validate.py` 校验通过。项目级 Ant Design 接入仍使用 CLI 的 `setup --check` 检查。

## 版本库检查

Git 的暂存内容按官方 Git Blob 哈希核对全部 62 份新增 Skill 文件，并检查自有文件的空白字符。上游 Nuxt UI 的 `navigation.md`、`overlays.md` 自带额外结尾空行；为保留快照原文，第三方 Skill 不进行本库格式清理，单独以来源哈希验证。

## 验证边界

安装校验不证明第三方 Skill 的所有示例正确，也不代表三套设计预设通过页面验收。当前没有应用代码，TypeScript、Lint、Build 和浏览器视觉验收不适用；MCP 没有新增配置或进行连接实测。
