import type { Member, MemberQuery } from './types';

export const PAGE_SIZE = 10;

export const DEFAULT_QUERY: MemberQuery = {
  keyword: '',
  status: 'all',
  sort: 'desc',
  page: 1,
};

export function queryMembers(members: readonly Member[], query: MemberQuery) {
  const keyword = query.keyword.toLowerCase();
  const matching = members.filter(
    (member) =>
      (query.status === 'all' || member.status === query.status) &&
      (member.name.toLowerCase().includes(keyword) ||
        member.email.toLowerCase().includes(keyword)),
  );

  matching.sort((left, right) => {
    const difference = Date.parse(left.createdAt) - Date.parse(right.createdAt);
    return query.sort === 'asc' ? difference : -difference;
  });

  const total = matching.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedPage = Number.isFinite(query.page) ? Math.trunc(query.page) : 1;
  const page = Math.min(lastPage, Math.max(1, requestedPage));
  const start = (page - 1) * PAGE_SIZE;

  return { rows: matching.slice(start, start + PAGE_SIZE), total, page };
}
