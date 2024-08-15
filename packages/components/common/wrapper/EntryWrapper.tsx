import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { themedStyles, useThemed } from './ThemeWrapper';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeType } from '@zustand';
import { FirebaseListner } from 'apps/pay-buddy/src/api/FirebaseListner';

export const EntryWrapper = ({ children }: React.PropsWithChildren) => {
  const styles = themedStyles(({ colors }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
  }));

  const {
    themeValues: { theme, colors },
  } = useThemed();

  const BottomNavBarSetter = async (theme: ThemeType = 'light') => {
    if (Platform.OS === 'android') {
      await NavigationBar.setBackgroundColorAsync(
        colors?.primary ?? '#FFFFFF00',
      );
      await NavigationBar.setButtonStyleAsync(
        theme === 'dark' ? 'light' : 'dark',
      );
    }
  };

  useEffect(() => {
    if (theme) {
      BottomNavBarSetter(theme);
    }
  }, [theme, colors]);

  return (
    <View style={styles.container}>
      {children}
      <FirebaseListner />
    </View>
  );
};
