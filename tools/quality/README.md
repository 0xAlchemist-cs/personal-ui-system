# 知识库质量检查

此目录只包含开发校验工具；消费者与 Showcase 运行依赖继续独立。使用 Node **22.15.x / 22.x（至少 22.15.0）**、npm 10 以上；CI 固定 Node 22.15.0、npm 11.16.0。三个直接依赖锁定为 AJV 8.17.1、YAML 2.8.1、mdast-util-from-markdown 2.0.2，安装以本目录锁文件为准。

在仓库根目录执行：

```sh
npm ci --prefix tools/quality
npm run check --prefix tools/quality
npm test --prefix tools/quality
```

Windows 若命令优先命中不适用的 PowerShell shim，可使用 `npm.cmd`。命令默认根据脚本位置定位仓库，额外的 `--root <directory>` 只用于检查独立副本/测试样本。检查失败退出 1，测试失败同样非零退出，不自动修复输入。

## 真实覆盖

- 解析自有 JSON/YAML，拒绝 YAML 重复键、多文档、语法错误及非 JSON 的循环/非有限值。
- 由 [AJV 的 Draft 2020-12 引擎](https://ajv.js.org/json-schema.html#draft-2020-12-breaking) 编译唯一的 [Brief Schema](../../briefs/ui-brief.schema.json)，校验 `briefs/examples/*.yaml` 和 `showcase/*.brief.yaml`；执行嵌套规则、`$ref`、`allOf/if/then`、枚举、数量与唯一性等完整 Schema 语义，且不启用类型转换、默认值或字段删除。
- 校验 Brief 预设组合与实际预设元数据一致；三套风格仍保留现有成熟度，不因通过静态检查晋级。
- 直接复用 [现有 Token Resolver](../../showcase/app/src/theme/resolve-tokens.ts)：先检查原始/语义基础图，再检查全部预设；拒绝非字符串字典、未知/循环/反向引用、非法覆盖和插值。
- 使用 [Markdown 语法树](https://github.com/syntax-tree/mdast-util-from-markdown) 检查实际 link/image/reference 的本地文件或目录目标，支持编码路径与空格，跳过代码、外部 URL、纯片段和未使用定义。普通路径相对源文件，`/path` 相对仓库根；拒绝越界、盘符、file URL 与符号链接逃逸。

扫描排除依赖/构建产物、`.git`、`.agents`、`docs/imports` 等保留的第三方或原始档案正文；自有文档指向这些仓库内目标时仍检查存在性。标题锚点、外网可达性、HTML 原始标签和一般 Markdown 文风不在本命令范围。undefined reference 不形成 Markdown 链接，不能把该检查当成完整 Markdown lint。

Node 22.15 通过 [原生类型擦除](https://nodejs.org/download/release/v22.15.0/docs/api/typescript.html#type-stripping) 运行上述纯 TS Resolver；命令带 `--experimental-strip-types`，保留该版本的实验性提示。它不做 TypeScript 类型检查；Showcase CI 单独执行现有 `typecheck`。Resolver 若引入需要转换的 TS 特性，应明确调整工具运行方式，不能另复制一套解析逻辑。

## CI 与验收边界

[Quality workflow](../../.github/workflows/quality.yml) 在 main/codex 分支 push 和 PR 上运行：一个 job 独立安装本工具锁文件、检查并测试；另一个 job 安装 Showcase 自己的锁文件，复用其类型、Lint、Vitest、应用及 Storybook 构建命令。Action 固定完整提交，权限为 contents:read，任务进程无 NODE_PATH/Node 预加载。没有忽略失败的步骤，也没有浏览器、视觉基线、部署或分发。

测试在自建临时目录改变输入，不修改真实 Brief/Token。覆盖 Schema 嵌套/组合约束、YAML 错误、Token 图和链接边界，并真实启动 CLI 核对失败退出码。Windows 大小写用例明确跳过，Linux CI 执行；文件系统符号链接能力不足时单独报告跳过。测试与构建通过仍不能代替实际 UX、键盘、读屏和视觉验收。
