# M01｜设计文档与编辑命令

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 建立图库、画布、预览和导出的共享文档，避免每个模块维护一份布局真相。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：M00 的可执行选型结论通过。独立执行入口：[本模块提示词](../prompts/M01-document.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 新建：`showcase/app/src/features/studio/document/types.ts`、`project.ts`、`commands.ts`、`styles.ts`。
- 新建：`document/studio-project.schema.json`、`document/project.test.ts`、`document/commands.test.ts`。
- 注册表接口由 types 导出；组件实现留 M02，不为未存在的组件写重复封装。

## 输入与输出接口

实现 contracts.md 中 createProject、parseProject、resolveStyle、applyEdit 及 EditCommand。输出纯 JSON 可保存的数据，不含 ReactElement、函数、DOM 或供应方实例。

## 实施步骤

- [ ] 1. 将共享契约落为类型；实现 createProject 的空初值与 kind/schemaVersion。Schema 和类型同步声明字段，保留当前 UI Brief 1.0 原样。
- [ ] 2. 实现唯一 parseProject 边界：检查版本、注册表组件/variant、props、唯一 ID、children 引用、无环树、页面根引用、购物车归属、颜色与尺寸范围。一次解析同时完成结构和引用校验，不在下游再做全图检查。
- [ ] 3. 对不认识的版本、组件或字段路径给出具体错误；当前只支持 1.0，不编造自动跨版本迁移。
- [ ] 4. 实现类型化命令与不可变更新；禁止根删除/后代循环；duplicate 复制子树并重新分配实例 ID。
- [ ] 5. 实现有限撤销/重做，首版保留最近 100 条设计命令；新命令清空 redo。拖拽提交一次，预览交互不入栈。
- [ ] 6. 实现 style + 设备覆盖合并，不触及原公共 Token；生成和导出读取同一文档。

## 可判定验收与停止条件

- [ ] 最小项目 JSON 往返后深比较相等；未知版本和缺失组件在一次导入中给出准确字段位置。
- [ ] 移动到自身后代被拒绝；duplicate 后无重复 ID；remove 删除子树不留下孤儿引用。
- [ ] set-style mobile 不改变 tablet/base；撤销一次拖动恢复原父节点和顺序，redo 再恢复移动结果。
- [ ] 用业务语义测试覆盖上述操作，不为每个 getter 写镜像测试。建议命令：在 app 运行 npm run test -- src/features/studio/document，随后 typecheck/lint。
- [ ] 禁止在画布与导出中再发明 Doc 类型；后继模块遇到缺字段先改本契约。

## 补充边界

本模块不提供账号、协同算法或通用插件 SDK。类型和边界足以支持当前组件及文件导入即可。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
