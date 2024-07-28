import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BaseText } from './text';
import { IconButton } from './button';
import { BaseTextProps } from './text';
import { ViewStyles } from '../../types/common/commonTypes';
import { themedStyles } from './wrapper';

export type HeaderProps = {
  title?: string;
  containerStyle?: ViewStyles;
  disableBack?: boolean;
  onPressBack?: () => void;
} & BaseTextProps;

export const Header = (props: HeaderProps) => {
  const { goBack } = useNavigation();
  const {
    title,
    containerStyle,
    disableBack = false,
    onPressBack = () => goBack(),
  } = props;
  const styles = s();
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
      <BaseText sizeHuge bold {...props}>
        {title}
      </BaseText>
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
      alignSelf: 'flex-start',
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
  }));
