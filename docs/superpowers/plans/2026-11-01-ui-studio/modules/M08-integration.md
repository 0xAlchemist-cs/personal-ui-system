# M08｜新首页、完整旅程与收口

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 让现有桌面图标进入真正的选型工作台，保留旧示范，并完成可重复验证的核心流程。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：M00～M07 达到各自验收条件。独立执行入口：[本模块提示词](../prompts/M08-integration.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 修改：`showcase/app/src/App.tsx`，新增 `features/studio/StudioApp.tsx` 及最小 hash 路由导航。
- 检查 `main.tsx` 与 `ShowcaseThemeProvider.tsx` 的 Provider 边界：编辑器外壳与各方案风格隔离，旧成员页仍用既有通路。
- 新增浏览器测试：`showcase/app/e2e/studio.spec.ts`；旧 members/navigation 旅程显式访问 #/examples/members。
- 更新 README、应用说明、docs/roadmap.md 和 CHANGELOG；收口 `docs/records/ui-studio-v1-review.md`，证据 `tests/manual/ui-studio/final/`。
- 现有桌面启动和图标脚本保留；仅必要时改标题识别，不重装全局工具。

## 输入与输出接口

应用路径建议：#/gallery、#/project/<id>/cart、#/project/<id>/compare、#/project/<id>/edit、#/projects、#/examples/members。默认无 hash 进入图库；hash 导航仅改变界面，不包含整个项目 JSON。

## 实施步骤

- [ ] 1. 完成全局导航：图库、我的项目、收藏、组件示例；首页首先看到效果图和搜索/场景分类，不能仍默认成员表单。
- [ ] 2. 连通购物车、分组、候选比较、自由拼装、编辑、保存和导出。编辑器只在进入时加载，图库封面不预加载整个画布运行时。
- [ ] 3. 校验主题 Provider 隔离：外壳固定可读主题，候选分别使用各自 preset 与用户覆盖，不污染旧 Stories 或相邻预览。
- [ ] 4. 浏览器测试分别执行“喜欢一套进入修改”和“全部不喜欢进入拼装”，覆盖保存/导入/导出；使用固定数据，按 UI 条件等待，不以固定 sleep 掩盖问题。
- [ ] 5. 旧浏览器旅程从原默认 / 改为明确旧示范路由，不删除旧断言来避免回归。原 Story ID 尽可能保持；确需变更时记录影响。
- [ ] 6. 在 Windows 双击 UI system 检查新首页、重复启动与图标，确认命令行启动和桌面入口行为相同。
- [ ] 7. 执行全部适用检查及验收矩阵，保存受检 SHA、环境、截图、真实交互结果和未测项。
- [ ] 8. 有明确失败则修复复测；通过后更新实际路线状态，不把新增能力自动推广为多框架兼容或公共资产 approved。

## 可判定验收与停止条件

- [ ] 首页确为效果图库，36 项可浏览；首屏不是成员管理示范。
- [ ] 两条主旅程和五类失败/状态检查按 acceptance.md 有实际证据。
- [ ] 旧 17 个 Story、旧成员页的核心交互和既有检查不退化。
- [ ] typecheck/lint/test/build/build-storybook、知识检查和新增/已有浏览器测试均执行；本轮实际测试数量如实记录，不沿用旧 11 项总数。
- [ ] 新 UI 完成三视口、键盘、实际 200% 缩放、动效及编辑/预览模式人工验收。
- [ ] 核对待交付 SHA 的两个 CI job，按 tests/README 成功后再同步主分支；源码改变后重核对应提交。

## 补充边界

本模块收口的是本机可用的设计选型工具。生产网站发布、云同步、在线 AI 和 npm/Registry 分发仍不属于本次。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
