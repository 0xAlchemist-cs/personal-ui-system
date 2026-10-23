# P02-T4 Stories 与适用状态验证

检查日期：2026-10-23。任务依据为 [Phase 02 任务 4](../../../docs/superpowers/plans/2026-10-23-showcase-v1.md) 与 [冻结 Brief](../../../showcase/user-management.brief.yaml)。本轮先按用户继续指令完成 T3 主分支集成，以 `f81444cdc1fb5273ec8a3b4ad2053b77d84d44dc` 为 T4 基线，再在隔离分支实施。未改写计划或 Brief；T5 与其他阶段未开始，Gate 02 尚未通过。

## 实际变更与复用

- 新增 AppShell、ContentPanel、MemberFilters、MemberTable、EditMemberDialog、MembersPage 共 6 份 `*.stories.tsx`；原有基础主题 Story 补齐说明，总共 7 个 CSF 模块、17 个 Story。
- 直接复用 T2/T3 的实际组件、固定成员数据、`queryMembers` 与共同 `ShowcaseThemeProvider`，没有复制校验、查询或保存业务逻辑。产品组件源码、Token、Brief、依赖和锁文件均未改变。
- `.storybook/StoryFrame.tsx` 与 `stories.css` 仅承接预览底部的用途、输入、事件、依赖、预设/密度和验收范围说明；`.storybook/preview.tsx` 引入实际组件样式，避免隔离加载时遗漏样式。
- 有用参数使用 Storybook 自带 Controls，事件使用 Actions；未额外安装 Docs、测试运行器或其他插件。说明直接在 Canvas 可展开，不宣称配置了自动 Docs 页面。
- 加载仅在 MemberTable Story 用官方 Spin 包装实际表格，并以 inert 阻止下层操作；它不是产品页面新增的网络状态或等待。

## 目录与状态覆盖矩阵

启动后可用左侧搜索查找下列部件。稳定 ID 可通过 `iframe.html?id=<ID>&viewMode=story` 直接访问，完整运行方式见 [应用说明](../../../showcase/app/README.md)。

| 部件 | Story ID | 覆盖与操作 |
| --- | --- | --- |
| ThemePreview | `基础-主题通路--default` | 基础主题、输入、反馈与禁用说明 |
| AppShell | `layout-app-shell--wide-navigation`、`--compact-navigation` | 实际宽屏导航与窄屏抽屉；compact 的 play 在实际窄视口打开抽屉，不伪造 window 尺寸 |
| ContentPanel | `layout-content-panel--information-grouping` | 语义标题、信息分组；Controls 修改标题/说明 |
| MemberFilters | `members-filters--default`、`--combined-query` | 输入事件、初始组合条件、选择状态、保留关键词及清除 |
| MemberTable | `members-table--default`、`--loading`、`--empty`、`--keyboard-focus` | 排序/分页、加载模拟、首次无数据、局部滚动区域的实际焦点 |
| EditMemberDialog | `members-edit-dialog--default`、`--invalid-fields`、`--keyboard-focus` | 有效表单、字段错误/禁用原因、键盘圈定及取消返回 |
| MembersPage | `members-page--default`、`--empty`、`--no-results`、`--saved` | 完整布局、30 条记录、首次无数据、筛选无结果、实际保存反馈 |

上表省略的第二个及后续 ID 共享该行第一个 ID 的 `--` 前缀。

| 计划状态 | 结果 | 实际预览方式与证据 |
| --- | --- | --- |
| 默认 | 通过 | MembersPage Default 与 MemberTable Default：固定 30 条、日期降序、每页 10 条 |
| 加载 | 通过 | MemberTable Loading：可见 Spin、加载文字、inert；Controls 关闭后恢复实际表格操作 |
| 无初始数据 | 通过 | MemberTable Empty 与 MembersPage Empty 使用空集合，显示“暂无成员” |
| 筛选无结果 | 通过 | MembersPage NoResults 通过真实输入触发；输入保留，清除后恢复 10 条首屏记录 |
| 错误 | 通过 | EditMemberDialog InvalidFields 真实输入并失焦，错误与字段关联且保留输入，没有虚构请求错误 |
| 成功 | 通过 | MembersPage Saved 执行实际编辑与保存，页面记录改变、显示刷新恢复提示；提示遵循原有约 3 秒关闭行为 |
| 禁用 | 通过 | 无效表单保存禁用，原因就地可见；停用成员本身仍可编辑 |
| 焦点 | 通过（T4 范围） | 搜索/状态选择、表格排序与分页、滚动区域、抽屉、表单 Tab/取消返回均可操作；T5 完整键盘旅程仍待执行 |

## 检查命令与环境

依赖固定版本沿用 T3：React 19.3.1、Ant Design 6.6.7、Storybook 10.6.3、TypeScript 6.0.3、Vite 8.3.5、Vitest 5.0.5、Oxlint 1.88.0。应用检查使用 Node 22.15.0 / npm 10.9.2，没有安装新依赖。

| 检查 | 结果 |
| --- | --- |
| `npm.cmd --prefix showcase/app run typecheck` | 通过，覆盖应用、Stories、测试与配置 |
| `npm.cmd --prefix showcase/app run lint` | 通过，Oxlint 无警告 |
| `npm.cmd --prefix showcase/app run test` | 通过，原有 3 个文件、78 项测试 |
| `npm.cmd --prefix showcase/app run build` | 通过，产物与 T3 相同，说明产品源码未引入 Story 内容；仍有大包体提示 |
| `npm.cmd --prefix showcase/app run build-storybook` | 通过，17 项索引及静态产物生成；仍有大包体提示 |
| `antd lint ./src --version 6.6.7 --format json` | 通过，0 问题、0 跳过、partial=false |
| 独立静态评审与说明布局复核 | 通过，发现的说明遮挡问题已修复并复测 |

浏览器使用本机已有 Playwright 1.62.1 / Node 24.22.1 驱动独立无头 Chrome 155.0.8059.81；Windows 10.0.26100，zh-CN、UTC、deviceScaleFactor=1、100% 缩放、reduced motion=reduce。字体沿用系统栈 Segoe UI / PingFang SC / Microsoft YaHei / sans-serif，无外部字体。日期仍显示固定 ISO UTC 字符串的日期部分。

本轮运行 `npm.cmd --prefix showcase/app run storybook -- --ci --port 6014`，只绑定回环地址；浏览器和服务在同一环境。预览与管理界面组使用 1440×900、375×812；筛选与弹窗组使用 1440×900、768×900、375×900，按旅程分别记录。没有为工作台加入 Playwright 依赖、CI 或截图回归基线。

## 浏览器证据

- [预览与管理界面结果](t4-evidence/root-browser-checks.json)：12 个 Story 全部实际加载，相关 play 正常结束；额外 3 项管理界面检查覆盖 Controls、Actions 和搜索。无 error/pageerror；管理页有 1 条来自 Storybook 自身 `sb-manager/globals-runtime.js` 的未来 ariaLabel 必填提醒，单列保留。
- [筛选与弹窗结果](t4-evidence/forms-browser-checks.json)：5 个 Story、7 个视口案例全部通过，覆盖 1440、768 和 375px；无 console/page/play 错误，未出现页面横向溢出。
- [说明可读性复核](t4-evidence/docs-browser-checks.json)：页面与 AppShell 在 1440/375px 共 4 项通过；滚动后实际命中说明文字、可展开且元数据不被侧栏遮挡。

上述前两份记录合计覆盖全部 17 个 Story。未把首次出现的中间 `storyFinished` 当作完成：预览组等待最终 finished、play 键盘锁解除，并核对 console/page error 与实际可见状态；筛选与弹窗组还显式监听 play 异常事件。仅出现“已渲染”不能视为交互通过。

| 截图 | 场景 |
| --- | --- |
| [加载](t4-evidence/table-loading-1440.png) | Story 专用加载，1440px |
| [无初始数据](t4-evidence/page-empty-1440.png) | 完整页面 Empty，1440px |
| [保存成功](t4-evidence/page-saved-1440.png) | 实际保存与消息，1440px |
| [字段错误](t4-evidence/dialog-invalid-1440.png) | 无效字段及保存禁用，1440px |
| [弹窗焦点](t4-evidence/dialog-focus-375.png)、[导航](t4-evidence/navigation-375.png) | 375px 实际弹窗/抽屉 |
| [用途与接口说明](t4-evidence/docs-1440.png) | 说明展开且未被固定侧栏遮挡 |
| [管理界面](t4-evidence/manager-controls-1440.png) | 三个有用 Controls，参数变化后的真实预览 |

截图已实际查看；它们是本轮检查证据，不是视觉回归基线。

## 失败、修复与限制

1. 隔离筛选 Story 使用异步 args 通道控制快速输入时出现丢字。改为命名 React host 同步维护受控初始查询；Controls 改初始快照时重置预览，不另写成员查询逻辑。实际快速输入与事件断言重新通过。
2. Select 内部 class 与隐藏 aria-live 文本使初始选择器不可靠，改为实际选中值的 title 定位；字段帮助显示等待使用实际可见性，避免动画中途误判。
3. 完整布局的说明原先按视口居中，被固定侧栏覆盖。仅调整 Story 专用容器的桌面偏移，1440/375px 的点击命中、展开与文字可读性复核通过。
4. 管理页 Controls 的标签有参数数量、样式开关覆盖原生 input，初始自动化定位/点击不适用；改用正确标签和键盘 Space 操作，没有更改或绕过产品代码。

**未覆盖 / 下一张任务卡：P02-T5｜正式页面验收与收口。** 200% 实际缩放、所有目标视口的完整页面/Stories 验收矩阵、完整键盘旅程、对比度和辅助技术核对、Gate 02 及资产成熟度判断均留到任务 5。本轮不自动提升任何预设或公共资产。

**不适用：** 真实网络错误/重试、服务端账号权限、持久化。没有伪造上述业务状态。

**已知非阻断限制：** 应用和 Storybook 大包体提示仍在；管理页存在上述 Storybook 未来 API 提醒；本轮只验证所列 Chrome/Windows 环境。CompactNavigation 的自动打开依赖实际窄视口，宽屏跳过该动作并显示桌面布局，此条件不是小屏验证证据。

实现依据以安装版本类型与源码为准，并参考官方 [Args](https://storybook.js.org/docs/writing-stories/args)、[Play function](https://storybook.js.org/docs/writing-stories/play-function)、[Ant Design Spin](https://ant.design/components/spin/)；未据此升级依赖或扩大工具接入范围。
