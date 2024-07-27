import React from 'react';
import { IconButton } from '../micro';
import { ThemeState } from '../../zustand';
import { commonStyles } from '../../styles';
import { useStyles } from '../../theme';
import { GoogleButtonProps } from './types';

export const GoogleButton = (props: GoogleButtonProps) => {
  const { containerStyle = {} } = props;
  const { colors } = ThemeState();
  const styles = s();

  return (
    <IconButton
      name="logo-google"
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
  useStyles(({ colors }) => ({
    googleButton: {
      backgroundColor: colors.googleBlue,
      padding: 8,
      borderRadius: 15,
      marginHorizontal: 5,
    },
  }));
