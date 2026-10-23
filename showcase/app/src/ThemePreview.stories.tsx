import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePreview } from './ThemePreview';

const meta = {
  title: '基础/主题通路',
  component: ThemePreview,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ThemePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
