# Personal UI System — 计划包使用说明

## 适用基线

根据公开仓库 `0xAlchemist-cs/personal-ui-system` 的 `main@31e29456a610efd12e89a6957a26a90d967aa415`（2026-10-23）编写，仅涉及规划文件，**尚未更改用户 GitHub 仓库**。执行前先检查 HEAD 与本地工作区；如计划已变化，应审查差异再合并。

## 安装（不覆盖已有计划）

1. 复制 `docs/superpowers/MASTER-PLAN.md` 到仓库同名路径。
2. 复制 `docs/superpowers/plans/2026-10-23-phase03-consumer-pilot.md` 与 `2026-10-23-phase04-quality-and-distribution.md` 到仓库对应路径。
3. 将 `docs/superpowers/append-to-existing-showcase-v1.md` **从 `## Task 微型执行 Prompt` 开始的章节内容，追加到原有** `docs/superpowers/plans/2026-10-23-showcase-v1.md` 末尾。原计划任务 1～5 正文不得改写或覆盖。
4. 在 `AGENTS.md` 新增**一行导航**：`如用户要求执行阶段计划，先读取 docs/superpowers/MASTER-PLAN.md，并只执行当前阶段计划的指定 Task。`；仅加这一行，不复制总纲全文。
5. 在 `docs/roadmap.md` 增加指向总纲的新链接即可，不复制阶段定义。保持 Phase 02/03/04 的实际状态均为未实施。
6. 检查 Markdown 相对路径、Git diff 与文件格式；本次只有文档落地，不要安装运行时依赖、执行 Showcase 实现、更新资产为 validated 或声称跑过页面验收。

## 最小审查命令（示例）

```bash
git status --short
git diff --check
git diff -- AGENTS.md docs/roadmap.md docs/superpowers/
```

## 给 Codex 的文档落地指令

> 在当前 `personal-ui-system` 仓库中，以本计划包的 `APPLY.md` 为唯一落地操作清单。先检查 `git status` 和当前 HEAD；遇到与基线不同的修改，先保留现有内容并做最小合并。新增总纲、Phase 03/04 条件计划；把微型 Prompt 章节追加到**原有** Showcase V1 计划末尾，不替换任务正文；给 AGENTS.md 和 roadmap 只加导航链接。验收本次仅限文档路径、链接和差异检查，禁止实施任何 Phase 02/03/04 的代码任务。完成后报告实际文件差异、检查结果和下一张可执行 Task 卡。
