# 设计参考与来源

资料核验日期：2026-10-22。以下是可回访的原始来源，不是已收录的截图集。当前未保存参考截图，也未完成与真实页面的视觉比对。

## 视觉与信息结构

| 来源 | 对应风格 | 本库建议研究的内容 | 转化为规则 |
| --- | --- | --- | --- |
| [Linear 产品功能页](https://linear.app/features) | `minimal-saas` | 任务与功能分组、产品信息层级 | 导航服务任务；内容区以清晰分组和少量主要行动组织 |
| [Lee Robinson 个人站](https://leerob.com/) | `developer-editorial` | 个人介绍、短笔记与文章索引的组织 | 内容优先；文章列表展示标题与日期，正文限制阅读宽度 |
| [Ant Design 布局规范](https://ant.design/docs/spec/layout/) | `enterprise-data` | 布局尺度、适配与栅格规则 | 对齐筛选、工具栏与结果；在数据密度和空间间取得一致性 |

“研究内容”和“转化规则”是本库的设计判断；三套候选配色、深浅主题和具体尺寸由本库定义，不能当作这些站点的官方 Token。尤其是 `developer-editorial` 的深色与薄荷色，不意味着参考站点采用同样主题。

## 实现与验证依据

| 来源 | 用途 | 当前状态 |
| --- | --- | --- |
| [Ant Design 主题](https://ant.design/docs/react/customize-theme/) | 后续映射全局与组件 Theme Token | 仅查阅，没有适配器 |
| [Ant Design 官方 Skills](https://github.com/ant-design/antd-skill) | 按目标项目版本辅助组件选型和 API 查阅 | 未安装 |
| [Storybook](https://storybook.js.org/docs) | 阶段 02 的组件预览与状态展示 | 未接入 |
| [Playwright 视觉比较](https://playwright.dev/docs/test-snapshots) | 阶段 04 的截图回归与环境约束 | 未接入 |
| [shadcn Registry](https://ui.shadcn.com/docs/registry) | 阶段 04 按需求评估分发 | 未接入 |
| [WCAG 2.2 文本对比度](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | 配色可读性目标 | 作为设计规则 |
| [WCAG 2.2 目标尺寸](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | 控件点击区域规则 | 作为设计规则 |

## 今后收录参考图时

记录来源页面、采集日期、视口、希望保留的设计决策和不适用的部分。外部页面会变化，单个图片链接不能作为长期设计规范。只有可合法保存的素材才收录本地，使用截图作参考不等于获得再次分发原素材的许可。
