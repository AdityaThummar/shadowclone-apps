import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { ScreenWrapperProps } from './types';
import { useStyles } from '../../../theme';
import { ThemeState } from '../../../zustand';

export const ScreenWrapper = (props: ScreenWrapperProps) => {
  const { theme, colors } = ThemeState();
  const styles = useStyles(() => ({
    container: {
      flex: 1,
      margin: 10,
    },
  }));

  return (
    <>
      <SafeAreaView {...props} style={[styles.container, props?.style ?? {}]}>
        {props?.children}
      </SafeAreaView>
      <StatusBar
        translucent={false}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.primary}
      />
    </>
  );
};
