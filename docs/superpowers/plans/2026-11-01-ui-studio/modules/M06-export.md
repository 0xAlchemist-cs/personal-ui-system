# M06｜提示词与参考包导出

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 让用户复制与最终预览一致的实施提示词，或下载包含图片、清单、交互说明及项目文件的参考包。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：M05；三候选模式另依赖 M04。独立执行入口：[本模块提示词](../prompts/M06-export.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 新建：`showcase/app/src/features/studio/export/build-prompt.ts`、`capture.ts`、`bundle.ts`、`ExportDialog.tsx`。
- 测试：`export/build-prompt.test.ts`、`export/bundle.test.ts` 及真实页面截图/下载旅程。
- 截图或 ZIP 依赖只在现有能力不足时引入，实施时固定版本与锁文件；本计划不预先安装。

## 输入与输出接口

实现 buildPrompt、exportBundle 与 ExportScope。导出取当前文档快照，冻结 doc.id/revision；进行期间若有编辑，导出仍对应最初快照并显示版本，不混用新旧截图和文字。

## 实施步骤

- [ ] 1. 默认选择 final；all 依 contracts 的替换规则取三套。显示名称、页面数、修订号；自由稿不存在三个候选时禁用 all 并说明。
- [ ] 2. 导出前要求填写项目实际用途，写入 StudioProject.purpose；缺失时定位该字段，不凭标题虚构业务。提示词固定章节：项目目标与目标栈；所选组件及变体；页面与导航；每页结构/主次；风格与用户覆盖；三个设备的布局差异；真实交互/动效/状态；数据和持久化边界；已有组件复用；验收条件；参考文件清单。
- [ ] 3. 目标栈在导出面板填写框架/语言/UI 体系。未填写时明确“先检查目标项目，沿用既有栈”，不能静默指定 Next.js。预览组件来自 React/AntD 时说明来源，其他栈需对应实现，不承诺直接复制兼容。
- [ ] 4. 复制完整文本；剪贴板拒绝时保留可全选文本框和手动复制操作。成功仅在写入完成后提示。
- [ ] 5. 在运行预览模式捕获每页桌面 1440px 的实际完整页面 PNG，移除编辑边框/工具条；允许另选平板 768 与手机 375。等待字体/图片加载和组件稳定；冻结非必要无限动画到文档声明的静态帧，不能截到骨架后误报完成。
- [ ] 6. 每次导出创建独立 exportId，ZIP 命名 ui-system-projectId-exportId.zip。包含 prompt.md、project.json、components.json、interactions.md、manifest.json 和 previews/ 下图片；manifest 记录本次 exportId 与每份 doc.id/revision，每张图记录方案/页面/device/尺寸/修订号/截图帧说明。不能用一个候选的 revision 代表三份不同文档。
- [ ] 7. interactions.md 明确触发、初始态、结果、可恢复方式及动效参数。PNG 不是动态录像，导入 project.json 才能重新运行真实动态预览。
- [ ] 8. 任何页面截图失败，显示失败页面与重试入口；不把缺图 ZIP 标为成功。用户仍可独立复制文本，保留已编辑文档。
- [ ] 9. 所有来源与适用许可证进入清单；不导出本机绝对路径、API Key、生成缓存路径或供应方对象。

## 可判定验收与停止条件

- [ ] 修改节点文字、颜色、顺序、手机覆盖后，提示词与截图、项目 JSON 的内容一致。
- [ ] all 导出时只有被编辑候选被工作稿替换，另外两套原样；自由稿不会被当作三套。
- [ ] ZIP 可解压，每张图片可读取且清单有对应页、方案与 revision；文件名使用 ID，不因重名页面覆盖。
- [ ] 演示动态组件有状态/动效说明；截图没有编辑框、鼠标选中态或错误骨架。
- [ ] 模拟剪贴板拒绝、单页图片加载失败，分别有可用恢复路径，不丢工作稿。
- [ ] 不把多页/自定义样式输出冒充 UI Brief 1.0 校验通过。

## 补充边界

导出包是目标项目实施参考，不是可部署的完整生产网站。首版不输出录像或承诺复现真实后端行为。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
