import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryFrame } from '../.storybook/StoryFrame';
import { ThemePreview } from './ThemePreview';

const meta = {
  title: '基础/主题通路',
  component: ThemePreview,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: () => (
    <StoryFrame
      title="基础主题通路"
      description="查看现有 Token 到 Ant Design 的主题、基础控件与上下文反馈。"
      inputs="固定 minimal-saas 预设；本 Story 不切换主题或密度。"
      events="显示提示按钮触发 App 上下文消息；保存禁用的原因在页面就地说明。"
      dependencies="ThemePreview、共同 ShowcaseThemeProvider、Token Resolver、Ant Design ConfigProvider/App/Button/Input。"
      fullScreen
    >
      <ThemePreview />
    </StoryFrame>
  ),
} satisfies Meta<typeof ThemePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
