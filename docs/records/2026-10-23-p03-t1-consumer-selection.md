# P03-T1 — 隔离消费者选型记录

> 初始调查与基线建立于 2026-10-23；自动审核服务当时因用量上限未完成收口操作，2026-10-24 恢复核对并交付。历史证据日期保持原值，未将服务错误描述为安全拒绝。

日期：2026-10-23。范围仅为 [Phase 03 Task 1](../superpowers/plans/2026-10-23-phase03-consumer-pilot.md#2-task-1--确定消费者与最小复用范围)：固定消费者基线、技术选型、最小资产与可观察场景。用户已选择“隔离测试场景”。本轮不创建设计快照、不实现 UI，不执行 T2～T4。

## 前置条件与固定版本

- Phase 02 的 [正式验收报告](../../tests/manual/showcase-v1/review.md) 已记录 Gate 02 通过；不能据此认定消费者已通过验收。
- 本库来源：`https://github.com/0xAlchemist-cs/personal-ui-system`，版本 `0.1.0`，固定提交 `16184844550f970570408a79e649a37dd7fe5c0d`。T2 从该提交读取所选资产，不能随工作分支 HEAD 漂移。
- 消费者：`personal-ui-consumer-pilot`，本次位置 `D:/personal-ui-consumer-pilot`，独立 Git 仓库 `main@cdf8c260c51ab67407bd01090a696fd1452f969f`。路径只用于调查定位，不进入设计资产或构建契约。
- 消费者基线仅跟踪 `README.md`、`AGENTS.md`、`.gitignore`；没有应用、依赖声明、锁文件、现有组件、设计快照、远端或部署。README 和 AGENTS 已记录非生产边界与后续任务分工。

实际调查结果见 [T1 调查证据](../../tests/manual/consumer-pilot/t1-discovery.json)。[消费者基线 bundle](../../tests/manual/consumer-pilot/t1-consumer-baseline.bundle) 为 2329 字节，`git bundle verify` 确认包含完整历史及上述提交，可随本库保存并用于恢复基线。它是消费者 Git 备份，**不是 `.personal-ui/` 设计快照**；本轮没有用它独立克隆、安装或构建消费者。

## 技术选型与消费者约束

| 项目 | 选定目标 | 当前事实 |
| --- | --- | --- |
| UI 与运行框架 | React / React DOM `19.3.1`、Ant Design `6.6.7` | 尚未安装；消费者只允许这一套组件体系 |
| 开发与构建 | TypeScript `6.0.3`、Vite `8.3.5` | 尚无消费者配置或运行命令 |
| 风格 | `minimal-saas`：light / comfortable / blue / medium | 只固定选择，尚未消费 Token |
| 依赖依据 | 来源提交的工作台 `package.json` 与 `package-lock.json` | 目标版本沿用已测通路，不把工作台锁文件当作消费者锁文件 |

消费者无已有框架或组件需要迁移。其 AGENTS 要求本地相对引用、官方 Ant Design 组件、一条主题适配、不引入第二组件库或成员管理业务，与本库 [复用策略](../guides/project-reuse.md) 一致。当前没有发现必须覆盖的现有品牌色或布局规则；后续若消费者实际约束变化，先记录冲突，再以消费者约束为准。

`minimal-saas` 的 `validated` 仅覆盖 [风格说明](../../design-system/styles/minimal-saas.md) 列出的 React/Vite/Ant Design 6.6.7 成员管理场景、Windows Chrome 155、375/768/1440px 与真实 200% 缩放。消费者单页、不同环境或后续版本仍需重新验证。通用原则仍为 `draft`，没有随本次选型晋级；源码候选也没有因此成为 `approved` 公共组件。

## 已选择的最小来源清单

下列 **16 个源文件**固定来自上述本库提交。本表是 T2 的输入清单，尚不是消费者的 `includedFiles`，也不表示文件已经复制或引用已经闭合。

| # | 来源文件 | 复用目的 / T2 注意事项 |
| --- | --- | --- |
| 1 | `LICENSE` | 保留 MIT 版权与许可说明 |
| 2 | `prompts/frontend-development.md` | 开发总控规范 |
| 3 | `design-system/principles.md` | 信息层级、状态、响应式及基本无障碍规则；保留 draft 边界 |
| 4 | `design-system/styles/minimal-saas.md` | 所选风格规则及有限验证范围；裁剪引用见下文 |
| 5 | `design-system/styles/minimal-saas.json` | 固定组合与 8 个语义覆盖 |
| 6 | `design-system/tokens/README.md` | 自定义解析契约；裁剪非本次入口链接 |
| 7 | `design-system/tokens/primitives.json` | 完整 68 个原始键，不另造 Token 值 |
| 8 | `design-system/tokens/semantic.json` | 完整 47 个语义键，保留用途与别名 |
| 9 | `prompts/design-review.md` | 按实际场景评审 |
| 10 | `prompts/visual-qa.md` | 浏览器验收规则；保留本地模板引用 |
| 11 | `tests/visual-review-template.md` | 空白验收模板，不作为已执行证据 |
| 12 | `skills/personal-ui/SKILL.md` | T2 制作带来源记录的消费者局部裁剪版，不单独复制后宣称安装完成 |
| 13 | `showcase/app/src/theme/resolve-tokens.ts` | 复用完整值别名解析与错误检查 |
| 14 | `showcase/app/src/theme/resolve-tokens.test.ts` | 保留已有解析契约测试；改写为消费者内部 JSON 导入 |
| 15 | `showcase/app/src/theme/antd-theme.ts` | 将解析后的语义值映射为 Ant Design ThemeConfig，转换 px / 行高 |
| 16 | `showcase/app/src/theme/antd-theme.test.ts` | 保留已有适配检查；消费者安装实际依赖后再运行 |

完整保留三份 Token JSON，可避免逐键裁剪造成遗漏；原始层包含其他颜色值不代表选择了其他风格。数据是本库自定义格式，不能直接传给 `ConfigProvider`。解析器无外部导入，适配器仅从 Ant Design 导入类型；两个测试依赖 Vitest 和本地 JSON。Vitest 的消费者版本、配置及锁定留到 T3 实际初始化时落实，本轮没有安装或执行这些测试。

## 已知引用冲突与 T2 局部改写

| 发现 | 本次选型决定 / 后续处理 |
| --- | --- |
| 原始个人 Skill 指向库内 AGENTS、Brief、全部风格、组件选型、工具接入、Showcase 和生命周期等入口 | 不递归复制全库。T2 仅保留本次适用的流程，改为消费者本地 AGENTS、所选预设、Token 和验收资料；删除不适用分支，记录来源与裁剪，不宣称全局 Skill 或 MCP 已安装 |
| 风格说明引用 `references.md` 和 T5 报告；报告再引用大量工作台证据 | 保留正文中的验证范围，将历史参考与验收证据改为固定来源提交的在线链接，不把它们作为运行依赖。不能为了闭合搬入工作台与截图库 |
| Token README 引用完整风格目录、工作台应用说明 | T2 改为所选风格的消费者本地入口及固定来源提交的历史说明，保留解析契约；不引入其他风格 |
| 两个测试使用工作台深层 JSON 相对导入 | T2 按实际消费者快照目录改写为仓库内相对路径，作为 `localOverrides` 记录；不保留指向来源工作区的导入 |
| 风格已验证，但消费者尚无锁文件、Provider 或 CSS 变量通路 | 无兼容性冲突证据，也无消费者成功证据。T2 只完成快照契约；T3 才初始化应用并核验实际主题与布局 |

消费者 AGENTS 后续只指向自身 `.personal-ui/`。T2 必须建立 manifest，记录来源提交、实际目标文件及局部覆盖，并检查所有保留的本地链接和数据引用；本轮不声称已有 manifest、安装器或闭合校验结果。

明确排除：成员管理业务组件、成员数据与查询逻辑、Stories、Storybook 配置、其他两套风格、其他 UI 库 Skill、整个顶层组件/模板目录，以及 npm 包、Registry、自建 MCP。工作台 `tokens.ts` 硬编码库内层级；`ShowcaseThemeProvider.tsx` 与 `global.css` 混有预览页/工作台布局选择器，也不整份复制。T3 使用消费者内部路径接入所选纯模块，建立适合单页场景的最小主题入口，不跨仓库引用源码或借用来源 `node_modules`。

## 可观察的验收场景与检查边界

选择消费者 README 中的单页主题检查场景：有标签输入、Ant Design 官方按钮、内容容器、本地校验错误与成功反馈。只观察主题颜色、可见焦点、控件尺寸和留白是否来自消费者自己的快照；不扩展为成员管理、真实请求、账户、权限或持久化功能。

T3 应记录解析后的语义值与真实渲染的对应关系，至少覆盖按钮强调色、容器背景/边界、字体与圆角、布局间距和焦点。实际检查 375/768/1440px、真实 200% 缩放、键盘操作、标签、适用的错误/成功/禁用状态；无远程请求和数据列表的场景，应说明加载、首次空数据等不适用项的原因，不能伪造网络状态来补齐验收表。

| 检查 | P03-T1 结果与边界 |
| --- | --- |
| Gate 02 与来源版本 | 已有报告和固定 SHA，可作为选型前置条件 |
| 消费者版本、README / AGENTS / 已跟踪文件 | 已调查并保存文档基线；证据见 T1 调查记录 |
| 消费者锁文件、现有运行组件 | 不存在；不把“无文件”写成检查通过 |
| 资产和覆盖范围 | 16 个源文件已选择；引用风险及 T2 处理已记录 |
| 快照、manifest、引用闭合 | 未执行，属于 T2 |
| 消费者 TypeScript / Lint / 测试 / Build | 未执行：没有应用、依赖或命令，属于 T3 |
| 干净检出、独立安装与构建 | 未执行；bundle 校验不能代替 T3 |
| 浏览器渲染、截图、响应式、200% 缩放 | 未执行，属于 T3；不继承 Showcase 检查结果 |

2026-10-24 恢复后执行 `git -C <消费者目录> status --short --branch`、`rev-parse HEAD`、`ls-tree --name-only HEAD`，均退出 0：消费者工作区干净，提交仍为 `cdf8c26`，只有上述三份文件。`git bundle verify` 退出 0，确认归档历史完整；它不能代替消费者独立构建。Windows 受限沙箱直接在消费者目录运行状态命令曾报工作树访问错误，提升后的同一只读检查成功，未修改 Git 全局配置或修复消费者仓库。

[本轮静态检查](../../tests/manual/consumer-pilot/t1-static-check.json) 核对自有 Markdown 链接、JSON/YAML 语法、16 个来源文件的 Git 对象及变更范围；`git diff --check` 通过。计划、工作台、Token、预设、Brief 和组件源码相对固定来源均未改变。该检查不是消费者 TypeScript、Lint、测试、构建或浏览器验收。

Task 1 的消费者提交、技术选型、最小复用清单和冲突记录已经具备；**Phase 03 试点及 Gate 03 尚未完成**。下一张可执行任务卡为 [P03-T2｜快照打包](../superpowers/plans/2026-10-23-phase03-consumer-pilot.md#p03-t2快照打包)，只按本记录形成消费者内部闭合快照和 manifest，不提前进行 UI 实现或独立构建。
