# Token 数据约定

当前采用本库自定义 JSON 约定，`schemaVersion: "1.0"`；不是 DTCG、Ant Design 或 shadcn 的原生格式。[首版工作台](../../showcase/app/README.md) 已提供应用内 Resolver、CSS 变量和 Ant Design 适配；没有独立发布的通用解析器、生成器或适配包。

## 分层

1. [primitives.json](primitives.json)：原始颜色、字体、尺寸与尺度，名称表达物理值。
2. [semantic.json](semantic.json)：描述用途的别名，例如 `color.text`、`space.section`、`size.control`。
3. 组件 Token：后续有实际组件时才增加；目前不预先创建按钮、卡片等重复配置。

预设位于 [styles](../styles/README.md)，只覆盖既有语义名称，避免风格切换改变调用接口。

## 解析契约

- `tokens` 是扁平键值表，所有值为字符串。
- `{color.blue.600}` 表示**完整值**引用，不支持字符串插值或运算。
- 先合并 `primitives.tokens` 与 `semantic.tokens`，两层的键不得冲突；再以预设的 `tokens` 覆盖同名语义键。
- 预设只能覆盖已存在的语义键。递归解析引用，未知键和循环引用均为错误。
- 引用应保持单向：语义指向原始或语义；未来组件层指向语义。不允许原始层反向依赖语义层。
- 消费者读取解析后的语义值。颜色采用 HEX，尺寸字符串携带 CSS 单位，字体为 CSS 字体栈，行高为无单位数字字符串。

例如：`minimal-saas` 中的 `color.accent` → `{color.blue.600}` → `#2563eb`。首版工作台在共同 Provider 内将解析结果映射为 `--pui-color-accent` 等容器级 CSS 变量，不生成独立 CSS 文件。

## 使用边界

| 语义 | 用途 | 限制 |
| --- | --- | --- |
| `color.canvas / surface / elevated` | 页面、容器、浮层背景 | 配对检查文字对比度 |
| `color.text / muted` | 正文与次要信息 | muted 仍需可读，不任意降低透明度 |
| `color.accent / onAccent` | 主要操作背景与其文字 | 必须成对使用；悬停使用 `accentHover` |
| `color.border` | 分组和装饰边界 | 不能单独作为必需控件的唯一可辨边界 |
| `color.controlBorder / focus` | 控件边界与焦点 | 实现时再检查相邻背景和焦点可见性 |
| `color.success / warning / error` | 状态文字或图标 | 搭配相应 Background 和明确文案 |
| `size.control / controlTouch` | 桌面与触屏控件高度目标 | 高度不等于完整点击区域或可访问性保证 |
| `layout.* / space.* / text.*` | 布局、间距与字体 | 以项目约束和内容适配结果为准 |

三套预设为 `draft`。静态颜色对比计算不等于实际页面验收，也不能证明透明度、图表、组件状态或所有文字搭配都符合要求。
