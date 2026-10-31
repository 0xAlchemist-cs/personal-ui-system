# 模块共享数据与行为契约

返回 [大纲](../2026-11-01-ui-studio.md) · 范围见 [需求](requirements.md)。本文件定义计划接口，不代表运行代码已存在。M01 实施时落到下列 types.ts；以后接口变化先更新此处和受影响模块。

## 文件位置与边界

计划新代码统一位于 `showcase/app/src/features/studio/`，按 document、gallery、cart、layouts、editor、export、storage 分目录。现有 members、theme、components 不整体迁移。编辑器供应方的具体类型只出现在 editor/adapter.tsx，不泄漏进项目文件、布局规则或提示词。

`document/types.ts` 的计划公共类型：

```ts
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type Device = 'desktop' | 'tablet' | 'mobile';
export type PresetId = 'minimal-saas' | 'developer-editorial' | 'enterprise-data';
export type Paint = { kind: 'token'; name: string } | { kind: 'hex'; value: string };
export type StylePatch = {
  widthMode?: 'auto' | 'fill' | 'fixed'; width?: number;
  heightMode?: 'auto' | 'fixed'; height?: number;
  gap?: number; padding?: number; radius?: number;
  fontFamily?: 'ui' | 'heading' | 'mono'; fontSize?: number;
  fontWeight?: 400 | 500 | 600 | 700; color?: Paint; background?: Paint;
  position?: 'flow' | 'free'; x?: number; y?: number;
};
export type DocNode = {
  id: string; componentId: string; sourceCartId: string | null;
  props: Record<string, Json>; children: string[];
  style: StylePatch; overrides: Partial<Record<Device, StylePatch>>;
};
export type PageKind = 'marketing' | 'article' | 'listing' | 'detail' | 'account' | 'dashboard';
export type DesignPage = { id: string; title: string; kind: PageKind; rootNodeId: string };
export type DesignDoc = {
  id: string; revision: number; presetId: PresetId;
  sourceCart: CartItem[];
  pages: DesignPage[]; nodes: Record<string, DocNode>;
};
export type CartItem = {
  id: string; componentId: string; variantId: string; props: Record<string, Json>;
};
export type PagePlan = {
  pages: { id: string; title: string; kind: PageKind }[];
  assignments: Record<string, string[]>;
};
export type Candidate = {
  id: string; inputKey: string; seed: number;
  signature: string; explanation: string[]; doc: DesignDoc;
};
export type StudioProject = {
  kind: 'personal-ui-studio'; schemaVersion: '1.0'; id: string; title: string;
  purpose: string; targetStack: { framework: string; language: string; ui: string } | null;
  presetId: PresetId; cart: CartItem[]; pagePlan: PagePlan;
  planConfirmed: boolean; candidates: Candidate[];
  generationHistory: { inputKey: string; signatures: string[] }[];
  workingDoc: DesignDoc | null; sourceVariantId: string | null;
};
```

候选 id、画布 node id 与购物车 item id 是不同标识，不能用组件类型名称替代实例 id。布局容器的 sourceCartId 为 null；普通组件的 sourceCartId 指向该 DesignDoc.sourceCart 中的来源快照，不指向随时可变化的全局购物车。创建候选/空白稿时复制来源清单；后来插入新条目时补入来源。移除全局购物车条目不会破坏已有候选和工作稿的引用。无业务数据的占位画板允许空 root 容器，导出前须至少存在一个页面和一个普通组件。

## 组件注册表

`gallery/registry.tsx` 提供 `COMPONENTS: readonly ComponentDefinition[]` 和 `getDefinition(componentId: string): ComponentDefinition | undefined`。注册表包含函数与 React 类型，只存在代码中，禁止序列化进项目文件。

ComponentDefinition 类型由 M01 放在 document/types.ts 导出，M02 才提供真实注册表内容；M01 不导入尚未创建的 M02 运行文件。

```ts
import type { ReactNode } from 'react';
export type ComponentDefinition = {
  id: string; title: string; level: 'primitive' | 'section';
  scenes: ('website' | 'blog' | 'admin' | 'webapp')[];
  roles: ('header' | 'navigation' | 'main' | 'aside' | 'footer' | 'overlay')[];
  supportedPresets: PresetId[]; defaultPageKind: PageKind;
  layoutFields: string[];
  variants: { id: string; title: string; props: Record<string, Json> }[];
  interactions: { id: string; action: string; expected: string }[];
  validateProps: (input: unknown) => Record<string, Json>;
  render: (props: Record<string, Json>, mode: 'edit' | 'preview') => ReactNode;
};
```

validateProps 是边界解析器，不是每次渲染的校验器。静态目录在装载时验证一次；外部项目在导入时逐个验证一次。解析后更新通过模块的类型化命令，预览、导出不重复执行完整 Schema。注册表缺项在边界形成可定位问题，不偷偷换成别的组件。

section 的内部按钮/文字由该 section 实现；只有作为独立条目选入或显式拆解后才成为独立节点，避免“一个 Hero 自动变成十个购物车条目”。首版不提供 section 拆解器；内部可编辑字段由该组件显式暴露。

layoutFields 是布局生成器可改变的呈现属性白名单，例如 Hero 的 composition、FeatureGrid 的 columns；未列入的文案、数据和交互字段必须保持原值。空白名单表示只允许调整外层容器。结构签名同时包含这些呈现属性，不忽略真正的组件内部结构变化。

## 模块公共函数

| 所属模块 | 计划接口 | 输入输出约束 |
| --- | --- | --- |
| M01 | `createProject(title: string): StudioProject` | 新建空购物车、空分组、无候选和工作稿；purpose 初值为空字符串，targetStack 为 null |
| M01 | `parseProject(input: unknown, definitions: readonly ComponentDefinition[]): StudioProject` | 唯一外部导入边界；失败抛出带路径的可展示错误；M01 测试传最小注册表，M02 后使用 COMPONENTS |
| M01 | `resolveStyle(node: DocNode, device: Device): StylePatch` | 基础 style 加当前设备覆盖；不从其他设备串联继承 |
| M03 | `suggestPages(cart: CartItem[]): PagePlan` | 确定性建议；不联网、不调用模型 |
| M04 | `generateCandidates(project: StudioProject, seed: number): Candidate[]` | 最多三项；空车、未确认分组在入口禁用 |
| M05 | `createWorkingDoc(project: StudioProject, candidateId: string | null): StudioProject` | 选候选则深复制；null 则按分组创建空容器，购物车可逐项插入 |
| M05 | `applyEdit(doc: DesignDoc, command: EditCommand): DesignDoc` | 产生新文档并 revision + 1；不直接改候选 |
| M06 | `buildPrompt(project: StudioProject, scope: ExportScope): string` | 固定结构；同一输入可重复；只读设计文档 |
| M06 | `exportBundle(project: StudioProject, scope: ExportScope): Promise<Blob>` | 完整成功返回 ZIP；图片失败则报具体页面，不输出伪完整包 |
| M07 | `saveProject(project: StudioProject): Promise<void>` | 本地设计持久化，不提交 GitHub |
| M07 | `loadProject(id: string): Promise<StudioProject | null>` | 不存在返回 null；外部旧数据解析走 parseProject |

`ExportScope = 'final' | 'all'`。final 必须有 workingDoc；all 需要三候选，按需求基线的“编辑稿替换对应候选”规则取三个文档。sourceVariantId 为 null 的自由稿不混入三候选，仍可单独导出。

`EditCommand` 在 M01 定义为判别联合：
- `{type:'set-props'; nodeId:string; patch:Record<string,Json>}`
- `{type:'set-style'; nodeId:string; device:Device|'base'; patch:StylePatch}`
- `{type:'move'; nodeId:string; parentId:string; index:number}`
- `{type:'insert'; pageId:string; parentId:string; index:number; item:CartItem}`
- `{type:'remove'; nodeId:string}`
- `{type:'duplicate'; nodeId:string}`

属性面板将具体组件字段转换成 set-props。拖动只在结束时提交 move/set-style，不把每个鼠标像素写成历史。移入自身后代、删除页面根容器、移动到非容器节点属于普通编辑约束，直接在命令入口拒绝。

## 样式与响应式规则

- 预览容器宽度：desktop 1440、tablet 768、mobile 375px；实际页面规则：小于 768 为 mobile，768～1023 为 tablet，1024 起为 desktop。
- 文档 style 为基础；选中设备编辑时只写 overrides[device]。重置设备修改只删除对应覆盖，不动其他设备。
- 尺寸以 CSS px 存储；fixed 宽/高必须大于 0；fontSize 12～96，gap/padding 0～96，radius 0～48，颜色为已知语义 Token 或 #RRGGBB。这些是首版编辑器输入范围，不是公共 Token 新定义。
- 行、列、网格为普通布局容器：row、column、grid；列数等容器参数存在 props。移动端默认降为单列，主内容先于辅助内容，导航转抽屉/折叠。
- 内部容器 ID 固定为 layout.row、layout.column、layout.grid、layout.free；在注册表中可解析，但不计入图库的 36 个条目，sourceCartId 为 null。容器间隙、列数和顺序进入结构签名。
- 允许自由定位：节点 position=free 时 x/y 相对所属容器，不是相对整个浏览器。容器必须有确定尺寸。设备切换后先约束在容器内；重叠/裁切提示必须在设备预览中可见，不能声称自由坐标自动获得正确响应式。
- 用户可以修改当前项目样式，但公共 preset JSON 不改；导出同时列出 presetId 与用户覆盖。
- Runtime 演示状态不写文档，例如打开的菜单、已输入表单和动画当前帧。保存和重新打开从组件声明的初始状态运行。

## 设计与运行状态分离

Project 是可保存的真相；当前选中节点、缩放、拖动中间坐标属于会话状态；输入值/弹窗开关属于预览状态。撤销重做仅针对设计命令，跨页面保留顺序；切换设备、查看预览不增加历史。更改购物车、分组或全局风格后候选标记过期，工作稿保持原样；用户明确重新生成才更换候选。

旧 UI Brief 1.0 是单页、固定预设约定，本项目 JSON 不是其扩展字段集合。M06 可以按页面生成满足旧契约的部分，但存在自定义样式或多页描述时不得打上“通过 Brief 1.0”的标签。

ID 唯一性按作用域判断：项目中的 cart/candidates 各自唯一，每个 DesignDoc 的节点唯一；多个方案允许保存相同来源 CartItem.id。sourceVariantId 记录工作稿起点，重新生成候选后允许它不在当前候选列表，不能因此删除工作稿。all 仅在该 ID 匹配当前候选时替换对应项；不匹配时输出当前三候选并提示当前工作稿可用 final 单独导出。

新建和设计阶段允许 purpose 为空；导出面板要求用户填写一句实际用途后才能复制或下载实施参考，例如“团队管理员检索成员并编辑姓名和邮箱”。targetStack 可保持 null，导出明确沿用目标项目已有栈；填写时三个字符串均须非空。两项随项目保存，不另维护仅存在导出弹窗中的隐藏版本。

generationHistory 初值为空，保存每种 inputKey 已展示的结构签名。M04 的调用者仅在用户接受新一批候选显示后追加签名；更改组件组合时不把旧输入的签名用于过滤新输入。M07 一并保存，用于刷新后的去重。generateCandidates 仍是纯计算，不自行写入存储。
