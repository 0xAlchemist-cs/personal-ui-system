import { describe, expect, it } from 'vitest';
import { DEFAULT_QUERY, PAGE_SIZE, queryMembers } from './member-query';
import { mockMembers } from './mock-members';
import type { Member, MemberQuery } from './types';

const ids = (members: readonly Member[]) => members.map((member) => member.id);

describe('fixed member data', () => {
  it('provides 30 unique synthetic members with reproducible IDs and dates', () => {
    expect(mockMembers).toHaveLength(30);
    expect(new Set(ids(mockMembers)).size).toBe(30);
    expect(mockMembers.filter((member) => member.status === 'active')).toHaveLength(20);
    expect(mockMembers.filter((member) => member.status === 'disabled')).toHaveLength(10);

    mockMembers.forEach((member, index) => {
      const number = String(index + 1).padStart(2, '0');
      expect(member).toEqual({
        id: `member-0${number}`,
        name: `演示成员${number}`,
        email: `member${number}@example.test`,
        createdAt: `2026-01-${number}T00:00:00.000Z`,
        status: (index + 1) % 3 === 0 ? 'disabled' : 'active',
      });
    });
  });
});

describe('queryMembers', () => {
  it('defaults to the newest 10 members', () => {
    const result = queryMembers(mockMembers, DEFAULT_QUERY);

    expect(PAGE_SIZE).toBe(10);
    expect(result.total).toBe(30);
    expect(result.page).toBe(1);
    expect(ids(result.rows)).toEqual([
      'member-030', 'member-029', 'member-028', 'member-027', 'member-026',
      'member-025', 'member-024', 'member-023', 'member-022', 'member-021',
    ]);
  });

  it('matches either name or email without case sensitivity', () => {
    expect(ids(queryMembers(mockMembers, { ...DEFAULT_QUERY, keyword: '演示成员07' }).rows))
      .toEqual(['member-007']);
    expect(ids(queryMembers(mockMembers, { ...DEFAULT_QUERY, keyword: 'MEMBER07@EXAMPLE.TEST' }).rows))
      .toEqual(['member-007']);
    expect(queryMembers(mockMembers, { ...DEFAULT_QUERY, keyword: 'member0' }).total).toBe(9);
  });

  it('combines keyword and status before sorting and pagination', () => {
    const result = queryMembers(mockMembers, {
      ...DEFAULT_QUERY, keyword: 'member0', status: 'disabled', sort: 'asc',
    });

    expect(result.total).toBe(3);
    expect(ids(result.rows)).toEqual(['member-003', 'member-006', 'member-009']);
    expect(queryMembers(mockMembers, {
      ...DEFAULT_QUERY, keyword: 'member03', status: 'active',
    })).toEqual({ rows: [], total: 0, page: 1 });
  });

  it('paginates the entire filtered set in ascending order', () => {
    const result = queryMembers(mockMembers, {
      ...DEFAULT_QUERY, status: 'active', sort: 'asc', page: 2,
    });

    expect(result.total).toBe(20);
    expect(result.page).toBe(2);
    expect(ids(result.rows)).toEqual([
      'member-016', 'member-017', 'member-019', 'member-020', 'member-022',
      'member-023', 'member-025', 'member-026', 'member-028', 'member-029',
    ]);
  });

  it('sorts by timestamps rather than the source array order', () => {
    const source = [mockMembers[10]!, mockMembers[0]!, mockMembers[20]!];
    expect(ids(queryMembers(source, { ...DEFAULT_QUERY, sort: 'asc' }).rows))
      .toEqual(['member-001', 'member-011', 'member-021']);
    expect(ids(queryMembers(source, DEFAULT_QUERY).rows))
      .toEqual(['member-021', 'member-011', 'member-001']);
  });

  it.each([
    { requested: -1, expected: 1 },
    { requested: 0, expected: 1 },
    { requested: 2.9, expected: 2 },
    { requested: 99, expected: 3 },
    { requested: Number.NaN, expected: 1 },
    { requested: Number.POSITIVE_INFINITY, expected: 1 },
  ])('clamps page $requested to $expected', ({ requested, expected }) => {
    expect(queryMembers(mockMembers, { ...DEFAULT_QUERY, page: requested }).page).toBe(expected);
  });

  it('returns page 1 for initial empty data or zero matching members', () => {
    expect(queryMembers([], { ...DEFAULT_QUERY, page: 3 }))
      .toEqual({ rows: [], total: 0, page: 1 });
    expect(queryMembers(mockMembers, { ...DEFAULT_QUERY, keyword: 'no-match', page: 3 }))
      .toEqual({ rows: [], total: 0, page: 1 });
  });

  it('clamps the page when an edit removes the only row on the last matching page', () => {
    const source = mockMembers.map((member, index) => ({
      ...member, name: index < 11 ? `目标 ${index}` : member.name,
    }));
    const query: MemberQuery = { ...DEFAULT_QUERY, keyword: '目标', page: 2 };
    const before = queryMembers(source, query);
    expect(before.total).toBe(11);
    expect(before.rows).toHaveLength(1);

    const editedId = before.rows[0]!.id;
    const edited = source.map((member) => member.id === editedId
      ? { ...member, name: '已编辑' }
      : member);
    const after = queryMembers(edited, query);

    expect(after.total).toBe(10);
    expect(after.page).toBe(1);
    expect(after.rows).toHaveLength(10);
    expect(ids(after.rows)).not.toContain(editedId);
    expect(query.page).toBe(2);
  });

  it('preserves source records, their order, and query input', () => {
    const source = Object.freeze(mockMembers.map((member) => Object.freeze({ ...member })));
    const query = Object.freeze({ ...DEFAULT_QUERY, keyword: 'member', sort: 'desc' as const });
    const before = JSON.stringify(source);
    const result = queryMembers(source, query);

    result.rows.reverse();

    expect(JSON.stringify(source)).toBe(before);
    expect(query).toEqual({ keyword: 'member', status: 'all', sort: 'desc', page: 1 });
    expect(result.rows).not.toBe(source);
  });
});
