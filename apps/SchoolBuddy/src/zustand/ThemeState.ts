import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { configureStorage } from './helper';
import { DarkColors, LightColors } from '../theme/Colors';

export type ThemeType = 'light' | 'dark';

export type ThemeStateType = {
  colors: typeof LightColors | typeof DarkColors;
  theme: ThemeType;
  setTheme: (t: ThemeType) => unknown;
};

export const ThemeState = create(
  persist<ThemeStateType>(
    (set: (props: ThemeStateType) => void, get: () => ThemeStateType) => {
      return {
        colors: LightColors,
        theme: 'dark',
        setTheme: (t: ThemeType) =>
          set({
            ...get(),
            theme: t,
            colors: t === 'dark' ? DarkColors : LightColors,
          }),
      };
    },
    configureStorage('Theme') as PersistOptions<ThemeStateType, ThemeStateType>,
  ),
);
