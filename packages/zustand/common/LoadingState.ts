import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { configureStorage } from './ZustandHelpers';

export type LoadingStateType = {
  isLoading: boolean;
  loadingMessage?: string;
  setLoader: (message?: string) => void;
};

export const LoadingState = create(
  persist<LoadingStateType>(
    (set: (props: LoadingStateType) => void, get: () => LoadingStateType) => {
      return {
        isLoading: false,
        loadingMessage: '',
        setLoader: (message = '') =>
          set({ ...get(), isLoading: !!message, loadingMessage: message }),
      };
    },
    configureStorage('Theme') as PersistOptions<
      LoadingStateType,
      LoadingStateType
    >,
  ),
);
