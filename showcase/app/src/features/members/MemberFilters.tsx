import { Button, Input, Select } from 'antd';
import { useId } from 'react';
import type { MemberQuery } from './types';

interface MemberFiltersProps {
  query: MemberQuery;
  onChange: (change: Partial<Pick<MemberQuery, 'keyword' | 'status'>>) => void;
  onClear: () => void;
}

export function MemberFilters({ query, onChange, onClear }: MemberFiltersProps) {
  const id = useId();
  return (
    <div className="members-filters" role="search" aria-label="筛选成员">
      <div className="members-filter members-filter--keyword">
        <label htmlFor={`${id}-keyword`}>姓名或邮箱</label>
        <Input
          id={`${id}-keyword`}
          placeholder="搜索成员"
          value={query.keyword}
          onChange={(event) => onChange({ keyword: event.target.value })}
          autoComplete="off"
          allowClear
        />
      </div>
      <div className="members-filter members-filter--status">
        <label htmlFor={`${id}-status`}>成员状态</label>
        <Select<MemberQuery['status']>
          id={`${id}-status`}
          value={query.status}
          onChange={(status) => onChange({ status })}
          options={[
            { value: 'all', label: '全部状态' },
            { value: 'active', label: '启用' },
            { value: 'disabled', label: '已停用' },
          ]}
        />
      </div>
      <Button onClick={onClear}>清除筛选</Button>
    </div>
  );
}
