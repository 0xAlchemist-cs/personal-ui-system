# P04-A1 — 持续静态校验与真实 CI

日期：2026-10-24。仅执行 [Task A1](../superpowers/plans/2026-10-23-phase04-quality-and-distribution.md#task-a1--把既有静态检查做成脚本和-ci)，沿用 [Gate 03 收口](2026-10-24-p03-t4-closeout.md) 确定的重复检查；不改写既有计划、Brief Schema、Token 值或消费者。

**A1 已完成。** 独立质量工具、锁文件、有效/破坏样本测试和两个 CI job 已实际运行。初次实现提交为 `e41fa82a7416d57e7b4a1cac515d1d982e10ca59`；[真实 GitHub Actions 运行 40064509154](https://github.com/0xAlchemist-cs/personal-ui-system/actions/runs/40064509154) 的两个 job 均成功。A2、A3 及分发轨道未执行，Gate 04 尚未收口。

## 版本、复用与文件变更

- 开始时 `main`、origin/main 与隔离工作树均为 `e8dbe3e8036b8806cdfcfbdf76d766b0bb252221`，工作区干净；此前没有 workflow 或可复现的完整 Schema 命令。基线与工具核验见 [preflight](../../tests/manual/quality-a1/preflight.json)。
- 新增 `tools/quality/` 的 package/lock、CLI、校验模块、Markdown 模块、两份测试和说明；只安装开发校验依赖 AJV **8.17.1**、YAML **2.8.1**、mdast-util-from-markdown **2.0.2**，没有根目录或消费者运行依赖。
- 直接导入工作台现有 `resolve-tokens.ts`，未复制或重写解析器；基础图及全部三套预设都执行其契约。Showcase 的 package/lock、类型/Lint/Vitest/应用及 Storybook 构建命令保持原样。
- 新增 [.github/workflows/quality.yml](../../.github/workflows/quality.yml)，更新当前状态、Brief/Token/测试说明。未修改已冻结的 Schema、Brief 数据、Token JSON、应用组件、消费者快照或历史验收文件。

## 可复现命令与校验语义

在仓库根目录执行：

```sh
npm ci --prefix tools/quality
npm run check --prefix tools/quality
npm test --prefix tools/quality
npm ci --prefix showcase/app
npm run typecheck --prefix showcase/app
npm run lint --prefix showcase/app
npm test --prefix showcase/app
npm run build --prefix showcase/app
npm run build-storybook --prefix showcase/app
```

Windows 可使用 `npm.cmd`。质量工具根据脚本位置定位根目录，不依赖调用者 cwd；失败返回 1。完整使用及边界见 [工具说明](../../tools/quality/README.md)。

| 检查 | 已实现的行为 |
| --- | --- |
| 完整 Draft 2020-12 | 使用 [AJV2020](https://ajv.js.org/json-schema.html#draft-2020-12-breaking) 编译唯一的 `briefs/ui-brief.schema.json`，自检 Schema，运行 `$ref`、嵌套 additionalProperties、allOf/if/then、枚举、数量、唯一性等规则；不做手写字段近似检查，不转换类型、不填默认值、不删除字段 |
| YAML | 拒绝语法错误、重复键、多文档、非有限值与循环 JSON 数据；错误带原解析信息；普通共享 alias 可用 |
| Token | 先核对扁平字符串字典及基础图，再逐一检查三套预设；现有 Resolver 拒绝冲突、未知/循环/反向引用、非法覆盖和部分插值；Brief 元数据另与实际所选预设比较 |
| Markdown | 使用语法树检查活跃 link/image/reference 的本地目标，支持 URI 编码、目录及文件名空格/括号；路径及 realpath 不能越界，代码和外部 URL 不联网检查 |

依赖/生成目录及保留的 `.agents`、`docs/imports` 等第三方正文不扫描；自有链接指向这些仓库内文件时仍核对目标。标题锚点、原始 HTML 标签、未形成链接的 undefined reference、外网可达性和文风不在范围。没有将静态通过推广为 UX 或视觉认证。

## 干净检出与真实执行

本地通过 `git clone --no-local --branch codex/p04-a1 <本仓库> <新目录>` 取得上述实现提交，初始两处 node_modules 均不存在；质量工具在安装 Showcase 之前已经独立检查与测试成功，未借用工作台 node_modules。任务进程清除 NODE_PATH/Node 预加载，不更改全局环境。

[干净运行记录](../../tests/manual/quality-a1/clean-check.json) 保存 Windows `10.0.26100`、Node **22.15.0**、npm **11.16.0**、实际命令与退出码。九项命令均退出 0，两份锁文件前后不变，检出工作区仍干净。npm 可以复用下载缓存；源码/安装目录没有链接到原工作树。

| 结果 | 本地干净检出 | Ubuntu 24.04 GitHub CI |
| --- | --- | --- |
| 知识库检查 | 通过；完整 Schema、三份 Brief、三套预设与本地链接 | 通过 |
| 质量工具测试 | 39 项：38 通过、1 项 Windows 大小写语义跳过 | **39 通过、0 跳过**，含 Linux 大小写路径测试 |
| Showcase 类型/Lint | 均通过 | 均通过 |
| Showcase Vitest | **78 通过** | **78 通过** |
| 应用 / Storybook | 均构建成功 | 均构建成功 |

本地原始输出：[knowledge](../../tests/manual/quality-a1/knowledge.txt)、[quality tests](../../tests/manual/quality-a1/quality-tests.txt)、[typecheck](../../tests/manual/quality-a1/typecheck.txt)、[lint](../../tests/manual/quality-a1/lint.txt)、[78 tests](../../tests/manual/quality-a1/unit-tests.txt)、[build](../../tests/manual/quality-a1/build.txt)、[Storybook](../../tests/manual/quality-a1/storybook-build.txt)。安装输出也保存在同目录。

[CI 运行记录](../../tests/manual/quality-a1/ci-run.json) 及 [知识库 job 原始日志](../../tests/manual/quality-a1/ci-knowledge.txt)、[Showcase job 原始日志](../../tests/manual/quality-a1/ci-showcase.txt) 对应同一个实现 SHA。CI 固定 Node/npm、Actions 完整提交及两份 npm 锁文件，使用独立干净 job；npm 缓存不替代 npm ci。触发 push/PR，contents:read，不保留 checkout 凭据，没有 continue-on-error 或忽略失败的 shell 命令。未配置强制分支保护，不能将 workflow 已存在称为 PR 已被强制拦截。

[证据一致性记录](../../tests/manual/quality-a1/verification.json) 核对 CI 与本地干净检出 SHA、九项退出码、两份锁文件、测试数量、原始日志哈希及变更范围；实现代码与已验收 CI 提交保持一致。收口文档作为后续提交，仍由同一 workflow 检查。

原始 TXT 按字节保留工具的换行、空行和行尾空格，属性禁止对此目录日志作换行转换，保证保存的 SHA-256 可复核。Git 空白检查排除原始 TXT，检查其余文档、脚本和 JSON；质量命令的语法/链接检查范围不因此改变。

## 失败样本与开发修复

质量测试包含完整有效样本，以及数字版本、缺状态详情、未知顶层/嵌套字段、错误预设组合、重复/缺失状态、空/重复列表、错误交互 ID、YAML 错误、Token 冲突/循环/反向依赖/非法覆盖、坏链接与路径逃逸。还以 Draft 2020-12 tuple 规则证明引擎实际执行新版本语义。

四类测试真实启动 CLI，分别注入缺字段 Brief、坏 YAML、非字符串 Token、缺文件链接，断言**退出 1 且错误规则正确**。测试通过表示这些坏输入被拒绝，并非容错忽略；样本只在自建临时目录中生成。对应断言、诊断与 TAP 证据见 [测试代码](../../tools/quality/test/contracts.test.mjs) 和上述质量测试日志。

初次集成误把异步链接检查当同步结果，出现 `links.errors is not iterable`，已在校验器与 CLI 中正确 await；初次 Windows 沙箱对 promises.realpath 报 EPERM，提升后的同一检查通过，未删除 realpath 安全判断。[开发失败记录](../../tests/manual/quality-a1/development-failures.json) 与 [原始链接测试输出](../../tests/manual/quality-a1/development-links-initial.txt) 保留原因/修复。之后当前实现、本地干净检出和真实 CI 均已通过。独立代码审查未发现阻断问题。

## 环境约束、剩余风险与下一项

质量命令直接复用纯 TS Resolver，Node 22.15 使用原生 `--experimental-strip-types`，保留实验性提示；该能力不执行 TS 类型检查，类型检查由 Showcase 独立完成。不宣称质量工具已兼容 Node 24 或任意 TS 转换语法。

保留既有应用/Storybook 大于 500 kB 的构建警告，未改阈值或优化页面；此处检查的是 Showcase，非消费者的 603.87 kB 页面。本地安装还提示 esbuild postinstall 未纳入 npm allowScripts；未修改全局脚本策略或自动审批，当前构建实际通过，原始提示留在安装日志。

本轮没有启动浏览器、重做 Phase 02/03 页面验收或建立截图基线，也没有扩展其他框架或分发能力。既有视觉成熟度与消费者来源钉住不变。

下一张任务卡为 **[P04-A2｜浏览器与视觉基线](../superpowers/plans/2026-10-23-phase04-quality-and-distribution.md#p04-a2浏览器与视觉基线)**：按原卡选择少量关键旅程；视觉回归仅在确认需求、固定环境并人工审阅后启用。A1 的 CI 成功不等于 Gate 04 完成。
