import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { StoryFrame } from '../../../.storybook/StoryFrame';
import { EditMemberDialog } from './EditMemberDialog';
import { mockMembers } from './mock-members';
import './members.css';

type DialogArgs = ComponentProps<typeof EditMemberDialog>;

function DialogStoryHost({ member, onSave, onCancel, onAfterClose }: DialogArgs) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <StoryFrame
      title="编辑成员对话框"
      description="编辑姓名和邮箱，演示字段校验、禁用原因与键盘焦点。已停用成员也可编辑。"
      inputs="member：固定演示记录。打开状态由此 Story 的触发按钮管理。"
      events="onSave 传出姓名与邮箱；onCancel 取消；onAfterClose 返回触发焦点。实际保存及反馈见完整页面 Story。"
      dependencies="Ant Design Modal / Form / Input / Button；复用组件的表单规则与焦点圈定，不另写校验。"
    >
      <Button ref={trigger} onClick={() => setOpen(true)}>编辑演示成员</Button>
      <EditMemberDialog
        member={member}
        open={open}
        onSave={(values) => { onSave(values); setOpen(false); }}
        onCancel={() => { onCancel(); setOpen(false); }}
        onAfterClose={() => { onAfterClose(); trigger.current?.focus(); }}
      />
    </StoryFrame>
  );
}

const meta = {
  title: '成员/EditMemberDialog',
  id: 'members-edit-dialog',
  component: EditMemberDialog,
  parameters: { controls: { disable: true } },
  args: {
    member: mockMembers[2]!,
    open: false,
    onSave: fn(),
    onCancel: fn(),
    onAfterClose: fn(),
  },
  argTypes: {
    member: { control: false, description: '固定的已停用演示成员；通过实际表单编辑姓名和邮箱。' },
    open: { control: false, table: { disable: true } },
    onSave: { control: false },
    onCancel: { control: false },
    onAfterClose: { control: false },
  },
  render: (args) => <DialogStoryHost {...args} />,
} satisfies Meta<typeof EditMemberDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '有效表单',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '编辑演示成员' }));
    const dialog = within(await canvas.findByRole('dialog', { name: '编辑成员' }));
    await expect(dialog.getByRole('textbox', { name: '姓名' })).toHaveValue(args.member!.name);
    await expect(dialog.getByRole('textbox', { name: '邮箱' })).toHaveValue(args.member!.email);
    await waitFor(() => expect(dialog.getByRole('button', { name: /^保\s*存$/ })).toBeEnabled());
  },
};

export const InvalidFields: Story = {
  name: '字段错误与禁用原因',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '编辑演示成员' }));
    const dialog = within(await canvas.findByRole('dialog', { name: '编辑成员' }));
    const name = dialog.getByRole('textbox', { name: '姓名' });
    const email = dialog.getByRole('textbox', { name: '邮箱' });
    await userEvent.clear(name);
    await userEvent.type(name, ' ');
    await userEvent.click(email);
    await userEvent.clear(email);
    await userEvent.type(email, 'invalid-email');
    await userEvent.tab();
    await waitFor(() => expect(dialog.getByText('请输入非空姓名。')).toBeVisible());
    await waitFor(() => expect(dialog.getByText('请输入有效的邮箱地址。')).toBeVisible());
    await expect(name).toHaveValue(' ');
    await expect(email).toHaveValue('invalid-email');
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(dialog.getByRole('button', { name: /^保\s*存$/ })).toBeDisabled();
    await expect(dialog.getByText('请填写非空姓名和有效邮箱后保存。')).toBeVisible();
    await expect(args.onSave).not.toHaveBeenCalled();
  },
};

export const KeyboardFocus: Story = {
  name: '键盘圈定与取消返回',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '编辑演示成员' });
    await userEvent.click(trigger);
    const dialogElement = await canvas.findByRole('dialog', { name: '编辑成员' });
    const dialog = within(dialogElement);
    await waitFor(() => expect(dialog.getByRole('textbox', { name: '姓名' })).toHaveFocus());
    for (let index = 0; index < 8; index += 1) {
      await userEvent.tab();
      await expect(dialogElement.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog', { name: '编辑成员' })).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(args.onCancel).toHaveBeenCalled();
    await expect(args.onAfterClose).toHaveBeenCalled();
    await expect(args.onSave).not.toHaveBeenCalled();
  },
};
