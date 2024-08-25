import { create } from 'zustand';
import { GroupDetailsType, UserProfileType } from '../api/types';

export type SelectionStateType = {
  selectedMemebersForNew: UserProfileType[];
  setSelectedMemebersForNew: (users: UserProfileType[]) => void;
  selectedGroups: GroupDetailsType[];
  setSelectedGroups: (groups: GroupDetailsType[]) => void;
};

export const SelectionState = create<SelectionStateType>((set, get) => {
  return {
    selectedMemebersForNew: [],
    setSelectedMemebersForNew: (user: UserProfileType[]) =>
      set({ ...get(), selectedMemebersForNew: user }),
    selectedGroups: [],
    setSelectedGroups: (groups: GroupDetailsType[]) =>
      set({ ...get(), selectedGroups: groups }),
  };
});
