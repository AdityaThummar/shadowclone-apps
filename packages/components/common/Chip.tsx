import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { themedStyles } from './wrapper';
import { Touchable } from './Touchable';
import { Card, CardProps } from './Card';
import { BaseIcon, iconProps } from './button';
import { BaseText, BaseTextProps, BaseTextStyle, BaseTextStyles } from './text';
import { ViewStyles } from '@types';
import { commonStyles, wp } from '@styles';

export type ChipProps = {
  title: string;
  icon?: string;
  iconProps?: iconProps;
  style?: ViewStyles;
  titleStyle?: BaseTextStyles;
  titleProps?: BaseTextProps;
} & Omit<CardProps, 'style'>;

export const Chip = (props: ChipProps) => {
  const {
    title,
    icon,
    iconProps = {},
    style = {},
    titleStyle = {},
    titleProps = {},
    ...cardProps
  } = props;

  const styles = s();

  return (
    <Card
      {...cardProps}
      style={[commonStyles.rowItemCenterJustifyCenter, styles.container, style]}
    >
      {icon && (
        <BaseIcon
          name={icon}
          size={15}
          {...iconProps}
          iconStyle={[styles.icon, iconProps?.iconStyle ?? {}]}
        />
      )}
      <BaseText sizeTiny center semibold {...titleProps} style={[titleStyle]}>
        {title}
      </BaseText>
    </Card>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      margin: 0,
      paddingVertical: wp(1.5),
      paddingHorizontal: wp(2.5),
      gap: wp(0.8),
    },
    icon: {
      color: colors.secondary,
    },
  }));
