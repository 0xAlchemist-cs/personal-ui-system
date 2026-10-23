export interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: 'active' | 'disabled';
}

export interface MemberQuery {
  keyword: string;
  status: 'all' | Member['status'];
  sort: 'asc' | 'desc';
  page: number;
}

export type MemberEdits = Pick<Member, 'name' | 'email'>;
