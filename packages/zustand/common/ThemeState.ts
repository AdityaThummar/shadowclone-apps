import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { configureStorage } from './ZustandHelpers';

export type ThemeType = 'light' | 'dark';
export type ThemeColorsType = {
  primary?: string;
  secondary?: string;
  tint?: string;
  text?: string;
  error?: string;
  inputBackground?: string;
  inputFocusTint?: string;
  inputPlaceHolder?: string;
  googleBlue?: string;
  screenBackground?: string;
  dividerColor?: string;
  cardBackgroundColor?: string;
  completedCardBackground?: string;
  modalBackgroundColor?: string;
};

export type ResourceType = {
  light: ThemeColorsType;
  dark: ThemeColorsType;
};

export type ThemeStateType = {
  colors: ThemeColorsType;
  theme: ThemeType;
  setTheme: (t: ThemeType) => unknown;
};

export const configureThemeState = (resources: ResourceType) =>
  create(
    persist<ThemeStateType>(
      (set: (props: ThemeStateType) => void, get: () => ThemeStateType) => {
        return {
          colors: resources.light,
          theme: 'light',
          setTheme: (t: ThemeType) => {
            set({
              ...get(),
              theme: t,
              colors: resources[t],
            });
          },
        };
      },
      configureStorage('ThemeState') as PersistOptions<
        ThemeStateType,
        ThemeStateType
      >,
    ),
  );
