import React from 'react';
import { SafeAreaView } from 'react-native';
import { View, ViewProps } from 'react-native';
import { themedStyles, useThemed } from './ThemeWrapper';
import { commonStyles } from '@styles';
import { ViewStyles } from 'packages/types/common/commonTypes';
import { BaseStatusBar } from '../BaseStatusBar';

export type ScreenWrapperProps = ViewProps & {
  containerStyle?: ViewStyles;
  topSafeAreaViewStyle?: ViewStyles;
};

export const ScreenWrapper = (props: ScreenWrapperProps) => {
  const {
    themeValues: { colors },
  } = useThemed();

  const styles = themedStyles(() => ({
    outerContainer: {
      backgroundColor: colors.primary,
    },
    topSafeAreaViewStyle: {
      flex: 0,
      backgroundColor: colors.primary,
    },
  }));

  return (
    <View
      style={[commonStyles.flex, styles.outerContainer, props?.containerStyle]}
    >
      <SafeAreaView
        style={[styles.topSafeAreaViewStyle, props?.topSafeAreaViewStyle ?? {}]}
      />
      <SafeAreaView
        {...props}
        style={[commonStyles.screenStyle, props?.style ?? {}]}
      >
        {props?.children}
      </SafeAreaView>
      <BaseStatusBar />
    </View>
  );
};
