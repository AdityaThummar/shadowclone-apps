import { configureStorage } from '@zustand';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { UserData } from '../api/types';

export type AuthStateTypes = {
  user?: UserData;
  setUser: (user?: UserData) => void;
};

export const AuthState = create(
  persist<AuthStateTypes>(
    (set: (props: AuthStateTypes) => void, get: () => AuthStateTypes) => {
      return {
        user: undefined,
        setUser: (u?: UserData) =>
          set({
            ...get(),
            user: u,
          }),
      };
    },
    configureStorage('Theme') as PersistOptions<AuthStateTypes>,
  ),
);
