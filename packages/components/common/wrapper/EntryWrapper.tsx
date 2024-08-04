import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { themedStyles, useThemed } from './ThemeWrapper';
import * as NavigationBar from 'expo-navigation-bar';

export const BottomNavBarSetter = async (theme: 'light' | 'dark' = 'light') => {
  console.log('🚀 ~ BottomNavBarSetter ~ theme:', theme);
  if (Platform.OS === 'android') {
    await NavigationBar.setBackgroundColorAsync('#FFFFFF');
    await NavigationBar.setButtonStyleAsync('dark');
  }
};

export const EntryWrapper = ({ children }: React.PropsWithChildren) => {
  const styles = themedStyles(({ colors }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
  }));

  // const {
  //   themeValues: { theme },
  // } = useThemed();

  // useEffect(() => {
  //   if (theme) {
  //     BottomNavBarSetter(theme);
  //   }
  // }, [theme]);

  return <View style={styles.container}>{children}</View>;
};
