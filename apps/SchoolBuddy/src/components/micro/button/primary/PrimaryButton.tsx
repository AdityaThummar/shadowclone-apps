import React from 'react';
import { BaseText } from '../../text';
import { Touchable } from '../../touchable';
import { PrimaryButtonProps } from './types';
import { useStyles } from '../../../../theme';

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
  useStyles(({ colors }) => ({
    container: {
      backgroundColor: colors.tint,
      padding: 10,
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
      margin: 5,
    },
    titleStyle: {
      color: colors.primary,
    },
  }));
