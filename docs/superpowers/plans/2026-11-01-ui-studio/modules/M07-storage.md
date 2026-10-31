# M07｜本机项目、收藏与文件往返

> **For agentic workers:** Use executing-plans to implement this assigned module. Steps below are future checklist items.

**Goal:** 刷新、关闭浏览器后恢复设计；收藏和备份留在本机，失败时仍能导出当前项目。
**Architecture:** 遵循共享文档与注册表，具体供应方类型限于适配层。
**Tech Stack:** 使用现有目标应用锁文件；新增依赖须有本模块实际用途。

## Global Constraints

遵守 [大纲](../../2026-11-01-ui-studio.md) 的全部约束。必读 [需求](../requirements.md)、[数据契约](../contracts.md)、[验收矩阵](../acceptance.md)。
前置：M01；完整交互接入 M02～M06。独立执行入口：[本模块提示词](../prompts/M07-storage.md)。本文件是本模块规格唯一来源。

## 文件与职责

- 新建：`showcase/app/src/features/studio/storage/projects.ts`、`preferences.ts`、`ProjectLibrary.tsx`。
- 新增 import/export 项目文件入口；测试 `storage/projects.test.ts` 和浏览器持久化旅程。
- 不新增服务端、账号或 GitHub OAuth，不把用户项目写入本库 Git。

## 输入与输出接口

实现 saveProject/loadProject；IndexedDB 数据库 personal-ui-studio-v1，projects store 按 id 存 StudioProject，preferences store 存收藏 componentId/variantId 和最后打开项目 id。旧数据/导入 JSON 统一经过 parseProject。

## 实施步骤

- [ ] 1. 编辑停顿 800ms 后保存最新完整项目；完成后显示“已保存到本机”和时间。输入/拖动中间状态不触发写入。
- [ ] 2. 同一项目保存按顺序完成，不能让较旧修订最后覆盖新修订；关闭界面时提示当前未保存状态，不承诺系统强制退出仍零丢失。
- [ ] 3. 项目库支持新建、改名、复制、删除与打开。删除前列出项目名确认；复制使用新项目 id，保持内部节点关系。
- [ ] 4. 收藏按 componentId/variantId 去重；取消收藏不删除购物车实例。目录条目不存在时展示失效收藏，用户可删除。
- [ ] 5. 下载 project.json 后，在另一个新项目入口导入：先解析，再显示名称、页面数、购物车数和来源版本；确认后作为新本机项目，不覆盖同 ID 旧项目。
- [ ] 6. 格式不符、未知组件或版本不支持时列具体问题，允许保留原文件；禁止部分读入后静默丢节点。
- [ ] 7. 浏览器存储不可用/写入失败时明确“未保存”，保留内存与文件导出；不继续显示旧的“已保存”提示。
- [ ] 8. 告知浏览器数据清除会移除本机项目，导出 JSON 是备份方式；GitHub 只保存程序及内置资产。

## 可判定验收与停止条件

- [ ] 保存购物车、分组、候选、工作稿和设备覆盖，刷新后逐项相等；打开项目恢复最后编辑内容。
- [ ] 连续两次编辑后重载得到较新 revision，不能保存顺序逆转。
- [ ] 文件导出/新 ID 导入后语义一致；原项目仍在；未知组件、损坏 JSON 均不修改当前项目。
- [ ] 人工关闭再打开浏览器验证实际恢复；不能仅用内存 mock 宣称持久化已验证。
- [ ] 存储失败时仍可复制提示词和导出当前 JSON；收藏与购物车分离。
- [ ] 不新增跨设备同步或隐含云上传。

## 补充边界

使用一个清晰的数据库封装即可，不提前建设多后端存储抽象、账号权限层或并发协同。

完成后回到 [大纲依赖表](../../2026-11-01-ui-studio.md) 确认下一模块；不自行跳到后继任务。证据必须注明实际检查而非仅引用历史成功。
