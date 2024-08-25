import { create } from 'zustand';

export type LoadingStateType = {
  isLoading: boolean;
  loadingMessage?: string;
  setLoader: (message?: string) => void;
};

export const LoadingState = create<LoadingStateType>(
  (set: (props: LoadingStateType) => void, get: () => LoadingStateType) => {
    return {
      isLoading: false,
      loadingMessage: '',
      setLoader: (message = '') =>
        set({ ...get(), isLoading: !!message, loadingMessage: message }),
    };
  },
);
