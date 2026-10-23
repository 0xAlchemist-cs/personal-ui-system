import { Button, Empty, Pagination, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useId } from 'react';
import { PAGE_SIZE } from './member-query';
import type { Member, MemberQuery } from './types';

interface MemberTableProps {
  rows: Member[];
  total: number;
  page: number;
  sort: MemberQuery['sort'];
  hasMembers: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (sort: MemberQuery['sort']) => void;
  onEdit: (member: Member, trigger: HTMLElement) => void;
  onClearFilters: () => void;
}

export function MemberTable({
  rows, total, page, sort, hasMembers, onPageChange, onSortChange, onEdit, onClearFilters,
}: MemberTableProps) {
  const scrollHelpId = useId();
  const columns: TableProps<Member>['columns'] = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 160 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 260 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (status: Member['status']) => (
        <Tag className={`members-status members-status--${status}`}>
          {status === 'active' ? '启用' : '已停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150,
      sorter: true,
      sortOrder: sort === 'asc' ? 'ascend' : 'descend',
      sortDirections: ['descend', 'ascend', 'descend'],
      render: (value: string) => <time dateTime={value}>{value.slice(0, 10)}</time>,
    },
    {
      title: '操作', key: 'actions', width: 100,
      render: (_, member) => (
        <Button
          type="link"
          aria-label={`编辑${member.name}`}
          onClick={(event) => onEdit(member, event.currentTarget)}
        >
          编辑
        </Button>
      ),
    },
  ];
  const onChange: TableProps<Member>['onChange'] = (_, __, sorter) => {
    const current = Array.isArray(sorter) ? sorter[0] : sorter;
    onSortChange(current?.order === 'ascend' ? 'asc' : 'desc');
  };

  return (
    <>
      {rows.length > 0 && <p className="members-scroll-help" id={scrollHelpId}>表格可横向滚动；可聚焦后使用左右方向键查看。</p>}
      <div
          className="members-table-scroll"
          role="region"
          aria-label="成员列表，可横向滚动"
          aria-describedby={rows.length > 0 ? scrollHelpId : undefined}
          tabIndex={0}
      >
        {rows.length > 0 ? <Table<Member>
            className="members-table"
            columns={columns}
            dataSource={rows}
            rowKey="id"
            pagination={false}
            tableLayout="fixed"
            onChange={onChange}
            showSorterTooltip={false}
        /> : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={hasMembers ? '没有符合条件的成员' : '暂无成员'}>
            {hasMembers ? (
              <Button onClick={onClearFilters}>清除筛选</Button>
            ) : <p>成员记录将在这里显示。</p>}
          </Empty>
        )}
      </div>
      <div className="members-pagination">
        <p role="status" aria-live="polite">
          共 {total} 位成员{total > 0 ? ` · 第 ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} 位` : ''}
        </p>
        <nav aria-label="成员列表分页">
          <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={onPageChange}
              showSizeChanger={false}
              hideOnSinglePage
          />
        </nav>
      </div>
    </>
  );
}
