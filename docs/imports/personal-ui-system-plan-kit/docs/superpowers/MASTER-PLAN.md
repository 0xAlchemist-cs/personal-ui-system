# Personal UI System — 总纲与阶段调度（Master Plan）

> 类型：执行总纲；不是组件实现说明、提示词大全或第二份路线图。
> 仓库基线：`main@31e29456a610efd12e89a6957a26a90d967aa415`（2026-10-23）。执行前必须重新读取 HEAD 与工作区差异；此哈希是写作依据，不是永久锁定的执行目标。
> 状态：**计划文件草案，未实施**。本文件不得被视为已完成的应用、测试或集成证据。

## 1. 唯一目标

把现有可读的设计知识（UI Brief、Tokens、Preset、Skill 与设计原则）逐步转化成**可预览、可验证、可在独立项目复用**的设计资产。首个验证用例是已有 `briefs/examples/user-management.yaml` 和 `minimal-saas`。

项目成败不按 Skill 数量、组件数量、Prompt 长度判断；按真实页面质量、复用的成功率、变更的可追溯性和维护成本判断。

## 2. 单一事实源（避免重复定义）

| 责任 | 唯一权威位置 | 其他文件允许做什么 |
| --- | --- | --- |
| AI 通用行为与读取顺序 | `AGENTS.md`、`prompts/frontend-development.md` | 只引用；不要复制整套规范 |
| 业务功能、数据、交互与验收需求 | 当前阶段的 `*.brief.yaml` + `briefs/ui-brief.schema.json` | 只增加任务指向，不改写行为契约 |
| 设计变量、语义、预设 | `design-system/tokens/`、`design-system/styles/` | 引用并说明映射，不重复维护颜色常量 |
| UI 体系选择、官方工具 | `components/README.md`、`docs/ui-tooling.md` | 只说明本任务选用哪一套，不再写工具百科 |
| 阶段定义与当前进度 | `docs/roadmap.md` | 本总纲只定义门槛与推进关系；不维护第二套状态表 |
| 本阶段执行细节 | `docs/superpowers/plans/<阶段计划>.md` | 总纲和小 Prompt 只引用计划编号 |
| 任务验收的实际证据 | 阶段计划所指定的 `tests/`、报告或测试日志 | 不在计划中虚构“已通过” |
| 资产成熟度 | `docs/asset-lifecycle.md` | 总纲不重新定义 draft/validated/approved |
| 历史版本变化 | `CHANGELOG.md` | 不把计划草案写成已发布功能 |

**解释冲突的顺序：** 用户本次明确约束 > 当前项目的 `AGENTS.md` 与真实依赖 > UI Brief/Token 契约 > 当前阶段实施计划 > 本总纲的默认建议 > 外部示例。任何修改需求合同的决定须更新其原始唯一来源，并在执行报告中列出影响。AI 不得“就地口头改规则”。

## 3. 层级与文件布局

```text
AGENTS.md                                      # 已有；AI 项目入口，不复制本总纲
docs/roadmap.md                                # 已有；四阶段路线与状态
docs/implementation-plan.md                    # 已有；Phase 01 记录
docs/superpowers/MASTER-PLAN.md                # 新增；阶段门槛与执行协议
docs/superpowers/plans/
  2026-10-23-showcase-v1.md                    # 已有；Phase 02 唯一详细计划
  2026-10-23-phase03-consumer-pilot.md         # 新增；Phase 03 条件计划
  2026-10-23-phase04-quality-and-distribution.md # 新增；Phase 04 条件计划
```

**小 Prompt 放在所属阶段计划的末尾**，仅描述“本轮执行哪个任务、读哪里、写哪里、按什么证据完成”，不再粘贴整个计划。首次使用本套文档时，把交付包中的 `append-to-existing-showcase-v1.md` 合并追加到已有 Showcase V1 计划尾部；这是一项纯文档操作，不等于实施 Phase 02。

## 4. 四阶段与门槛

### Phase 01 — 设计知识库（现有基础，不重复建设）

证据与边界查看 `docs/implementation-plan.md`、`docs/validation-report.md`。已建立规则、三个 `draft` 预设、JSON Token、UI Brief、第三方 Skill 接入记录；**未证明页面视觉质量**。

### Phase 02 — Showcase V1（当前唯一允许立即进入的实施阶段）

**执行计划：** `docs/superpowers/plans/2026-10-23-showcase-v1.md`，任务 1～5；不得另开一份并行的 V1 功能计划。

**出口门槛（Gate 02）：** 用户管理页面 + Stories 真正运行；Token 解析与 Ant Design ThemeConfig 只存在一条通路；计划所列业务、键盘、响应式、构建与页面验收通过且有证据；失败项修复或真实标注。页面 Demo 数据不能误写成持久化服务。预设最多按已验证范围提升至 `validated`，不得自动 `approved`。

**不做：** 第二/第三套主题、五套框架同时运行、跨项目包、Registry、定制 MCP、自动截图基线。

### Phase 03 — 独立消费者试点（Gate 02 后启动）

**执行计划：** `docs/superpowers/plans/2026-10-23-phase03-consumer-pilot.md`。

**入口门槛：** Gate 02 的验收报告可核验，且已选择一个有明确技术栈的独立消费者场景（可以是隔离验证应用，不要求动用用户已有生产项目）。

**出口门槛（Gate 03）：** 消费者从固定版本的**闭合快照**复用已验证规范和 Token；没有本地绝对路径/跨仓库软链接；独立检出、安装、构建、运行成功；记录来源 SHA、版本、覆盖及测试证据。不要因为复制成功就宣称多技术栈组件兼容。

### Phase 04 — 自动验收和可选分发（Gate 03 后依需求推进）

**执行计划：** `docs/superpowers/plans/2026-10-23-phase04-quality-and-distribution.md`。

**入口门槛：** Gate 03 通过，明确了哪些检查有稳定重复执行的价值；分发类任务需有至少两个确切消费需求或明确发布目标。

**出口门槛（Gate 04）：** 可重复执行的适用 CI 与浏览器检查，失败可追踪；视觉基线建立在固定环境与人工核准上；仅当有真实需求才选择复制快照、Registry 或包分发。不得承诺不存在的 SDK/CLI。

## 5. 单任务执行协议

1. **对齐版本：** 读取 HEAD、`git status` 和相关变更，不覆盖未提交文件；新提交若改变计划或契约，先确定差异。
2. **按需读取：** `AGENTS.md` → 当前阶段计划 → 本任务引用的已有文件。禁止为了“全面理解”重复展开全部第三方 Skill。
3. **只做一个任务：** 每次执行一张 Task Card。依赖未满足时，停止该卡并报告，不擅自跳到别的阶段。
4. **先复用再新增：** 对照真实依赖和已有组件，禁止无实际场景建立过度封装。
5. **验证并留证：** 按该任务的最小验收条件执行测试，记录命令、退出码、运行环境与结果。若工具缺失，写明未验证。
6. **失败处理：** 记录原始失败、做最小修复、复测受影响项；禁止删测试、弱化严格性或编造成功。
7. **阶段收口：** 检查所有任务证据与 Gate，更新 `docs/roadmap.md` 和 `CHANGELOG.md`，只写实际发生的变化。发布、推送、审批按用户授权和当前工具能力进行。

## 6. 小 Prompt 写作约定（所有阶段一致）

每张微型 Prompt 仅包含四项：`范围`、`必读定位`、`当次交付`、`证据/停止条件`。测试细节以原任务章节为准，**不要重复粘贴原需求与 AGENTS.md**。对无工具、缺权限、未选消费者等阻断，允许局部完成，但不得宣称整个阶段通过。

## 7. 现在怎么开始

**下一张任务卡：** 打开现有 Showcase V1 计划中的 **Task 1**（固定页面规格与首版选型）；按计划末尾的微型 Prompt 执行。不要同时开始 Phase 03/04 的实现。

**总控入口 Prompt（每个新会话可直接使用）：**

> 读取 `AGENTS.md`、`docs/roadmap.md` 和 `docs/superpowers/MASTER-PLAN.md`。查看最新 HEAD 与 git status，确认当前阶段和 Gate。仅执行我指定的阶段计划中的指定 Task；以该计划的具体条款和 Brief/Token 契约为准，不重写已存在计划，不扩大范围。完成后报告变更、执行命令、测试证据、未验证项、下一张可执行任务卡；只有 Gate 满足才允许提出进入下一阶段。
