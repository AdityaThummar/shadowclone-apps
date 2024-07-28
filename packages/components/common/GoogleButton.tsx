import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { ViewStyles } from '../../types/common/commonTypes';
import { themedStyles, useThemed } from './wrapper';
import { BaseIcon } from './button';
import { commonStyles, hp, wp } from '@styles';
import { BaseText, BaseTextStyle } from './text';
import { Touchable } from './Touchable';

export type GoogleButtonProps = {
  containerStyle?: ViewStyles;
  big?: boolean;
  bigContainerStyle?: ViewStyles;
  textStyle?: BaseTextStyle;
  label?: string;
} & Pick<TouchableOpacityProps, 'onPress' | 'disabled'>;

export const GoogleButton = (props: GoogleButtonProps) => {
  const {
    containerStyle = {},
    big = false,
    bigContainerStyle = {},
    textStyle = {},
    label = 'Sign in with Google',
    disabled = false,
    onPress = () => {},
  } = props;

  const {
    themeValues: { colors },
  } = useThemed();
  const styles = s();

  return (
    <Touchable
      style={[
        commonStyles.rowItemCenterJustifyCenter,
        big && styles.containerStyle,
        bigContainerStyle,
      ]}
      {...{ disabled, onPress }}
    >
      <BaseIcon
        name='logo-google'
        color={colors.primary}
        containerStyle={[
          commonStyles.center,
          commonStyles.centerCenter,
          !big && styles.googleButton,
          containerStyle,
        ]}
      />
      {big && !!label && (
        <BaseText semibold style={[styles.textStyle, textStyle]}>
          {label}
        </BaseText>
      )}
    </Touchable>
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
    containerStyle: {
      backgroundColor: colors.googleBlue,
      borderRadius: 15,
      alignSelf: 'center',
      paddingHorizontal: wp(5),
      paddingVertical: hp(1),
      gap: wp(2),
    },
    textStyle: {
      color: colors.primary,
    },
  }));
