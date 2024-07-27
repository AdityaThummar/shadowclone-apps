import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../theme';

export const EntryWrapper = ({ children }: React.PropsWithChildren) => {
  const styles = useStyles(({ colors }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
  }));
  return <View style={styles.container}>{children}</View>;
};
