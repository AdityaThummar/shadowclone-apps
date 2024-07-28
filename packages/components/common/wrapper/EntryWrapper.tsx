import React from 'react';
import { View } from 'react-native';
import { themedStyles } from './ThemeWrapper';

export const EntryWrapper = ({ children }: React.PropsWithChildren) => {
  const styles = themedStyles(({ colors }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
  }));

  return <View style={styles.container}>{children}</View>;
};
