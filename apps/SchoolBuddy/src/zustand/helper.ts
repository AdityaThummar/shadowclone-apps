import { MMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

export const configureStorage = (
  id: string = new Date().getTime().toString(),
) => {
  const mmkv = new MMKV({ id });

  return {
    name: id,
    storage: createJSONStorage(() => ({
      getItem: (str: string) => mmkv.getString(str) ?? '',
      setItem: (key: string, val: string) => mmkv.set(key, val?.toString()),
      removeItem: (key: string) => mmkv.delete(key),
    })),
  } as unknown;
};
