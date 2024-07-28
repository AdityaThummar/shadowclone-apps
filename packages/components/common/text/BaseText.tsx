import { Text, TextStyle } from 'react-native';
import React, { useMemo } from 'react';
import { BaseTextProps } from './types';
import { getFontWeight } from './FontFamily';
import { getFontSize } from './FontSize';
import { themedStyles } from '../wrapper';

export const BaseText = (props: BaseTextProps) => {
  const styles = s();

  const weightStyles: Pick<TextStyle, 'fontFamily'> = useMemo(() => {
    return { fontFamily: getFontWeight(props) };
  }, [props]);

  const sizeStyles: Pick<TextStyle, 'fontSize'> = useMemo(() => {
    return { fontSize: getFontSize(props) };
  }, [props]);

  const alignmentStyles: Pick<TextStyle, 'textAlign'> = useMemo(() => {
    return {
      textAlign: props?.center ? 'center' : props?.right ? 'right' : 'left',
    };
  }, [props]);

  return (
    <Text
      {...props}
      style={[
        weightStyles,
        sizeStyles,
        alignmentStyles,
        styles.text,
        props?.style ?? {},
      ]}
    />
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    text: {
      color: colors.text,
    },
  }));
