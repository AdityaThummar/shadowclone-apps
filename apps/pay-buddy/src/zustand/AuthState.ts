import { configureStorage } from '@zustand';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { UserData } from '../api/types';

export type AuthStateTypes = {
  user?: UserData | null;
  setUser: (user?: UserData) => void;
  clearUser: () => void;
};

export const AuthState = create(
  persist<AuthStateTypes>(
    (set: (props: AuthStateTypes) => void, get: () => AuthStateTypes) => {
      const setUser = (u?: UserData) =>
        set({
          ...get(),
          user: u,
        });

      const clearUser = () =>
        set({
          ...get(),
          setUser,
          user: null,
        });

      return {
        user: null,
        setUser,
        clearUser,
      };
    },
    configureStorage('AuthState') as PersistOptions<AuthStateTypes>,
  ),
);
