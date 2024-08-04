import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { themedStyles } from './wrapper';
import { Touchable } from './Touchable';

export type CardProps = TouchableOpacityProps;

export const Card = (props: CardProps) => {
  const styles = s();

  return <Touchable {...props} style={[styles.container, props?.style]} />;
};

const s = () =>
  themedStyles(({ theme, colors }) => ({
    container: {
      shadowColor: theme === 'dark' ? colors.primary : colors.secondary,
      elevation: 4,
      shadowOpacity: 0.3,
      shadowRadius: 3,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      padding: 10,
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 25,
      margin: 5,
    },
  }));
