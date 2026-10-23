import { Spin } from 'antd';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useArgs } from 'storybook/preview-api';
import { expect, fn } from 'storybook/test';
import { StoryFrame } from '../../../.storybook/StoryFrame';
import { MemberTable } from './MemberTable';
import { DEFAULT_QUERY, queryMembers } from './member-query';
import { mockMembers } from './mock-members';

type TableStoryArgs = ComponentProps<typeof MemberTable> & { loading: boolean };
const initial = queryMembers(mockMembers, DEFAULT_QUERY);

const meta = {
  id: 'members-table',
  title: '成员/MemberTable',
  component: MemberTable,
  parameters: { controls: { include: ['loading', 'page', 'sort'] } },
  args: {
    ...initial,
    sort: 'desc',
    hasMembers: true,
    loading: false,
    onPageChange: fn(),
    onSortChange: fn(),
    onEdit: fn(),
    onClearFilters: fn(),
  },
  argTypes: {
    page: { control: { type: 'number', min: 1, max: 3, step: 1 } },
    sort: { control: 'radio', options: ['desc', 'asc'] },
    loading: { control: 'boolean', description: '仅在 Story 中用 Spin 包装实际表格，产品页不模拟等待。' },
    rows: { control: false },
    total: { control: false },
    hasMembers: { control: false },
    onPageChange: { control: false },
    onSortChange: { control: false },
    onEdit: { control: false },
    onClearFilters: { control: false },
  },
  render: function TableExample(args) {
    const [, updateArgs] = useArgs<TableStoryArgs>();
    const result = queryMembers(args.hasMembers ? mockMembers : [], {
      ...DEFAULT_QUERY, page: args.page, sort: args.sort,
    });
    return (
      <StoryFrame
        title="成员表格"
        description="隔离查看日期排序、分页、文字状态与局部横向滚动。编辑事件在 Actions 中记录，完整保存流程见成员管理页面。"
        inputs="rows / total / page / sort / hasMembers；本 Story 的数据来自固定样本与 queryMembers，Controls 仅开放页码、排序和加载模拟。"
        events="onPageChange、onSortChange、onEdit、onClearFilters；分页和排序同步演示参数，不复制页面查询逻辑。"
        dependencies="MemberTable、queryMembers、30 条固定记录、Ant Design Table/Pagination/Tag/Empty；Spin 仅用于此 Story。"
      >
        {args.loading && <p className="pui-story-loading-note" role="status">正在加载成员（仅 Story 模拟，无真实请求）。可通过 Controls 关闭加载。</p>}
        <Spin spinning={args.loading} description="正在加载成员">
          <div inert={args.loading} aria-busy={args.loading}>
            <MemberTable
              {...args}
              {...result}
              onPageChange={(page) => { args.onPageChange(page); updateArgs({ page }); }}
              onSortChange={(sort) => { args.onSortChange(sort); updateArgs({ sort, page: 1 }); }}
            />
          </div>
        </Spin>
      </StoryFrame>
    );
  },
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: '默认 · 排序与分页' };
export const Loading: Story = { name: '加载 · 仅 Story 模拟', args: { loading: true } };
export const Empty: Story = {
  name: '无初始数据',
  args: { rows: [], total: 0, page: 1, hasMembers: false },
  parameters: { controls: { include: ['loading'] } },
};
export const KeyboardFocus: Story = {
  name: '焦点 · 可滚动表格',
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: '成员列表，可横向滚动' });
    region.focus();
    await expect(region).toHaveFocus();
  },
};
