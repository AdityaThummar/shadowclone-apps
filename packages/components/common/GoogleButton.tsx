import { ViewStyles } from '../../types/common/commonTypes';
import React from 'react';
import { themedStyles, useThemed } from './wrapper';
import { IconButton } from './button';
import { commonStyles } from '@styles';

export type GoogleButtonProps = {
  containerStyle?: ViewStyles;
};

export const GoogleButton = (props: GoogleButtonProps) => {
  const { containerStyle = {} } = props;
  const {
    themeValues: { colors },
  } = useThemed();
  const styles = s();

  return (
    <IconButton
      name='logo-google'
      color={colors.primary}
      containerStyle={[
        commonStyles.center,
        commonStyles.centerCenter,
        styles.googleButton,
        containerStyle,
      ]}
    />
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    googleButton: {
      backgroundColor: colors.googleBlue,
      padding: 8,
      borderRadius: 15,
      marginHorizontal: 5,
    },
  }));
