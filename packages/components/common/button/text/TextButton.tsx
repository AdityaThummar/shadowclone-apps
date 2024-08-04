import React from 'react';
import { Touchable } from '../../Touchable';
import { BaseText } from '../../text';
import { TextButtonProps } from './types';
import { themedStyles } from '../../wrapper';

export const TextButton = (props: TextButtonProps) => {
  const { containerProps, containerStyle, title, onPress, ...textProps } =
    props;

  const styles = s();

  return (
    <Touchable
      {...containerProps}
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <BaseText
        {...textProps}
        style={[styles.text, textProps?.style ?? {}]}
        bold
        sizeMedium
      >
        {title}
      </BaseText>
    </Touchable>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      alignItems: 'center',
    },
    text: {
      color: colors.tint,
    },
  }));
