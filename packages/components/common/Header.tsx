import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BaseText, BaseTextStyle } from './text';
import { IconButton } from './button';
import { BaseTextProps } from './text';
import { ViewStyles } from '../../types/common/commonTypes';
import { themedStyles } from './wrapper';

export type HeaderProps = {
  title?: string;
  containerStyle?: ViewStyles;
  disableBack?: boolean;
  onPressBack?: () => void;
  style?: BaseTextStyle;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
} & Omit<BaseTextProps, 'style'>;

export const Header = (props: HeaderProps) => {
  const {
    title,
    containerStyle,
    disableBack = false,
    onPressBack = () => goBack(),
    style = {},
    rightComponent,
    leftComponent,
    ...textProps
  } = props;

  const styles = s();

  const { goBack } = useNavigation();

  return (
    <View style={[styles.container, containerStyle]}>
      {!disableBack && (
        <IconButton
          name='arrow-back'
          iconStyle={styles.iconStyle}
          containerStyle={styles.iconContainerStyle}
          onPress={onPressBack}
        />
      )}
      {leftComponent && leftComponent}
      <BaseText sizeHuge bold {...textProps} style={[styles.textStyle, style]}>
        {title}
      </BaseText>
      {rightComponent && rightComponent}
    </View>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    iconStyle: {
      color: colors.secondary,
    },
    iconContainerStyle: {
      backgroundColor: colors.inputBackground,
      padding: 5,
      borderRadius: 10,
    },
    container: {
      marginBottom: 10,
      paddingHorizontal: 10,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    textStyle: {
      flex: 1,
      alignSelf: 'center',
    },
  }));
