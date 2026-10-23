import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { StoryFrame } from '../../.storybook/StoryFrame';
import { AppShell } from './AppShell';
import { ContentPanel } from './ContentPanel';

const meta = {
  id: 'layout-app-shell',
  title: '布局/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  args: {
    children: (
      <>
        <header style={{ marginBlockEnd: 'var(--pui-space-section)' }}>
          <h1 id="members" tabIndex={-1} style={{ margin: 0, fontSize: 'var(--pui-text-title)' }}>成员管理</h1>
          <p style={{ color: 'var(--pui-color-muted)' }}>在同一个工作区检索成员并编辑基本信息。</p>
        </header>
        <ContentPanel title="成员列表" description="成员页面的主要内容区。" headingId="shell-members-title">
          <p style={{ margin: 0 }}>筛选、结果和分页在这里共同组成一个任务区域；可操作的业务示例见成员管理页面 Stories。</p>
        </ContentPanel>
      </>
    ),
  },
  argTypes: { children: { control: false } },
  render: (args) => (
    <StoryFrame
      title="AppShell · 响应式工作台"
      description="复用真实页面骨架。宽屏固定侧栏，小屏通过导航按钮打开抽屉；使用浏览器改变实际预览视口。"
      inputs="children：当前页面内容。断点来自共享 Token，iframe 宽度决定布局。"
      events="当前导航跳转到成员管理标题；小屏支持打开、关闭、Escape 与焦点返回。"
      dependencies="React、Ant Design Drawer/Button、共享主题 Provider、布局 Token 和应用内焦点处理。"
      fullScreen
    >
      <AppShell {...args} />
    </StoryFrame>
  ),
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WideNavigation: Story = {
  name: '宽屏导航',
};

export const CompactNavigation: Story = {
  name: '小屏抽屉',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.queryByRole('button', { name: '打开工作台导航' });
    // The real viewport controls the shell; selecting this story never fakes window size.
    if (!trigger) return;
    await userEvent.click(trigger);
    await expect(await canvas.findByRole('dialog', { name: '工作台导航' })).toBeVisible();
  },
};
