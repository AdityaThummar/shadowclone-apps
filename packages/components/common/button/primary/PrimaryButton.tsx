import React from 'react';
import { BaseText } from '../../text';
import { PrimaryButtonProps } from './types';
import { Touchable } from '../../Touchable';
import { themedStyles } from '../../wrapper';
import { hp, wp } from '@styles';

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const { titleProps, title, titleStyle, ...otherProps } = props;
  const styles = s();

  return (
    <Touchable {...otherProps} style={[styles.container, otherProps?.style]}>
      <BaseText
        semibold
        sizeBig
        {...titleProps}
        style={[styles.titleStyle, titleStyle ?? {}]}
      >
        {title}
      </BaseText>
    </Touchable>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      backgroundColor: colors.tint,
      padding: hp(1.4),
      borderRadius: 15,
      alignItems: 'center',
      shadowColor: colors.secondary,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
      marginHorizontal: wp(4),
      marginVertical: hp(0.5),
    },
    titleStyle: {
      color: colors.primary,
    },
  }));
