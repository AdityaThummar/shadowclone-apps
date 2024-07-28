import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { View, ViewProps } from 'react-native';
import { themedStyles, useThemed } from './ThemeWrapper';
import { commonStyles } from '@styles';
import { ViewStyles } from 'packages/types/common/commonTypes';

export type ScreenWrapperProps = ViewProps & { containerStyle?: ViewStyles };

export const ScreenWrapper = (props: ScreenWrapperProps) => {
  const {
    themeValues: { colors, theme },
  } = useThemed();
  const styles = themedStyles(() => ({
    container: {
      flex: 1,
      margin: 10,
    },
    outerContainer: {
      backgroundColor: colors.primary,
    },
  }));

  return (
    <View
      style={[commonStyles.flex, styles.outerContainer, props?.containerStyle]}
    >
      <SafeAreaView {...props} style={[styles.container, props?.style ?? {}]}>
        {props?.children}
      </SafeAreaView>
      <StatusBar
        translucent={false}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.primary}
      />
    </View>
  );
};
