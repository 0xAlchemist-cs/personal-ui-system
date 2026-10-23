# P03-T3 — 独立消费与真实构建验证

日期：2026-10-24。只执行 [Task 3](../superpowers/plans/2026-10-23-phase03-consumer-pilot.md#4-task-3--完成一次真实消费与独立构建)，沿用 [T1 场景与选型](2026-10-23-p03-t1-consumer-selection.md) 和 [T2 快照](2026-10-24-p03-t2-snapshot.md)，未重写计划或执行 T4、Phase 04。

**本卡验收通过。** 独立消费者从 Git 归档恢复到全新目录，在任务进程空 `NODE_PATH` 环境中按自身锁文件安装、检查、构建并运行；三视口、真实 200% 缩放与路径独立性已有实际证据。Gate 03 所需技术证据已经具备，T4 的收口、Gate 核对及 Phase 04 准入结论仍待下一张任务卡。

## 固定版本与真实变更

| 项目 | 本轮事实 |
| --- | --- |
| 知识库起点 | `f77b391d096f19a950c1c4f82d074f044a4d9e71`，main 与 origin/main 一致、工作区干净 |
| 资产固定来源 | `16184844550f970570408a79e649a37dd7fe5c0d`，系统 0.1.0；没有漂移到当前知识库 HEAD |
| 消费者起点 | `d16a8e8be90161dca1361b43703fafabba2ecd26`，独立仓库、工作区干净 |
| 应用实现提交 | `37a225f7fe75e04f60cfd81ffa82d576cbf75c7d` |
| 最终验收提交 | **`a349428854e7cf203ee29d0211ef8a7572bdff10`**，追加 favicon 修复；消费者 main 已快进保存 |
| 实际依赖 | React / DOM 19.3.1、Ant Design 6.6.7、TypeScript 6.0.3、Vite 8.3.5、Vitest 5.0.5、Oxlint 1.88.0；全部直接依赖固定版本，见安装日志及消费者锁文件 |
| 环境 | Windows 11 `10.0.26100`；安装/构建 Node 22.15.0、npm 11.16.0；外部 QA Node 24.22.1、Playwright 1.62.1、系统 Chrome 155.0.8059.81 |

消费者新增 `package.json`、自己的 `package-lock.json`、`index.html`、`tsconfig.json`、Vite/Vitest 配置，以及 `src/main.tsx`、`theme.ts`、`theme-probe.tsx`、`styles.css`。更新根 README、AGENTS、统一 LF 约定及 manifest 中对应的 **3 个集成文件哈希**；快照校验器与 16 个复制资产均未修改。[最终 manifest 审计副本](../../tests/manual/consumer-pilot/t3-manifest.json) 和 [来源/归档核验](../../tests/manual/consumer-pilot/t3-source-check.json) 保留逐项记录。

复用本地快照的原始/语义/预设 JSON、既有 Resolver、Ant Design 适配器、两份主题测试与设计规范。消费者只新增单页所需的入口和布局：JSON → Resolver → 适配器 → 单一 ConfigProvider；同一组解析值生成容器 CSS 变量。自定义 JSON 没有直接传给 Provider。768px 媒体条件对应固定快照断点；颜色、字体栈、主要尺寸、圆角和留白读取语义变量，字重、标题行高、网格比例等仍为此页实现选择。官方 API 在编码前按 6.6.7 通过 CLI 查询，官方 AntD Lint 0 issue；[开发日志与查询](../../tests/manual/consumer-pilot/t3-evidence/development/) 可核对。

页面只有带标签必填输入、验证/重置按钮、持续成功反馈、禁用远程同步及可见原因、只读预设说明。没有成员管理业务、请求或数据列表；加载和空列表状态不适用，不以假请求或演示延迟补齐。

## 干净检出、命令与独立性

[完整消费者 Git bundle](../../tests/manual/consumer-pilot/t3-consumer-validated.bundle) 为 **61,679 字节**，SHA-256 `03914fa6d59f4972e3cc9fd77c761a4ae2fc95a6f2b6e26c34647030618c00f8`，`git bundle verify` 确认完整历史。它保存源码与锁文件，不包含安装依赖和构建产物，也不是组件分发包。

实际操作从此 bundle `git clone --branch main` 到全新目录 `p03-t3-clean-final`，起点无 `node_modules`，有自己的 `.git/objects`，没有 worktree 或 Git alternates。可在知识库根目录按下列顺序恢复到一个不存在的新目录；Windows 使用 `npm.cmd`，并只在任务进程内清空继承的 `NODE_PATH`：

```powershell
git clone --branch main tests/manual/consumer-pilot/t3-consumer-validated.bundle ../consumer-check
Set-Location ../consumer-check
Remove-Item Env:NODE_PATH -ErrorAction SilentlyContinue
npm.cmd ci --no-audit --no-fund
node scripts/check-personal-ui.mjs
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd ls --depth=0 --json
npm.cmd run preview -- --host 127.0.0.1 --port 5186 --strictPort
```

实际执行器 [clean-check.ps1](../../tests/manual/consumer-pilot/t3-tools/clean-check.ps1) 记录继承值与有效环境，结束时恢复任务进程变量，不修改用户或系统配置。npm 可以使用正常下载缓存；未借用来源仓库的 `node_modules`。首次检出和最终重新检出均有日志，**正式结论以 [clean-final](../../tests/manual/consumer-pilot/t3-evidence/clean-final/clean-check.json) 为准**。

| 检查 | 最终结果 / 证据 |
| --- | --- |
| `npm ci` | 退出 0，独立安装 113 个包；[原始输出](../../tests/manual/consumer-pilot/t3-evidence/clean-final/install.txt) |
| 快照校验 | 21 项文件哈希、53 个 Markdown 链接（46 个本地）、9 个快照相对导入、68/47/8 Token 图通过；[输出](../../tests/manual/consumer-pilot/t3-evidence/clean-final/snapshot.txt) |
| TypeScript / Lint | 严格类型及本轮应用、主题模块、配置扫描均退出 0；[TS](../../tests/manual/consumer-pilot/t3-evidence/clean-final/typecheck.txt)、[Lint](../../tests/manual/consumer-pilot/t3-evidence/clean-final/lint.txt) |
| Vitest | 显式包含隐藏 `.personal-ui/theme`；2 文件、**63 项通过**；[原始输出](../../tests/manual/consumer-pilot/t3-evidence/clean-final/test.txt) |
| Build | 退出 0；JS 603.87 kB / gzip 198.22 kB，CSS 3.97 kB；保留大于 500 kB 的默认警告；[原始输出](../../tests/manual/consumer-pilot/t3-evidence/clean-final/build.txt) |
| 锁文件与工作区 | 安装/检查前后锁文件 SHA-256 一致、Git 工作区干净；11 项直接依赖实际版本见 [npm ls](../../tests/manual/consumer-pilot/t3-evidence/clean-final/dependencies.txt) |
| 路径与依赖 | [独立性扫描](../../tests/manual/consumer-pilot/t3-evidence/independence-check.json) 退出 0：33 个跟踪文件、19 个运行文件、38 个字面导入；157 个锁条目无本地依赖，11 项直接依赖实路径均在新检出内；无跨库路径、alias、symlink、alternates 或全局 NODE_PATH 回退 |

扫描器 [independence-check.mjs](../../tests/manual/consumer-pilot/t3-tools/independence-check.mjs) 的字面引用审计不是完整语法/安全审计。实际浏览器同时确认无需外部 UI 资源；报告中的环境路径和 Git 归档恢复位置不是消费者运行依赖。快照脚本输出的 `notExecuted` 描述该脚本自身范围，它不执行安装或 UI 检查；不能把该字段误读为本轮没有执行另行留证的命令。

本库的 [静态检查](../../tests/manual/consumer-pilot/t3-static-check.json) 核对自有链接、JSON/YAML 和变更范围；既有计划、Token、预设、工作台与其他阶段源码未改。[证据一致性检查](../../tests/manual/consumer-pilot/t3-delivery-check.json) 确认最终安装、浏览器、缩放、路径报告指向同一个消费者提交，锁文件与归档哈希相符。原始 TXT 输出保留工具产生的空行和行尾空格，Git 空白检查排除这些日志，覆盖其余文档、脚本和 JSON。

## 实际页面与可观测主题

[浏览器执行器](../../tests/manual/consumer-pilot/t3-tools/browser-check.cjs) 使用独立安装的宿主 Playwright，通过 `PLAYWRIGHT_MODULE` 指定，未加入消费者运行依赖。命令为 `node <runner> --project <clean-checkout> --out <evidence-directory> --url http://127.0.0.1:5186/`，访问的是新检出自身的 `dist` 预览。每个视口均使用 zh-CN、UTC、DPR 1 和减少动态效果设置；[实际样式与行为 JSON](../../tests/manual/consumer-pilot/t3-evidence/browser/browser-check.json) 保存逐项 expected/actual。

| 语义来源 | 实际渲染与检查 |
| --- | --- |
| `color.canvas/surface/border/accent` | 页面 `#f8fafc`、面板白底与 `#e2e8f0` 边界、主按钮 `#2563eb` 均匹配；边界用于分组 |
| `font.body/text.body` | Segoe UI / Microsoft YaHei 等字体栈、14px 正文生效 |
| `radius.control/panel` | 控件 8px、面板 12px |
| `size.control/controlTouch` | 桌面按钮 40px、输入 computed 39.9844px；手机两者 44px。仅高度比对允许 0.05 CSS px 的 Chromium 子像素舍入，并保留原值 |
| `space.page/pageMobile/panel/inline` | 桌面页内边距 32px、手机 16px、区块 24px、动作间距 8px |
| `color.focus/error/success` | 实际键盘焦点为蓝色可见轮廓；错误、成功文本和成功背景匹配语义值 |

375 / 768 / 1440px 都完成键盘必填与纯空白错误、有效提交、编辑后清旧成功、重置与输入焦点、原生禁用及关联原因、40 字符限制/长值不溢出、可见标签和错误描述关联、常驻空 status 可访问树、减少动态效果检查。页面无水平溢出，page/console 错误为 0。主按钮文字对比度 5.169、正文 17.063、错误 6.470、成功 4.791、焦点对面板 5.169；这些是已采样颜色与行为，不是完整 WCAG 或真实读屏认证。

已目视检查 [375px 默认](../../tests/manual/consumer-pilot/t3-evidence/browser/default-375.png)、[768px 默认](../../tests/manual/consumer-pilot/t3-evidence/browser/default-768.png)、[1440px 默认](../../tests/manual/consumer-pilot/t3-evidence/browser/default-1440.png)、[手机错误](../../tests/manual/consumer-pilot/t3-evidence/browser/error-375.png)、[桌面成功](../../tests/manual/consumer-pilot/t3-evidence/browser/success-1440.png) 及三宽度焦点截图，未发现阻断布局问题。

### 真实 200% 缩放

[原生缩放执行器](../../tests/manual/consumer-pilot/t3-tools/zoom-check.cjs) 在自己的临时 Chrome profile 中操作 Settings 的 Page zoom，独立读取 `settingsPrivate`。不是 CSS zoom、DPR 模拟或 pinch zoom。[最终 JSON](../../tests/manual/consumer-pilot/t3-evidence/zoom/zoom-check.json) 记录：原生缩放 `1 → 2 → 1`，DPR `1.25 → 2.5 → 1.25`，CSS 宽 `1426 → 713 → 1426`，外窗宽固定 1440，CSS zoom 和 visualViewport.scale 均为 1。

200% 下页面纵向重排，标签、输入、错误、成功、重置、禁用原因、键盘焦点和无水平溢出均通过；page/console/HTTP 错误为 0。截图通过无 clip 的 CDP capture 保存，避免缩放时 fullPage 裁切；六张最终截图已目视检查。运行后恢复 100%、关闭自己的 Chrome、删除自建临时 profile，消费者仍干净。

## 真实失败与修复

- 首次开发 Lint 扩大范围包含未改动的 T2 校验器，触发既有未用变量和控制字符正则警告。保留 [原始失败](../../tests/manual/consumer-pilot/t3-evidence/development/p03-t3-app-lint-initial.txt)，最终 Lint 明确覆盖本次应用、主题与配置；校验器逻辑未改，继续执行自身哈希/引用检查。
- 审查发现空 status 使用 `display:none`，已删除这一行，让 live region 常驻可访问树。真实读屏播报尚未实测。
- 首次真实缩放检查发现 `/favicon.ico` 404，保留 [首次结果](../../tests/manual/consumer-pilot/t3-evidence/zoom/attempt-1/zoom-check.json) 和 [定位结果](../../tests/manual/consumer-pilot/t3-evidence/zoom/attempt-2-diagnostic/zoom-check.json)。最终提交增加空 data favicon，从新目录重装/构建后 page/console/HTTP 错误归零。
- 首次路径检查发现继承的全局 `NODE_PATH`；同时扫描器把 `new URL('../', import.meta.url)` 的合法内部目录当作文件。保留 [首次结果](../../tests/manual/consumer-pilot/t3-evidence/independence-check-initial.json)。修正 QA 的目录解析，并在任务进程清空 NODE_PATH；最终重新检出安装和所有检查通过，没有改全局设置。
- 三视口 QA 首轮对两字按钮「重置」的名称假设遗漏 AntD 插入空格，保留 [失败](../../tests/manual/consumer-pilot/t3-evidence/browser/attempt-1/browser-check.json)；改为容许字间空白。第二次严格比较 `39.9844px` 与 `40px` 失败，保留 [结果](../../tests/manual/consumer-pilot/t3-evidence/browser/attempt-2/browser-check.json)，仅为高度加入 0.05 CSS px 容差。截图另等待绘制与错误退出完成，未弱化产品行为要求。

## 边界与下一张任务卡

仍有单包体积警告；未验证真实移动设备、Firefox/Safari、NVDA/JAWS，也未建立自动视觉回归基线。此次消费者验证没有改变公共资产成熟度，没有创建包、Registry、MCP 或跨框架运行时。

下一项是 **[P03-T4｜收口](../superpowers/plans/2026-10-23-phase03-consumer-pilot.md#p03-t4收口)**：按原任务卡核对 T1～T3 与 Gate 03，记录复用收益、局部覆盖、剩余手动步骤和演进决策，再判断是否满足 Phase 04 前置条件。本轮未提前执行这些决策。
