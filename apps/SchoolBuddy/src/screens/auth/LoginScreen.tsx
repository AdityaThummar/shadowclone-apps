import React from 'react';
import { View } from 'react-native';
import {
  ScreenWrapper,
  PrimaryButton,
  BaseText,
  Header,
  IconButton,
  Input,
} from '@components';
import { commonStyles } from '@styles';
import { ThemeState } from '../../zustand';
import { useStyles } from '../../theme';
import { useNav } from '../../hook';

export const LoginScreen = () => {
  const styles = s();
  const { colors, setTheme, theme } = ThemeState();
  const { navigation } = useNav();

  const onPressSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={[commonStyles.flex]} />
      <Header
        title='Login'
        disableBack
        sizeHuge={false}
        sizeHugeHeading
        containerStyle={styles.headerContainerStyle}
        style={styles.headerStyle}
      />
      <Input
        label='Username or Email'
        placeholder='example@gmail.com'
        error='Please enter email !!'
      />
      <Input label='Password' placeholder='ex. 123aAxxe' isPassword />
      <PrimaryButton
        title='Submit'
        onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={styles.buttonStyle}
      />
      <BaseText center>or</BaseText>
      <IconButton
        name='logo-google'
        color={colors.primary}
        containerStyle={[
          commonStyles.center,
          commonStyles.centerCenter,
          styles.googleButton,
        ]}
      />
      <View
        style={[
          commonStyles.flex,
          commonStyles.justifyEnd,
          commonStyles.itemCenter,
        ]}
      >
        <BaseText medium style={[styles.createContainer]}>
          {`Don't have an account ? `}
          <BaseText
            style={[styles.createAccountButton]}
            semibold
            onPress={onPressSignup}
          >{`Create account`}</BaseText>
        </BaseText>
      </View>
    </ScreenWrapper>
  );
};

export const s = () =>
  useStyles(({ colors }) => ({
    container: {
      justifyContent: 'center',
      gap: 10,
    },
    headerStyle: {
      color: colors.tint,
    },
    headerContainerStyle: {
      alignSelf: 'center',
    },
    buttonStyle: {
      marginTop: 10,
    },
    googleButton: {
      backgroundColor: colors.googleBlue,
      padding: 8,
      borderRadius: 15,
      marginHorizontal: 5,
    },
    createAccountButton: {
      color: colors.tint,
    },
    createContainer: {
      marginBottom: 10,
    },
  }));
