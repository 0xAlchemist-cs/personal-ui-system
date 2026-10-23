import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryFrame } from '../../.storybook/StoryFrame';
import { ContentPanel } from './ContentPanel';
import './shell.css';

const meta = {
  id: 'layout-content-panel',
  title: '布局/ContentPanel',
  component: ContentPanel,
  parameters: { layout: 'fullscreen', controls: { include: ['title', 'description'] } },
  args: {
    title: '成员列表',
    description: '把相关信息放在同一个内容区，保持标题、说明和正文的层级。',
    headingId: 'panel-members-title',
    children: (
      <div style={{ display: 'grid', gap: 'var(--pui-space-group)' }}>
        <p style={{ margin: 0 }}>筛选条件紧邻成员结果，分页放在结果之后，避免把同一项任务拆散。</p>
        <p style={{ margin: 0, color: 'var(--pui-color-muted)' }}>这里仅展示内容分组。表格、表单和完整页面的操作使用各自的真实组件 Story。</p>
      </div>
    ),
  },
  argTypes: {
    title: { control: 'text', description: '内容分组标题，渲染为 h2。' },
    description: { control: 'text', description: '紧随标题的可选说明。' },
    headingId: { control: false },
    headingRef: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <StoryFrame
      title="ContentPanel · 信息分组"
      description="用于有独立意义的内容区，以一层容器组织标题、说明和正文。上层页面保留唯一 h1。"
      inputs="title、可选 description、唯一 headingId、可选 headingRef 与 children。"
      events="无内置业务事件。headingRef 可用于编辑后原行消失时的焦点返回；操作由 children 提供。"
      dependencies="React、共享 Provider 的容器级 CSS 变量、global.css 与 shell.css；不新增主题或数据逻辑。"
    >
      <h1 style={{ marginBlock: '0 var(--pui-space-section)', fontSize: 'var(--pui-text-title)' }}>成员管理</h1>
      <ContentPanel {...args} />
    </StoryFrame>
  ),
} satisfies Meta<typeof ContentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationGrouping: Story = {
  name: '标题与内容分组',
};
