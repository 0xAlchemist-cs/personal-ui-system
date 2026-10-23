import { Button, Form, Input, Modal } from 'antd';
import type { InputRef } from 'antd';
import { useEffect, useId, useRef, useState } from 'react';
import type { Ref } from 'react';
import { containDialogTab } from '../../components/dialog-focus';
import type { Member, MemberEdits } from './types';

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onSave: (values: MemberEdits) => void;
  onCancel: () => void;
  onAfterClose: () => void;
}

interface MemberEditFormProps {
  member: Member;
  nameInputRef: Ref<InputRef>;
  onSave: (values: MemberEdits) => void;
  onCancel: () => void;
}

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

function MemberEditForm({ member, nameInputRef, onSave, onCancel }: MemberEditFormProps) {
  const [form] = Form.useForm<MemberEdits>();
  const values = Form.useWatch([], form);
  const [validation, setValidation] = useState<{ values: unknown; valid: boolean } | null>(null);
  const submittable = validation?.valid === true && validation.values === values;
  const helpId = useId();
  const reasonId = useId();

  useEffect(() => {
    let current = true;
    // The same rules determine button availability and final submission.
    void form.validateFields({ validateOnly: true }).then(
      () => { if (current) setValidation({ values, valid: true }); },
      () => { if (current) setValidation({ values, valid: false }); },
    );
    return () => { current = false; };
  }, [form, values]);

  return (
    <Form<MemberEdits>
      form={form}
      name="edit-member"
      layout="vertical"
      initialValues={{ name: member.name, email: member.email }}
      validateTrigger="onBlur"
      autoComplete="off"
      noValidate
      aria-describedby={helpId}
      onFinish={(edits) => onSave({ name: edits.name.trim(), email: edits.email.trim() })}
      scrollToFirstError={{ focus: true }}
    >
      <p id={helpId} className="members-edit-help">仅修改姓名和邮箱。演示修改保存在当前页面，刷新后恢复。</p>
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, whitespace: true, transform: trimValue, message: '请输入非空姓名。' }]}
      >
        <Input ref={nameInputRef} />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[{ required: true, type: 'email', transform: trimValue, message: '请输入有效的邮箱地址。' }]}
      >
        <Input type="email" inputMode="email" />
      </Form.Item>
      {!submittable && (
        <p id={reasonId} className="members-edit-help" role="status">
          请填写非空姓名和有效邮箱后保存。
        </p>
      )}
      <div className="pui-actions members-edit-actions">
        <Button onClick={onCancel}>取消</Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!submittable}
          aria-describedby={!submittable ? reasonId : undefined}
        >
          保存
        </Button>
      </div>
    </Form>
  );
}

export function EditMemberDialog({ member, open, onSave, onCancel, onAfterClose }: EditMemberDialogProps) {
  const nameInputRef = useRef<InputRef>(null);

  return (
    <Modal
      className="members-edit-dialog"
      title="编辑成员"
      open={open}
      footer={null}
      getContainer={false}
      destroyOnHidden
      mask={{ closable: false }}
      focusable={{ trap: true, focusTriggerAfterClose: false }}
      modalRender={(content) => <div onKeyDownCapture={containDialogTab}>{content}</div>}
      onCancel={onCancel}
      afterClose={onAfterClose}
      afterOpenChange={(visible) => {
        // An opening animation must not steal focus after the user starts editing.
        const input = nameInputRef.current?.input;
        if (visible && !input?.form?.contains(document.activeElement)) {
          nameInputRef.current?.focus({ cursor: 'end' });
        }
      }}
    >
      {member && (
        <MemberEditForm
          key={member.id}
          member={member}
          nameInputRef={nameInputRef}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </Modal>
  );
}
