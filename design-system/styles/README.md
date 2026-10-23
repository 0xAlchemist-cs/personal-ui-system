# 风格目录

以下三套预设版本为 0.1.0。`minimal-saas` 仅在 [已验收的成员管理场景](minimal-saas.md) 为 `validated`，其余两套保留 `draft`，没有 `approved` 预设。它们共享 [语义 Token](../tokens/README.md) 的命名，通过颜色、字体、尺度和布局规则区分气质，不对应三套组件实现。

| 预设 ID | 页面特征 | 默认配置 | 规则 | 数据 |
| --- | --- | --- | --- | --- |
| `minimal-saas` | 任务驱动、轻量管理、设置 | light / comfortable / blue / medium | [说明](minimal-saas.md) | [JSON](minimal-saas.json) |
| `developer-editorial` | 技术文章、个人主页、阅读 | dark / comfortable / mint / medium | [说明](developer-editorial.md) | [JSON](developer-editorial.json) |
| `enterprise-data` | 数据密集、复杂筛选、批量操作 | light / compact / blue / small | [说明](enterprise-data.md) | [JSON](enterprise-data.json) |

## 选择规则

优先考虑核心任务和信息密度，再参考视觉偏好。同一页面选一套主风格；不同独立项目可以分别选择。不要把深色、玻璃效果、大圆角与紧凑数据表无依据地混合。

JSON 中的 `theme`、`density`、`accent` 和 `radius` 描述当前预设的固定组合，`tokens` 给出相对基础语义层的覆盖。在 UI Brief 1.0 中这些字段必须与所选预设一致。希望新增浅色 Editorial、其他品牌色或不同密度时，先作为设计变体提出，更新规则、数据和 Brief 契约后再使用，不把声明当作已经实现的主题切换能力。

`space.pageMobile` 与 `size.controlTouch` 是每个预设都有的响应式语义值，不属于新的风格变体。框架已有的响应式行为优先复用。
