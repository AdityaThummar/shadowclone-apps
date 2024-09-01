import { configureStorage } from '@zustand';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { PayRequestItemType } from '../api/payRequests';

type RequestArrayType = PayRequestItemType[];

export type RequestState = {
  requests: RequestArrayType;
  setRequests: (arr: RequestArrayType) => void;
  selfRequests: RequestArrayType;
  setSelfRequests: (arr: RequestArrayType) => void;
  clearState: () => void;
};

const initialStates = {
  requests: [],
  selfRequests: [],
};

export const RequestState = create(
  persist<RequestState>(
    (set: (props: RequestState) => void, get: () => RequestState) => {
      return {
        ...initialStates,
        setRequests: (req: RequestArrayType) =>
          set({ ...get(), requests: req }),
        setSelfRequests: (req: RequestArrayType) =>
          set({ ...get(), selfRequests: req }),
        clearState: () => set({ ...get(), ...initialStates }),
      };
    },
    configureStorage('RequestState') as PersistOptions<RequestState>,
  ),
);
