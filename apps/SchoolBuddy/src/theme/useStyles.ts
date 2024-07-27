/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { ThemeState, ThemeStateType } from '../zustand';
import { useMemo } from 'react';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

export const useStyles = <
  T extends (args: ThemeStateType) => NamedStyles<T> | NamedStyles<any>,
>(
  func: T,
  deps: any[] = [],
): ReturnType<T> => {
  const values = ThemeState();
  return useMemo(() => func(values), [values, ...deps]) as any;
};

export const themedStyles = <
  T extends (args: ThemeStateType) => NamedStyles<T> | NamedStyles<any>,
>(
  func: T,
): ReturnType<T> => {
  const values = ThemeState.getState();
  return func(values) as any;
};
