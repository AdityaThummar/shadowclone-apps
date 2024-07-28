import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { ViewProps } from 'react-native';
import { themedStyles, useThemed } from './ThemeWrapper';

export type ScreenWrapperProps = ViewProps;

export const ScreenWrapper = (props: ScreenWrapperProps) => {
  const {
    themeValues: { colors, theme },
  } = useThemed();
  const styles = themedStyles(() => ({
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
