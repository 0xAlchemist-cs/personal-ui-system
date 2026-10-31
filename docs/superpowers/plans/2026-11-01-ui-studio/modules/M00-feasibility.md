# M00｜编辑器适配验证

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 证明 m3e-canvas 的可复用部分能服务多风格、真实 React 组件和响应式编辑；不是先决定整库接入。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：无；只执行本模块。独立执行入口：[本模块提示词](../prompts/M00-feasibility.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 新建：`showcase/experiments/canvas-adapter/`（隔离的 Vite/React 验证工程、自己的 package.json/锁文件）。
- 新建：工程内 `src/CanvasTrial.tsx`、`src/adapter.tsx`、`src/fixtures.tsx` 与对应行为测试。
- 新建：`docs/records/2026-11-01-ui-studio-m00.md`，证据放 `tests/manual/ui-studio/m00/`。
- 若复制上游文件，放工程内 vendor，附固定提交、文件清单、改动说明、LICENSE/NOTICE；不复制上游工作流、AI 面板或生产配置。
- 不修改当前 showcase/app 的依赖、入口、成员页或公共 Token。

## 输入与输出接口

输入：来源文件中的固定 m3e-canvas 提交及当前 React/Vite 锁文件事实。输出：适配结论、可复用文件清单、实际依赖版本、最小预览原型和证据。原型用计划的 DocNode 形状，不要求先实现整个 M01。

## 实施步骤

- [ ] 1. 固定来源并核对许可证，画出 Canvas、M3Node、Preview、tokens、prompt 间的直接依赖；标出 Next 专属引用与样式耦合。
- [ ] 2. 在隔离工程验证四类节点：按钮（上游 M3 与官方 Ant Design 两种实现对照）、可切换的 Tabs、现有 EditMemberDialog、持续运行的加载指示器。M3 按钮只作为对照，不冒充本库同名组件；弹窗验证输入、校验、关闭和焦点回退。
- [ ] 3. 将选中、移动、缩放与属性变更映射为本库节点数据；用一个 column 容器和一个 free 容器验证两种定位。
- [ ] 4. 在 minimal-saas 与 developer-editorial 两种背景/文字/强调色组合下切换，不改公共 JSON；确认 Ant Design 节点仍由官方实现渲染。
- [ ] 5. 用同一数据分别进入编辑与预览，切换 Tabs、播放动画；退出预览后只保留设计修改，不把运行状态保存成设计。
- [ ] 6. 将 1440px 两栏布局缩到 375px；记录自动单列、自由定位的约束/提示和可手动修正的位置。导出再导入试验节点，比较内容、样式、布局和页面引用。
- [ ] 7. 报告逐项列出通过/失败/未执行，给出“可复用底座 / 只复用部分方法 / 不适用”之一，不以截图相似代替功能证据。

## 可判定验收与停止条件

- [ ] 原型的 Tabs 在预览中切换内容，在编辑中点击只选中；无两次点击同时触发的混乱。
- [ ] 修改 Ant Design 按钮文案/颜色后，序列化、重新载入和实际渲染保持一致。
- [ ] 自由节点超出手机容器时能发现并修正；不把 1440px 截图缩放成手机预览。
- [ ] 记录原型实际安装、类型、测试、构建命令与退出码；截图至少 desktop/mobile × 两种风格，动效另附操作及观察记录。
- [ ] 核心任一项失败则不进入 M01。说明最小适配成本与 Puck/Craft 替代验证建议，由明确的后续任务决定，不静默迁移整个应用。

## 补充边界

本模块不以像素相似度给通用组件保证。通过意味着足以进入设计文档及注册表实现，不代表已经完成图库、三方案或生产级画布。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
