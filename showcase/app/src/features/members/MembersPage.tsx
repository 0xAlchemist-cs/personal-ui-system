import { App } from 'antd';
import { useRef, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { ContentPanel } from '../../components/ContentPanel';
import { EditMemberDialog } from './EditMemberDialog';
import { MemberFilters } from './MemberFilters';
import { MemberTable } from './MemberTable';
import { DEFAULT_QUERY, queryMembers } from './member-query';
import { mockMembers } from './mock-members';
import type { Member, MemberEdits, MemberQuery } from './types';
import './members.css';

export function MembersPage({ initialMembers = mockMembers }: { initialMembers?: readonly Member[] }) {
  const { message } = App.useApp();
  const [members, setMembers] = useState<Member[]>(() => initialMembers.map((member) => ({ ...member })));
  const [query, setQuery] = useState<MemberQuery>(DEFAULT_QUERY);
  const [dialog, setDialog] = useState<{ member: Member; open: boolean } | null>(null);
  const editTrigger = useRef<HTMLElement | null>(null);
  const tableHeading = useRef<HTMLHeadingElement>(null);
  const result = queryMembers(members, query);

  function changeQuery(change: Partial<Omit<MemberQuery, 'page'>>) {
    setQuery((current) => ({ ...current, ...change, page: 1 }));
  }

  function clearFilters() { changeQuery({ keyword: '', status: 'all' }); }

  function closeDialog() {
    setDialog((current) => current ? { ...current, open: false } : null);
  }

  function saveMember(edits: MemberEdits) {
    if (!dialog) return;
    const nextMembers = members.map((member) => member.id === dialog.member.id ? { ...member, ...edits } : member);
    setMembers(nextMembers);
    setQuery((current) => ({ ...current, page: queryMembers(nextMembers, current).page }));
    closeDialog();
    void message.success('演示修改已保存，刷新后恢复初始数据。');
  }

  function afterClose() {
    setDialog(null);
    const target = editTrigger.current?.isConnected ? editTrigger.current : tableHeading.current;
    target?.focus();
    editTrigger.current = null;
  }

  return (
    <AppShell>
      <header className="members-page-header">
        <h1 id="members" tabIndex={-1}>成员管理</h1>
        <p>检索成员、查看状态，编辑基本信息。</p>
        <p className="members-demo-note">演示数据 · {initialMembers.length} 条固定合成记录。修改仅保存在当前页面，刷新后恢复。</p>
      </header>
      <ContentPanel
          title="成员列表"
          description="按姓名或邮箱搜索，并按成员状态筛选。"
          headingId="members-list-title"
          headingRef={tableHeading}
      >
        <MemberFilters query={query} onChange={changeQuery} onClear={clearFilters} />
        <MemberTable
            {...result}
            sort={query.sort}
            hasMembers={members.length > 0}
            onPageChange={(page) => setQuery((current) => ({ ...current, page }))}
            onSortChange={(sort) => changeQuery({ sort })}
            onEdit={(member, trigger) => {
              editTrigger.current = trigger;
              setDialog({ member, open: true });
            }}
            onClearFilters={clearFilters}
        />
      </ContentPanel>
      <EditMemberDialog
          member={dialog?.member ?? null}
          open={dialog?.open ?? false}
          onSave={saveMember}
          onCancel={closeDialog}
          onAfterClose={afterClose}
      />
    </AppShell>
  );
}
