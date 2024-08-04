export type PayRequestUserType = {
  name: string;
  uid: string;
  image?: string;
};

export type PayRequestItemType = {
  user: PayRequestUserType;
  date: string;
  title: string;
  participants: PayRequestUserType[];
  paidParticipants: PayRequestUserType[];
  amount: number;
  type: 'non-group' | 'group';
  groupId?: string;
};
