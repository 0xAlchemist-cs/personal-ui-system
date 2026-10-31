# 编辑器来源与选型边界

返回 [大纲](../2026-11-01-ui-studio.md) · 下一步 [M00](modules/M00-feasibility.md)。

## m3e-canvas 固定调查来源

调查源码提交：`49378e1e35f5de6aaadfcd3f852eeb0edffdbb95`。此次仅源码调查；未启动其应用、验证浏览器行为或集成代码。

- [README](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/README.md)：画布、页面连线、预览、提示词及项目文件的产品入口。
- [package.json](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/package.json)：Next.js 16.4.2、React 19.3.0、motion、自有脚本。不能把其 TypeScript 7 / Next 工程直接覆盖本库 Vite / TypeScript 6。
- [M3Node](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/components/M3Node.tsx)、[Preview](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/components/Preview.tsx)：Material 组件渲染及具体预览行为。具有交互不等于任意 React 业务组件可直接注册。
- [project](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/lib/project.ts)：固定 Kind 的项目读取与校验。
- [tidy](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/lib/tidy.ts)：确定性整理规则，不是已完成的三方案生成器。
- [prompt](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/lib/prompt.ts)：现有坐标、组件、主题转描述的参考。
- [MIT](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/LICENSE) 与 [NOTICE](https://github.com/lnkiai/m3e-canvas/blob/49378e1e35f5de6aaadfcd3f852eeb0edffdbb95/NOTICE)：复用相应代码时保留原声明及适用的 Apache-2.0 署名。

## 如何使用调查结果

优先验证其画布操作、文档结构、预览和提示词方法能否用于多风格真实组件。不是把整个 Next.js 应用嵌入 iframe 就算集成。M00 必须明确“直接复用的文件、修改的文件、借鉴的方法、保留/移除的上游依赖”，避免把参考实现误报为本库能力。

备选 [Puck 官方文档](https://puckeditor.com/docs) 支持自有 React 组件注册与字段配置；[Craft.js](https://github.com/prevwong/craft.js) 提供更底层的可定制编辑器。二者仅为失败后的比较对象，当前没有锁定版本或安装。先尝试 m3e-canvas 的受限适配，失败后给出有证据的替代提案，不未经调查直接更换底座。

## 已有资产的复用

- [现有成员应用](../../../../showcase/app/README.md)：React/Vite、官方 Ant Design、现有交互和测试设施。
- [风格目录](../../../../design-system/styles/README.md)、[Token 契约](../../../../design-system/tokens/README.md)：复用命名和 Resolver，用户覆盖独立存放。
- [组件选型](../../../../components/README.md)、[工具接入](../../../guides/ui-tooling.md)：只有实际使用相应库才加载 Skill。
- [Impeccable](../../../guides/impeccable.md)：候选质量补充，不是本次画布引擎，不自动安装 Hook。
