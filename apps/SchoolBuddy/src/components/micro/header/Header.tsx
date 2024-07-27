import React from 'react';
import { BaseText } from '../text';
import { HeaderProps } from './types';
import { View } from 'react-native';
import { IconButton } from '../button';
import { useStyles } from '../../../theme';
import { useNav } from '../../../hook';

export const Header = (props: HeaderProps) => {
  const { navigation } = useNav();
  const {
    title,
    containerStyle,
    disableBack = false,
    onPressBack = () => navigation.goBack(),
  } = props;
  const styles = s();
  return (
    <View style={[styles.container, containerStyle]}>
      {!disableBack && (
        <IconButton
          name="arrow-back"
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
  useStyles(({ colors }) => ({
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
