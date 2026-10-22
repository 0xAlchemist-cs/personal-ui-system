# Ant Design 组件选型约定

状态：`draft`；当前没有封装组件、依赖安装或可运行示例。

## 使用顺序

先检查目标项目是否使用 Ant Design 和它的实际版本，再查已有业务组件。优先官方组件，只有明确存在重复业务需求时才封装；复杂数据或表单场景按实际需求评估 ProComponents，不为了少写几行代码直接增加依赖。

| 界面职责 | 优先评估的官方组件 |
| --- | --- |
| 导航与页面结构 | Layout、Menu、Breadcrumb |
| 列表与筛选 | Table、Input、Select、Pagination |
| 编辑与提交 | Form、Input、Modal、Drawer、Button |
| 加载与结果 | Spin、Skeleton、Empty、Alert、Result |

以上是选型方向，具体 API、受控状态和导入方式需查目标安装版本的官方文档与 [官方 Skills](https://github.com/ant-design/antd-skill)。本库已通过 CLI 接入 [项目级 Skill](../../.agents/skills/antd/SKILL.md)，全局另有 `ant-design` 与 `antd`；本文件是本库选型约定。

## 主题映射方向

通过 `ConfigProvider` 配置主题，优先使用公开 Theme Token，避免以脆弱 CSS 选择器覆盖组件内部结构。[官方主题文档](https://ant.design/docs/react/customize-theme/)

| 本库语义 | Ant Design 候选 Token | 转换注意 |
| --- | --- | --- |
| `color.accent` | `colorPrimary` | 解析别名后传颜色值 |
| `font.body` | `fontFamily` | 保留字体回退栈 |
| `radius.control` | `borderRadius` | 本库为带单位字符串；按目标 API 转成对应数值，不能直接盲传 |
| `size.control` | `controlHeight` | 区分数值单位、密度与触屏目标 |

这是后续适配器的输入约定，不是已验证代码。深色算法、组件级配置和版本兼容性在真实项目中确认，不把整份本库 JSON 直接传入 `theme.token`。

新封装通过 [资产生命周期](../../docs/asset-lifecycle.md) 的验证与审核后再收录。
