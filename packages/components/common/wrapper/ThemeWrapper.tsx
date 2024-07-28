import React, { createContext, useContext } from 'react';
import { TextStyle, ImageStyle } from 'react-native';
import { ViewStyles } from 'packages/types/common/commonTypes';
import {
  configureThemeState,
  ResourceType,
  ThemeStateType,
} from 'packages/zustand/common';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyles | TextStyle | ImageStyle;
};

const ThemeContext = createContext<{
  themeValues: ThemeStateType;
}>({
  themeValues: {} as ThemeStateType,
});

export const ThemeWrapper = ({
  resources,
  children,
}: {
  resources: ResourceType;
  children: React.ReactNode;
}) => {
  const themeValues = configureThemeState(resources)();

  return (
    <ThemeContext.Provider value={{ themeValues }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemed = () => useContext(ThemeContext);

export const themedStyles = <
  T extends (args: ThemeStateType) => NamedStyles<T> | NamedStyles<any>,
>(
  func: T,
): ReturnType<T> => {
  const {
    themeValues = {
      colors: {},
      setTheme: () => {},
      theme: 'light',
    },
  } = useThemed();
  return func(themeValues) as any;
};
