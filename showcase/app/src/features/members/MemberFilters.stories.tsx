import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { StoryFrame } from '../../../.storybook/StoryFrame';
import { MemberFilters } from './MemberFilters';
import { DEFAULT_QUERY } from './member-query';
import './members.css';

type FilterArgs = ComponentProps<typeof MemberFilters>;

function FiltersStoryHost(args: FilterArgs) {
  const [query, setQuery] = useState(args.query);
  return (
    <StoryFrame
      title="成员筛选"
      description="通过姓名或邮箱关键词与成员状态组合检索；结果计算由页面负责。"
      inputs="query：初始关键词、成员状态、排序和页码。修改 Controls 可重置初始查询；筛选器只编辑关键词与状态。"
      events="onChange 传出字段变更；onClear 请求清除筛选。此预览只为输入提供受控状态。"
      dependencies="Ant Design Input / Select / Button；完整筛选结果见成员页面 Story。"
    >
      <MemberFilters
        {...args}
        query={query}
        onChange={(change) => {
          args.onChange(change);
          setQuery((current) => ({ ...current, ...change, page: 1 }));
        }}
        onClear={() => {
          args.onClear();
          setQuery((current) => ({ ...current, keyword: '', status: 'all', page: 1 }));
        }}
      />
    </StoryFrame>
  );
}

const meta = {
  title: '成员/MemberFilters',
  id: 'members-filters',
  component: MemberFilters,
  parameters: { controls: { include: ['query'] } },
  args: { query: DEFAULT_QUERY, onChange: fn(), onClear: fn() },
  argTypes: {
    query: { control: 'object', description: '初始查询；修改此参数会重置预览，本 Story 不计算成员结果。' },
    onChange: { control: false, description: '传出关键词或状态的部分变更。' },
    onClear: { control: false, description: '请求清除关键词与状态。' },
  },
  render: (args) => <FiltersStoryHost key={JSON.stringify(args.query)} {...args} />,
} satisfies Meta<typeof MemberFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认与输入事件',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const keyword = canvas.getByRole('textbox', { name: '姓名或邮箱' });
    await expect(keyword).toHaveValue('');
    await userEvent.type(keyword, 'Member0');
    await waitFor(() => expect(keyword).toHaveValue('Member0'));
    await expect(args.onChange).toHaveBeenLastCalledWith({ keyword: 'Member0' });
    await userEvent.click(canvas.getByRole('button', { name: '清除筛选' }));
    await waitFor(() => expect(keyword).toHaveValue(''));
    await expect(args.onClear).toHaveBeenCalled();
  },
};

export const CombinedQuery: Story = {
  name: '组合筛选与清除',
  args: { query: { ...DEFAULT_QUERY, keyword: 'Member0', status: 'disabled' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const keyword = canvas.getByRole('textbox', { name: '姓名或邮箱' });
    await expect(keyword).toHaveValue('Member0');
    await expect(canvas.getByTitle('已停用')).toBeVisible();
    await userEvent.click(canvas.getByRole('combobox', { name: '成员状态' }));
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByTitle('启用'));
    await waitFor(() => expect(canvas.getByTitle('启用')).toBeVisible());
    await expect(keyword).toHaveValue('Member0');
    await expect(args.onChange).toHaveBeenLastCalledWith({ status: 'active' });
    await userEvent.click(canvas.getByRole('button', { name: '清除筛选' }));
    await waitFor(() => expect(keyword).toHaveValue(''));
    await waitFor(() => expect(canvas.getByTitle('全部状态')).toBeVisible());
    await expect(args.onClear).toHaveBeenCalled();
  },
};
