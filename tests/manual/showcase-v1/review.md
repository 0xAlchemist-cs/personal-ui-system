# Showcase V1 正式页面验收 — P02-T5

2026-10-23，Codex 按 [任务 5](../../../docs/superpowers/plans/2026-10-23-showcase-v1.md) 和 [Gate 02](../../../docs/superpowers/MASTER-PLAN.md) 完成实际页面、Stories、交互与视觉验收。**Gate 02 通过，结论仅覆盖本报告的页面、固定预设和环境。** Phase 03/04 未启动。需求以冻结的 [Brief](../../../showcase/user-management.brief.yaml) 为准。

原 [T0/T1 规格初稿](t1-spec-check.md) 已保留并加历史提示；[T2](t2-theme-check.md)、[T3](t3-interaction-check.md)、[T4](t4-stories-check.md) 保留当时状态，不倒写历史“待验收”为已执行。

## 版本与前置条件

- 开始时 main 与 origin/main 均为 `60ebfa34255d888b23ac08db7778db913f52ac9d`，主工作区干净；在隔离分支 `codex/p02-t5` 执行。计划、Brief、锁文件、单一主题、17 个 Story 与前序证据齐全。没有覆盖用户改动、新增依赖或修改其他阶段计划。
- 首次修复 `ff9b607ef96ce1819895c0226f05a5824ee6ff97`：实际颜色映射、窄屏空态；最终修复 `b71e54727aab2e15f6bf91fbef42892ca7c3171f`：图标颜色、减少动态时动画循环。
- 页面、纯键盘、无障碍最终证据基于 b71e547。Stories 51 项从 ff9b607 开始，期间有颜色别名修改，JSON 保留来源说明；相关 9 项及截图在 b71e547 复测。真实 200% 基于 ff9b607，后续只有颜色与减少动态变化，没有改变缩放布局；不误报为最终 SHA 全量复测。
- 最终构建包含 b71e547、StoryFrame 验收说明和预设状态元数据；业务逻辑与 Token 值未再改变。交付提交另含报告与证据，不倒写测试来源 SHA。

## 实际环境与复现

| 项目 | 实测值 |
| --- | --- |
| 系统 / 浏览器 | Windows_NT 10.0.26100 / Google Chrome 155.0.8059.81 |
| 项目运行时 | Node 22.15.0 / npm 11.16.0；历史 T2～T4 npm 为 10.9.2，本轮未升级全局工具 |
| 固定依赖 | React/DOM 19.3.1、Ant Design 6.6.7、Vite 8.3.5、React 插件 6.1.2、TS 6.0.3、Storybook 10.6.3、Vitest 5.0.5、Oxlint 1.88.0，见应用锁文件 |
| 浏览器工具 | 宿主 Playwright 1.62.1 / Node 24.22.1 调用系统 Chrome，未写入项目依赖，没有 CI 或长期截图回归脚本 |
| 启动 | `npm --prefix showcase/app run dev -- --port 5185 --strictPort` → `http://127.0.0.1:5185/`；`npm --prefix showcase/app run storybook -- --ci --port 6015` → `http://127.0.0.1:6015/`，实际可访问 |
| 普通视口 | 页面 375×812、768×1024、1440×900；键盘与 Stories 高 900；100%、DPR 1，使用真实 iframe 宽度 |
| 真实缩放 | 独立临时 headed Chrome，窗口 1440×1100；OS DPR 1.25；页面 100%→200%→100%，DPR 1.25→2.5→1.25，CSS 可用宽度 1426→713→1426 |
| 语言 / 日期 | zh-CN / UTC；固定 ISO UTC 字符串直接显示 YYYY-MM-DD，不依赖运行时或本地时区 |
| 字体 | Segoe UI、PingFang SC、Microsoft YaHei、sans-serif；CDP 中文标题实测 Microsoft YaHei Bold，无外部字体请求 |
| 动态 / 数据 | prefers-reduced-motion: reduce；固定 30 条合成数据，刷新恢复；加载仅 Story，无真实接口或持久化 |

安装与标准命令见 [应用说明](../../../showcase/app/README.md)。Windows 使用可用的 npm.cmd，未改 PATH。浏览器使用隔离上下文或临时配置，缩放已恢复，临时浏览器已关闭。

真实缩放由 Chrome Appearance 的 Page zoom 原生选项设置，独立读取 chrome.settingsPrivate.getDefaultZoom 为 1→2→1；窗口不变、CSS zoom 和 visualViewport.scale 均为 1。没有用 CSS、deviceScaleFactor 或 CDP pageScaleFactor 冒充缩放。截图为不裁剪的 CDP 可见视口，详见 [原始读数](t5-evidence/zoom-check.json)。

## 检查结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| npm run typecheck | 通过，退出 0，应用/测试/Stories/配置在范围内 | [完整最终日志](t5-evidence/build-check.log) |
| npm run lint | 通过，退出 0，0 警告，deny-warnings | 同上 |
| npm run test | 通过，退出 0，3 文件 / 78 项 | 同上，Token、适配与查询行为 |
| npm run build | 通过，退出 0 | 同上；主 JS 964.59kB / gzip 308.69kB，保留大包体提示 |
| npm run build-storybook | 通过，退出 0 | 同上；主 iframe JS 1163.33kB / gzip 333.59kB，保留大包体提示 |
| 页面交互与布局 | 17/17 通过 | [页面记录](t5-evidence/app-checks.json)，consoleIssues 为空 |
| 完整纯键盘 | 三视口各 3 组，9/9 通过 | [键盘记录](t5-evidence/keyboard-check.json)，Tab/Shift+Tab、方向键、Enter、Escape 完成，无 click/focus 注入，0 错误 |
| 17 Story × 3 视口 | 51/51 通过，最终相关复测 9/9 | [全矩阵](stories-final-check.json)、[最终复测](stories-final-followup-check.json)，preview console/page/play 错误与警告均 0 |
| 颜色与基础无障碍 | 30 文本 + 8 必要非文本、13 项语义/行为全通过 | [最终记录](t5-evidence/accessibility-check.json)，console/pageerror/外部请求均 0 |
| 真实 200% | 阅读、筛选、表格局部滚动、编辑、取消与焦点返回通过 | [缩放记录](t5-evidence/zoom-check.json)，无意外页面横向溢出 |
| Ant Design CLI lint | 两个修改文件均退出0、issues为空、partial=false、skipped为空 | [MemberTable](t5-evidence/antd-table-lint.json)、[主题适配](t5-evidence/antd-theme-lint.json) |
| 文档/配置/范围检查 | 自有 Markdown 链接、JSON/YAML 语法、预设状态与受保护文件未改检查通过 | [静态记录](t5-evidence/static-check.json)；这是语法和一致性核对，不宣称全量 JSON Schema 认证 |

浏览器由一次性宿主脚本操作真实 UI；JSON 和下述操作路径是本轮证据，脚本未成为项目长期测试能力。Stories 同时核对 play 结束且键盘未锁定，未仅凭成功事件判断无异常。

## 页面、状态与视觉

| 检查项 | 结果 | 实际观察 |
| --- | --- | --- |
| 层级、留白、密度 | 通过 | 单一 h1 和列表 h2，筛选靠近列表，演示边界可见；桌面侧栏对齐、手机抽屉，无假菜单或 KPI |
| 颜色、字体、间距、圆角 | 通过 | 共同 Provider 与语义变量，页面/Stories 一致；补全别名，没有改变 Token 值或其他风格 |
| 375/768/1440px | 通过 | scrollWidth 等于视口；筛选换行，表格局部滚动，分页/清除可见，编辑/抽屉可操作 |
| 默认、加载、首次空数据、无结果 | 通过 | 默认 30 条；Story 加载 inert/busy 且有说明；首次空数据和无结果不同，输入保留且可清除；空态不再被宽表遮挡 |
| 错误、恢复、成功、禁用 | 通过 | 字段错误关联、输入保留，保存禁用附原因；修正后保存并提示刷新恢复；停用成员仍可编辑 |
| 查询、排序、分页 | 通过 | 姓名/邮箱不区分大小写、与状态 AND；先筛选后排序分页；条件变化回首页，编辑后页码收敛 |
| 键盘、标签、焦点 | 通过 | 跳转 main 后 Tab 搜索/状态/分页/编辑；正反圈定、Escape/取消不保存、返回触发按钮，行消失回 h2 |
| 对比度、200%、减少动态 | 通过 | 真实背景/透明度合成测量，真实浏览器缩放；焦点可见；减少动态下动画极短且仅一次 |
| 自动截图基线 | 不适用 | 当前人工截图，无视觉回归基线，属于后续阶段 |
| 网络错误、权限、登录、持久化 | 不适用 | Brief 为内存演示，错误只测实际表单校验 |
| 真机、多浏览器、真实读屏器 | 未执行 | CDP AX/DOM 名称、角色、关联不等于 NVDA/JAWS/VoiceOver 朗读或 WCAG 全项认证；没有 Firefox/Safari/真机保证 |

## 旅程与截图

默认截图为 fullPage，固定宽度，文件高度随内容增长；错误/成功及真实缩放用可见视口，避免遮罩拼接误读。没有像素差分基线。

| 编号 | 复现与结果 | 截图 / 记录 |
| --- | --- | --- |
| J01 | 刷新，30 条、降序、10 条/页、3 页；通过 | [1440×900](t5-evidence/default-1440.png)、[768×1024](t5-evidence/default-768.png)、[375×812](t5-evidence/default-375.png) |
| J02 | 纯键盘 MEMBER、启用、20 条，第 2 页首行为成员14；排序/回页通过 | [键盘步骤](t5-evidence/keyboard-check.json)、[排序检查](t5-evidence/app-checks.json) |
| J03 | 无匹配词或编辑唯一匹配退出；条件保留、清除恢复；通过 | [1440 无结果](t5-evidence/filter-empty-1440.png)、[375 首次空数据 Story](screenshots/story-empty-375.png) |
| J04 | 空姓名、无效邮箱，Tab 触发错误/禁用；修正/取消/Escape/保存通过 | [1440 错误](t5-evidence/accessibility-invalid-1440.png)、[375 键盘错误](t5-evidence/keyboard-375-error.png)、[768 错误 Story](screenshots/story-error-768.png) |
| J05 | 保存更新列表并提示刷新恢复，刷新验证通过 | [1440 成功](t5-evidence/accessibility-success-1440.png) |
| J06 | 筛选“1”到末页，编辑剩余匹配退出；收敛页码并聚焦列表标题；唯一匹配退出也通过 | [相应两项检查](t5-evidence/app-checks.json) |
| J07 | 手机抽屉正反 Tab 圈定、Escape/关闭返回；表格方向键到编辑，弹窗圈定/返回通过 | [抽屉](t5-evidence/drawer-375.png)、[表格操作](t5-evidence/table-actions-375.png)、[手机编辑](t5-evidence/edit-375.png) |
| J08 | 加载 Story、三视口状态、真实 200%、减少动态通过 | [1440 加载](screenshots/story-loading-1440.png)、[200% 页面](t5-evidence/zoom-200.png)、[200% 编辑](t5-evidence/zoom-200-edit.png) |

截图已打开评审：标题、辅助信息与列表职责清楚，桌面阅读边界稳定，手机保留 16px 页边距、筛选换行。表格局部滚动保留字段与编辑可达；空态独立排版后文案/行动完整可见。错误用文字与边框，禁用有原因，成功说明演示边界。没有仅依赖坐标输出判定视觉完成。最后只更新 StoryFrame 的验收说明后，另在375px实际展开检查，通过文案可见、换行、无页面溢出和pageerror；没有因纯说明更新重复全矩阵。

## 缺陷与修复

| 发现 | 原始证据 | 修复与复查 |
| --- | --- | --- |
| 手机空态超出视口 | [坐标](stories-initial-visual-findings.json)，例如 x398–454、视口375；[修复前](screenshots/story-empty-375-before.png) | Empty 移出最小宽度770px的 Table，非空列/事件/滚动不变；最终空态/无结果坐标与截图通过 |
| 派生颜色对比度不足 | [修复前JSON](t5-evidence/accessibility-before-fix.json)保存链接4.104、placeholder1.839、Empty3.363、焦点1.700；下拉/清除图标1.839为执行时实测，未单独保留初始JSON | 唯一 ThemeConfig 映射既有 accent/muted/focus；最终链接5.169、悬浮6.421、placeholder/Empty/必要图标7.578、焦点5.169，38样本通过 |
| 减少动态的 Spin 仍无限循环 | 执行时实测，未单独保留初始JSON；最终样式值见无障碍记录 | 减少动态规则追加 iteration-count:1，最终 duration0.01ms、iteration1，语义/行为通过 |

普通文字目标4.5:1、大字3:1、必要控件/图标/焦点3:1，按真实背景和透明度合成。Select焦点在外层，未误判内部input的outline:none；最终按钮实际outline为3px。

影响：colorTextQuaternary 同时派生更深的 colorTextDisabled。保存仍原生disabled、灰底、浅边框、not-allowed光标、错误及关联原因；该按钮对比度豁免，不计入38样本。加载文字4.940:1；Spin四点透明后仅1.532:1，因完整文字/状态已表达加载，作为冗余装饰单列，未冒充必要图形通过。

检查脚本修正不混作产品缺陷：初次 Stories 的768px编辑坐标检查发生在原生滚动动画稳定前，改为等待实际可见位置后通过；另行测量发现的空态越界才是已修复缺陷。纯键盘初稿遗漏清除按钮Tab停靠，并误用会退出MEMBER筛选的保存数据；改按实际顺序、保留匹配，行消失退路另有检查。构建日志初次路径错误已修正，完整五项命令重跑留存退出码。未弱化产品要求。

## 收口、资产与限制

页面/Stories运行、单一主题、业务组合、三视口、完整键盘、真实200%、主要状态、颜色/语义、类型/Lint/测试/双构建均有证据，关键发现已修复复查，没有未解决的阻断问题。

复用冻结Brief、原始/语义Token、minimal-saas、导航/表单/展示原则、官方Ant Design部件与现有组件/Provider/Stories。新增验收记录、JSON和截图，只修必要别名、空态与减少动态，没有公共封装、新依赖或第二条主题。CLI `antd token Button --version 6.6.7 --format json` 与已安装官方类型/样式源码用于核对API；CLI与组件版本分别确认。

按 [生命周期](../../../docs/guides/asset-lifecycle.md)，minimal-saas 晋级 **validated** 仅限固定 light/comfortable/blue/medium 成员页面与已测Stories、状态、环境。不是approved，未收录公共组件，不承诺跨项目、跨框架或其他主题；另两套风格和通用模式仍为候选。

非阻断限制：应用/Storybook主块超过500kB，未调阈值隐藏；Storybook管理器历史有自身runtime未来ariaLabel提示，本轮隔离预览无警告；空态region仍复用“可横向滚动”名称和Tab停靠，轻微语义冗余；暂无自动回归基线、CI、真实读屏器/跨浏览器/真机检查。数据仅内存演示，不能当作生产服务。

下一张任务卡：原 [P03-T1｜消费者选型](../../../docs/superpowers/plans/2026-10-23-phase03-consumer-pilot.md)。先核验Gate02，确定消费者、固定版本、技术栈与最小复用清单；未指定消费者时形成隔离试点候选。**本轮到T5为止，没有启动Phase03或重写既有计划。**
