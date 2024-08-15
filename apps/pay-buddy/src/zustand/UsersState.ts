import { configureStorage } from '@zustand';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { UserProfileType } from '../api/types';

type Users = UserProfileType[];
type UsersSetter = (users: Users) => void;

export type UsersState = {
  sentRequest: Users;
  receivedRequests: Users;
  friends: Users;
  newUsers: Users;
  blockedUsers: Users;
  setSentRequests: UsersSetter;
  setReceivedRequests: UsersSetter;
  setFriends: UsersSetter;
  setNewUsers: UsersSetter;
  setBlockedUsers: UsersSetter;
  clearState: () => void;
};

const initialStates = {
  friends: [],
  receivedRequests: [],
  sentRequest: [],
  newUsers: [],
  blockedUsers: [],
};

export const UsersState = create(
  persist<UsersState>(
    (set: (props: UsersState) => void, get: () => UsersState) => {
      return {
        ...initialStates,
        setFriends: (users: Users) => set({ ...get(), friends: users }),
        setReceivedRequests: (users: Users) =>
          set({ ...get(), receivedRequests: users }),
        setSentRequests: (users: Users) =>
          set({ ...get(), sentRequest: users }),
        setNewUsers: (users: Users) => set({ ...get(), newUsers: users }),
        setBlockedUsers: (users: Users) =>
          set({ ...get(), blockedUsers: users }),
        clearState: () => set({ ...get(), ...initialStates }),
      };
    },
    configureStorage('UsersState') as PersistOptions<UsersState>,
  ),
);
