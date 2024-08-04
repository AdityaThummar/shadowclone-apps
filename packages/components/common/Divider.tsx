import React from 'react';
import { View, ViewProps } from 'react-native';
import { themedStyles } from './wrapper';

export type DividerProps = ViewProps & { vertical?: boolean };

export const Divider = (props: DividerProps) => {
  const { vertical = false, ...viewProps } = props;

  const styles = s();
  return (
    <View
      {...viewProps}
      style={[vertical ? styles.verticalStyle : styles.container, props?.style]}
    />
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      backgroundColor: colors.dividerColor,
      width: '100%',
      height: 2,
      marginVertical: 1,
    },
    verticalStyle: {
      width: 2,
      height: '100%',
      backgroundColor: colors.dividerColor,
      marginVertical: 0,
    },
  }));
