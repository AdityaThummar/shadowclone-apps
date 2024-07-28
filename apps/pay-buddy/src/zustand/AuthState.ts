import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { configureStorage } from '@zustand';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export type UserType = FirebaseAuthTypes.UserCredential;

export type AuthStateTypes = {
  user?: UserType;
  setUser: (user?: UserType) => void;
};

export const AuthState = create(
  persist<AuthStateTypes>(
    (set: (props: AuthStateTypes) => void, get: () => AuthStateTypes) => {
      return {
        user: undefined,
        setUser: (u?: UserType) =>
          set({
            ...get(),
            user: u,
          }),
      };
    },
    configureStorage('Theme') as PersistOptions<AuthStateTypes>,
  ),
);
