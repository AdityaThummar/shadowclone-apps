import React from 'react';
import {
  BaseText,
  GoogleButton,
  Header,
  ScreenWrapper,
  themedStyles,
} from '@components';
import { hp } from '@styles';
import { login } from '../../api';
import { AuthState } from '../../zustand/AuthState';
import { useNav } from '../../helper';
import { Image } from 'react-native';

export const SocialLoginScreen = () => {
  const { screenStyle, googleBtnStyle } = s();

  const { setUser } = AuthState();
  const { navigation } = useNav();

  const googleLogin = async () => {
    console.log('logged');
    const response = await login();
    console.log('🚀 ~ googleLogin ~ response:', response);
    if (response?.success && response?.data) {
      setUser(response?.data);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'BottomTab',
          },
        ],
      });
    }
  };

  return (
    <ScreenWrapper style={screenStyle}>
      {/* <BaseText center sizeHugeHeading bold>
        Pay Buddy
      </BaseText> */}
      <Image
        source={require('../../assets/logo/PayBuddy 1024_500.png')}
        style={{
          height: 100,
          width: 200,
          alignSelf: 'center',
        }}
        resizeMode='contain'
      />
      <Header disableBack title='Sign in' center />
      <BaseText medium center>
        {`For extra security and app's integrity, Pay Buddy will only accessible via Google sign-in`}
      </BaseText>
      <GoogleButton
        big
        bigContainerStyle={googleBtnStyle}
        onPress={googleLogin}
      />
    </ScreenWrapper>
  );
};

const s = () =>
  themedStyles(() => ({
    screenStyle: {
      gap: hp(1),
      justifyContent: 'center',
      paddingBottom: hp(7),
    },
    googleBtnStyle: {
      marginTop: hp(1),
    },
  }));
