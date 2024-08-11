import React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';
import { useThemed } from './wrapper';

export const BaseStatusBar = (props: StatusBarProps) => {
  const {
    themeValues: { colors, theme },
  } = useThemed();

  return (
    <StatusBar
      translucent={false}
      barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      backgroundColor={colors.primary}
      {...props}
    />
  );
};
