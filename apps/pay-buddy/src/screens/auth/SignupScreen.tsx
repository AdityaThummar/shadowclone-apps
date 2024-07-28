import React from 'react';
import {
  BaseText,
  GoogleButton,
  Header,
  Input,
  ScreenWrapper,
  PrimaryButton,
  themedStyles,
} from '@components';
import { View } from 'react-native';
import { s as loginStyle } from './LoginScreen';
import { commonStyles } from '@styles';

export const SignupScreen = () => {
  const styles = s();
  const loginStyles = loginStyle();

  return (
    <ScreenWrapper style={[loginStyles.container, commonStyles.justifyStart]}>
      <Header title='Create new account' />
      <View style={[commonStyles.itemCenter, styles.informationContainer]}>
        <BaseText sizeBig semibold center>
          Hey there, Happy to have you!!
        </BaseText>
        <BaseText sizeMedium medium center>
          Please fill these details to create new account
        </BaseText>
      </View>
      <Input label='Email' placeholder='example@gmail.com' />
      <Input label='Password' placeholder='ex. 123aAxxe' isPassword />
      <Input
        label='Confirm Password'
        placeholder='ex. 123aAxxe'
        secureTextEntry
      />
      <PrimaryButton title='Submit' style={[loginStyles.buttonStyle]} />
      <BaseText center>or</BaseText>
      <GoogleButton containerStyle={[loginStyles.googleButton]} />
    </ScreenWrapper>
  );
};

const s = () =>
  themedStyles(() => ({
    informationContainer: {
      marginHorizontal: 10,
      gap: 5,
      marginBottom: 10,
    },
  }));
