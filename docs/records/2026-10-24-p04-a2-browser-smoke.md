# P04-A2 — 浏览器冒烟与焦点裁切修复

日期：2026-10-24。仅执行 [Task A2](../superpowers/plans/2026-10-23-phase04-quality-and-distribution.md#task-a2--浏览器冒烟与视觉回归)，复用既有成员页面、固定数据及 A1 的 CI。未执行 A3 或分发轨道；不重写计划、Brief 或 Token 契约。

**A2 已完成。** 最终生产构建浏览器检查 **11/11** 通过，额外 `--repeat-each=2` 的 **22/22** 通过，均零重试；[真实 GitHub CI 40086757728](https://github.com/0xAlchemist-cs/personal-ui-system/actions/runs/40086757728) 的两项 job 也成功，没有建立像素比较基线。下一张为 P04-A3，Gate 04 尚未收口。

## 版本、复用与变更

[前置核对](../../tests/manual/browser-a2/preflight.json) 记录主目录与隔离分支基线均为 `bf69f5fb5c28f1bce5d550cd4e48ba1f02d7f230`，主目录干净，A1 与 Gate 03 证据仍可用。实现提交为 `0f18bd3217aae1223688100e1c883deaa319f322`。

- 在 Showcase 自己的 package/lock 中增加开发依赖 **@playwright/test 1.62.1**，没有升级 React / Ant Design / Vite 等运行依赖。锁文件只增加 Playwright 依赖链及其 macOS 可选依赖，不影响独立消费者。
- 新增 [Playwright 配置](../../showcase/app/playwright.config.ts)、[公共 fixture](../../showcase/app/e2e/fixtures.ts)、[成员旅程](../../showcase/app/e2e/members.spec.ts) 与 [窄屏导航旅程](../../showcase/app/e2e/navigation.spec.ts)；沿用现有类型、Lint、Vitest、应用和 Storybook 构建。
- 扩展既有 Quality workflow，安装固定 Chromium 及 Linux 系统依赖，再执行浏览器检查；浏览器步骤成功或失败后上传 HTML/JSON/截图/trace，保留 7 天。没有忽略失败、自动重试或自动批准快照。
- 浏览器发现一项实际缺陷后，仅修改 MemberTable 编辑按钮的获焦滚动，以及既有 CSS 按钮规则的滚动留白。复用原 8px 变量，未改 Token 值、页面需求或消费者资产。
- 更新当前状态入口与应用运行说明；原有计划、历史验收、公共资产成熟度及消费者固定来源保持原有边界。

## 选择的旅程与可观察结果

| 旅程 | 范围与断言 | 实例数 |
| --- | --- | --- |
| 筛选、分页、排序、清除 | 固定成员姓名集合和数量、关键词大小写、AND 状态筛选、关键词/状态变化返回第 1 页、清除后保留排序 | 三视口，共 3 |
| 编辑校验、取消、保存和刷新 | 错误与字段关联、禁用原因、输入保留、双向 Tab 圈定、Escape 返回触发器、修剪后值与成功提示、刷新恢复合成数据 | 三视口，共 3 |
| 编辑后唯一匹配退出 | 保留关键词、焦点回列表标题、真实空态、清除前控件完整处于横向视口内、清除后出现修改后的记录 | 三视口，共 3 |
| 抽屉与局部横向滚动 | Enter/Escape/关闭按钮、双向圈定和焦点返回；方向键滚动表格、编辑按钮完整可见及弹窗返回 | 768 / 375，共 2 |

每项从新页面和固定的 30 条合成记录开始；fixture 检查初始/结束的文档横向溢出、未捕获错误及浏览器 console error。表格允许局部滚动；不允许用页面整体横向溢出来隐藏问题。没有固定 sleep、外网业务数据或真实账号依赖。

## 原始失败与最小修复

首轮 **11 项失败**：状态选择器不支持测试假设中的 Home 复位；必填标记使 textbox 的精确可访问名称带星号。修正测试为 Enter 展开、明确状态差值的方向键选择及关联 label 定位；保留原有成员数量、错误、焦点和布局期望，没有将预期 9 行改为错误的 6 行。[首轮 JSON](../../tests/manual/browser-a2/attempt-1/results.json)、[原始 stdout](../../tests/manual/browser-a2/development-e2e.txt) 及同目录两类代表截图/context/trace 保留了实际失败。

第二轮 **10 通过、1 失败**：[原始报告](../../tests/manual/browser-a2/attempt-2/results.json) 和 [日志](../../tests/manual/browser-a2/attempt-2/e2e.txt) 显示 768px 下原生 focus 让编辑按钮仅露出 8/60px，可见比例约 0.133；这是界面缺陷。[原始失败截图](../../tests/manual/browser-a2/attempt-2/test-failed-1.png) 与 trace 已保留。

[定量复现](../../tests/manual/browser-a2/focus-diagnostic.json) 使用原生产构建；[修复诊断](../../tests/manual/browser-a2/focus-fixed.json) 使用修改后的 Vite dev 源码：获焦时 `scrollIntoView({ block: 'nearest', inline: 'nearest' })`，并以原有 `--pui-space-inline` 设置滚动留白。768px 按钮完整可见，距滚动区域右侧 11px；375px 余量 24px，无文档横向溢出。[768 修复截图](../../tests/manual/browser-a2/focus-fixed-768.png) 与 [375 修复截图](../../tests/manual/browser-a2/focus-fixed-375.png) 可核对焦点圈。之后在最终生产构建上完整执行 11 项和重复 22 项通过，未弱化 `toBeInViewport({ ratio: 1 })`。

编写配置时 TypeScript 曾拒绝顶层 `reducedMotion`，按安装包的实际类型改放 `contextOptions`；未用类型断言绕过。此处记录原因，原始类型错误日志未归档。官方 Ant Design [Button API 核验](../../tests/manual/browser-a2/antd-button-api.txt) 与 [组件 lint](../../tests/manual/browser-a2/antd-member-table-lint.txt) 已保存。

## 环境与复现命令

[实际环境](../../tests/manual/browser-a2/environment.json) 与完整 [生产报告](../../tests/manual/browser-a2/results.json) 记录 Windows `10.0.26100`、Node **22.15.0**、npm **11.16.0**、Playwright **1.62.1**、Chromium **151.0.7922.34 / revision 1234**。浏览器使用包内 headless shell，未借用系统 Chrome 或外部 Playwright。

固定参数为 1440×900 / 768×1024 / 375×812、DPR 1、zh-CN、UTC、light、reduced motion、默认缩放的新 context、单 worker、零重试；每次用合成数据重新加载。环境附件的 headingFontFamily 是计算后的 CSS 字体栈，不代表实际中文字形字体。

在已安装 Node/npm 的仓库执行：

```sh
npm ci --prefix showcase/app
cd showcase/app
npx --no-install playwright install chromium
npm run build
npm run test:e2e
npm run test:e2e -- --repeat-each=2
```

Linux 首次安装用 `npx --no-install playwright install --with-deps chromium`。配置自行管理 `127.0.0.1:5187` preview；拒绝复用已有服务器，端口冲突会失败。HTML 位于 `playwright-report/`，机器结果与 trace 位于 `test-results/`；查看方式见 [应用说明](../../showcase/app/README.md#检查与构建)。生成目录不纳入 Git，选择的本地原始证据另存于本报告目录链接的位置。

| 本地检查 | 实际结果与原始输出 |
| --- | --- |
| 类型 / Lint | 通过；[typecheck](../../tests/manual/browser-a2/typecheck.txt)、[lint](../../tests/manual/browser-a2/lint.txt)，build 也再次执行类型检查 |
| 原有单元测试 | 78 通过；[Vitest](../../tests/manual/browser-a2/unit-tests.txt) |
| 应用 / Storybook | 均通过；[build](../../tests/manual/browser-a2/build.txt)、[Storybook](../../tests/manual/browser-a2/storybook-build.txt) |
| 知识契约 / 正负例 | 通过；[check](../../tests/manual/browser-a2/knowledge.txt)、[39 项质量测试](../../tests/manual/browser-a2/quality-tests.txt)，Windows 为 38 通过、1 项大小写语义跳过 |
| 生产浏览器 | 11 通过，0 失败/跳过/flaky；[stdout](../../tests/manual/browser-a2/e2e.txt) / [JSON](../../tests/manual/browser-a2/results.json) |
| 额外重复实验 | 22 通过，0 失败/跳过/flaky；[stdout](../../tests/manual/browser-a2/repeat.txt) / [JSON](../../tests/manual/browser-a2/repeat-results.json)；一次有限重复不代表长期无波动 |

已查看最终生产构建的 [1440](../../tests/manual/browser-a2/default-desktop.png)、[768](../../tests/manual/browser-a2/default-tablet.png)、[375](../../tests/manual/browser-a2/default-mobile.png) 首屏全页附件及焦点修复图，检查可见布局；它们属于诊断/实测证据。

## CI、波动与边界

[CI 记录](../../tests/manual/browser-a2/ci-run.json) 对应实现 SHA `0f18bd3217aae1223688100e1c883deaa319f322`，Ubuntu 24.04 的两个干净 job 均成功：完整契约校验、39 项质量测试（无跳过）、类型/Lint、78 项应用测试、应用/Storybook 构建及 11 项浏览器检查通过。原始解码日志为 [knowledge](../../tests/manual/browser-a2/ci-knowledge.txt) 与 [Showcase](../../tests/manual/browser-a2/ci-showcase.txt)；后者记录各视口的实际 Chromium 151.0.7922.34、Node、UTC/zh-CN/DPR 等参数。浏览器报告 artifact `12557970229` 已实际上传，7 天有效，ID、大小与摘要保存在记录中。

[一致性记录](../../tests/manual/browser-a2/verification.json) 核对实现源码/配置与成功 CI 一致、冻结契约未变、两份生产结果的实际计数及证据文件 SHA-256。独立审阅未发现阻断问题。收口文档和证据作为后续提交，继续接受同一 workflow 检查；本轮实际上传的是成功报告，CI 未另造失败实验，本地两轮真实失败的截图和 trace 已验证留存。

**本轮不启用像素比较基线。** 历史人工验收是 Windows 系统 Chrome 环境，当前自动化是包内 Chromium，Ubuntu runner 的字体和实际字形渲染也不同；没有已人工核准的 Linux 参考图。当前高风险问题能以行为、焦点、几何边界断言验证。现有历史/本轮截图不转称回归基线，配置 `updateSnapshots: 'none'`，未添加 `toHaveScreenshot` 或自动更新流程。将来若确有视觉回归需求，再按原任务卡固定 OS 镜像、字体、浏览器和动态来源并人工审核。

保留应用/Storybook 既有大于 500 kB 的警告，以及本地 FORCE_COLOR/NO_COLOR 的进程提示；未提高阈值或抑制产品错误。原始 TXT 按字节保留，目录属性避免换行转换；空白检查排除原始 TXT，其余源码/文档/JSON 正常检查。

这里只验证 Chromium 中的窄视口与局部键盘旅程，导航测试直接聚焦入口/表格/编辑按钮，不称本轮完整纯 Tab 全站验收。未重做全部 17 个 Story、原生 200% 缩放、真实移动设备、屏幕阅读器或多浏览器；既有 P02/P03 证据继续按原范围保留。没有真实后端、消费者自动浏览器套件、强制分支保护或公共组件认证。

下一张可执行任务卡是 **[P04-A3｜质量收口](../superpowers/plans/2026-10-23-phase04-quality-and-distribution.md#p04-a3质量收口)**。本轮只提供 A2 已执行证据，不提前编写 A3 的质量职责或异常升级流程；分发条件尚未触发，资产成熟度未晋级。
