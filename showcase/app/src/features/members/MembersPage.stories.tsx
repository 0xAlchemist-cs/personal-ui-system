import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { StoryFrame } from '../../../.storybook/StoryFrame';
import { MembersPage } from './MembersPage';
import { mockMembers } from './mock-members';

const meta = {
  id: 'members-page',
  title: '成员/MembersPage',
  component: MembersPage,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  args: { initialMembers: mockMembers },
  argTypes: { initialMembers: { control: false } },
  render: (args, context) => (
    <StoryFrame
      title="成员管理完整页面"
      description="复用实际页面的导航、组合筛选、创建时间排序、分页和编辑。保存修改仅存在当前 Story 的页面内存；重新进入 Story 恢复固定记录。"
      inputs="initialMembers：固定合成成员集合，默认 30 条；无初始数据 Story 传入空集合。筛选无结果与保存反馈通过实际页面操作触发。"
      events="搜索、状态筛选、排序及分页更新页面查询；编辑打开原有对话框，保存更新内存并提示刷新恢复，取消保留记录。保存反馈正常在约 3 秒后消失，可再次编辑成员重现。"
      dependencies="MembersPage、AppShell、ContentPanel、MemberFilters、MemberTable、EditMemberDialog、固定 mockMembers 与共同 ShowcaseThemeProvider；没有网络请求或持久化服务。"
      fullScreen
    >
      <MembersPage key={context.id} {...args} />
    </StoryFrame>
  ),
} satisfies Meta<typeof MembersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认 · 30 条固定成员',
};

export const Empty: Story = {
  name: '无初始数据',
  args: { initialMembers: [] },
};

export const NoResults: Story = {
  name: '筛选无结果 · 保留输入',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const keyword = canvas.getByRole('textbox', { name: '姓名或邮箱' });
    await userEvent.clear(keyword);
    await userEvent.type(keyword, 'no-such-member');
    await expect(keyword).toHaveValue('no-such-member');
    await expect(canvas.getByText('没有符合条件的成员')).toBeVisible();
    await expect(within(canvas.getByRole('search', { name: '筛选成员' })).getByRole('button', { name: '清除筛选' })).toBeEnabled();
  },
};

export const Saved: Story = {
  name: '保存成功 · 页面内存',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '编辑演示成员30' }));
    const dialog = within(await canvas.findByRole('dialog', { name: '编辑成员' }));
    const name = dialog.getByRole('textbox', { name: '姓名' });
    const email = dialog.getByRole('textbox', { name: '邮箱' });
    // Wait for the real dialog opening/focus lifecycle before entering edits.
    await waitFor(() => expect(name).toHaveFocus());
    await userEvent.clear(name);
    await userEvent.type(name, '演示成员30（已编辑）');
    await userEvent.clear(email);
    await userEvent.type(email, 'edited30@example.test');
    await expect(name).toHaveValue('演示成员30（已编辑）');
    await expect(email).toHaveValue('edited30@example.test');
    const save = dialog.getByRole('button', { name: /^保\s*存$/ });
    await waitFor(() => expect(save).toBeEnabled());
    await userEvent.click(save);
    await expect(canvas.getByText('演示成员30（已编辑）', { exact: true })).toBeVisible();
    await expect(canvas.getByText('edited30@example.test', { exact: true })).toBeVisible();
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('演示修改已保存，刷新后恢复初始数据。')).toBeVisible();
    await waitFor(() => expect(canvas.queryByRole('dialog', { name: '编辑成员' })).not.toBeInTheDocument());
  },
};
