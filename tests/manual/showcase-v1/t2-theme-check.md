# P02-T2：最小应用与主题通路验证

日期：2026-10-23。执行基线 `6e80db733b4b21dfa402b722755d52404285ce19`。对应 [Phase 02 任务 2](../../../docs/superpowers/plans/2026-10-23-showcase-v1.md)；需求沿用 [冻结 Brief](../../../showcase/user-management.brief.yaml)。本记录补充 T2 证据，[T0/T1 初稿](review.md) 保留其当时的检查结果。

## 交付范围

- 在 `showcase/app/` 新建 React + TypeScript + Vite 应用、固定依赖与锁文件、完整检查脚本和 Storybook 配置。
- 复用原始/语义 Token 和 `minimal-saas`，新增 Resolver、Ant Design 主题适配器及共用 Provider；不修改这些设计数据。
- 一个基础控件预览和一个对应 Story 用于验证主题，尚未实现成员管理数据、表格、查询、编辑或 T4 的完整状态展示。
- 补充使用说明，并修正仓库入口中“尚无应用”等过时能力描述；没有改写阶段计划、冻结 Brief、其他阶段或第三方 Skill。

## 环境与依赖依据

应用检查使用 Windows、Node `22.15.0`、npm `10.9.2`。版本核对来自官方文档和 npm Registry 的版本、engines、peerDependencies；实装固定版本见 [应用说明](../../../showcase/app/README.md) 与 [锁文件](../../../showcase/app/package-lock.json)。`npm ls --depth=0` 退出码 0，实际依赖与清单一致。

T0/T1 中普通 `npm` 报 `MODULE_NOT_FOUND`。本次进一步确认 npm 本体存在且可运行；PowerShell 包装器会转向受限的用户级路径，不能据该报错断言全局安装缺失。本次使用 `npm.cmd`（版本 10.9.2）执行安装和脚本，没有重装全局 npm 或变更配置。

应用由官方 `create-vite@9.3.1 --template react-ts` 模板建立，保留其 Oxlint 选型。兼容性核验没有把最新版本等同于合适版本，TypeScript 固定为模板采用的 6.0.3。官方 `antd` Skill 已读取，编写前查询 ConfigProvider、App、Button、Input 的 6.6.7 API 和 App 上下文示例，编写后执行官方 lint。

## 已执行检查

以下 npm 命令在 `showcase/app/` 中通过 `npm.cmd` 执行。

| 命令 / 检查 | 结果 |
| --- | --- |
| `npm install --no-audit --no-fund` | 退出码 0；生成固定依赖树的锁文件，没有根目录运行时依赖 |
| `npm ci --no-audit --no-fund` | 退出码 0；在隔离分支按锁文件干净重装后，63 项测试、Lint、应用构建（含类型检查）与 Storybook 构建再次通过 |
| `npm run typecheck` | 退出码 0；严格检查应用、测试、Stories 和全部 TS 配置 |
| `npm run lint` | 退出码 0；Oxlint 配置源于官方模板，警告按失败处理 |
| `npm run test` | 退出码 0；2 个测试文件、63 个用例通过，包含实际 JSON 解析、错误分支、覆盖、不变性及主题尺寸转换 |
| `npm run build` | 退出码 0；包含类型检查，Vite 生产构建成功 |
| `npm run build-storybook` | 最终退出码 0；Storybook manager 与 preview 构建成功 |
| `antd lint ./src --version 6.6.7 --format json`（经 npm exec 运行） | 退出码 0；`issues=[]`，无跳过文件，`partial=false` |
| 独立只读审阅 | 未发现 T2 阻断问题；核对了错误处理、共享 Provider、类型覆盖、文件访问范围、锁文件与任务边界 |
| 浏览器主题烟雾检查 | 退出码 0；下面列出的样式、键盘反馈、禁用说明与窄屏检查全部通过，最终无页面或控制台错误 |
| 文档与版本库检查 | 320 处本地 Markdown 链接有效，JSON/YAML 可解析；暂存差异空白检查通过，原计划、冻结 Brief、Token 数据与第三方 Skill 未改动 |

Storybook 首轮在受限环境中因祖先目录读取及用户设置写入权限失败；未弱化检查，提升执行权限后原构建命令通过。应用与 Storybook 的构建仍有超过默认 500kB 的 chunk 提示（应用主 JS 约 543kB，gzip 约 177kB）；没有上调阈值隐藏提示，本次未进行无实际路由需求的拆包。

安装器提示 esbuild 的 postinstall 未被自动批准；实际平台二进制可用，Vitest 与两种构建通过。本次没有全局放开安装脚本。

## 实际浏览器证据

使用现有 Playwright `1.62.1` 与系统 Chrome `155.0.8059.81`，启动独立无头 context，不使用用户浏览器 profile，也没有为本项目新增浏览器测试依赖。自动化工具运行时为 Node `24.22.1`，与应用检查使用的 Node `22.15.0` 分开记录。

环境：Windows `10.0.26100`，视口 1440×900 和 375×900，DPR 1、中文 locale、UTC、默认缩放、减少动态效果。应用与 Storybook 分别启动在回环地址 5182 和 6012 端口，测试后停止本轮进程。

| 检查 | 实测结果 |
| --- | --- |
| 同一主题 | 两入口均为强调色 `#2563eb`、画布 `rgb(248,250,252)`、主按钮 `rgb(37,99,235)` |
| 尺寸与排版 | 两入口均为按钮高 40px、圆角 8px、正文 14px、行高 22.4px；对应 1.6 的语义行高 |
| 布局变量与断点 | 宽屏页边距 32px；375px 下为 16px、单列，页面无横向溢出 |
| 上下文与键盘 | 聚焦名称输入后 Tab 到主按钮，Enter 成功显示提示；页面和 Story 都正常，无静态反馈上下文告警 |
| 禁用原因 | 保存预览按钮实际禁用，旁边说明可见，不仅依赖 tooltip |
| 控制台 | 最终无页面异常或控制台 error |

浏览器检查初次因 Ant Design 两字中文按钮自动插入空格而未匹配“保存”；将定位修正为匹配该实际可访问名称后继续同一禁用断言。随后定位到两入口缺省 `favicon.ico` 的真实 404，补充显式 favicon 声明后，保留零错误断言并复测通过。

- [应用宽屏截图](t2-evidence/t2-app-1440.png)
- [应用窄屏截图](t2-evidence/t2-app-375.png)
- [Storybook iframe 截图](t2-evidence/t2-storybook-1440.png)
- [浏览器实测数据](t2-evidence/theme-smoke.json)

已人工查看上述截图，确认基础预览层级、对齐、分组和窄屏堆叠正常。这些是 T2 的一次性验证证据，不是视觉回归基线或成员管理页面的正式视觉验收。

## 完成边界与下一张卡

P02-T2 的最小应用、共享主题、检查脚本与构建交付已完成。63 个用例和基础预览并不证明完整成员管理功能、全部状态、768px 页面布局或所有无障碍场景已通过；这些仍按 T3～T5 实施。风格和模式保持 `draft`，Gate 02 尚未通过。

下一张可执行任务卡为 **P02-T3｜核心交互**：先读取冻结 Brief，再实现固定成员数据、查询、分页、编辑及焦点行为。本轮未执行。

2026-10-23，用户明确授权后，已将 `codex/p02-t2` 的 `480f89b` 快进合入 `main`，原实现提交为 `b4c7d5`。本段替换此前的“待授权集成”状态，不改变 T2 的功能或验收范围。

在主目录再次按锁文件执行 `npm ci --no-audit --no-fund`，随后 63 项测试、Lint、应用构建（含 TypeScript 检查）和 Storybook 构建均退出 0；不依赖临时工作树。构建保留前述体积提示。集成记录随 `main` 推送 GitHub，最终提交号以本记录所在的 Git 提交为准；下一项仍为 P02-T3，本轮未实施。
