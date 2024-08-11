import React, { useCallback } from 'react';
import {
  BaseText,
  GoogleButton,
  Header,
  ScreenWrapper,
  themedStyles,
  useThemed,
} from '@components';
import { hp, wp } from '@styles';
import { login } from '../../api';
import { AuthState } from '../../zustand/AuthState';
import { useNav } from '../../helper';
import { Image } from 'react-native';
import { LoadingState } from '@zustand';
import { Logos } from '../../assets';

export const SocialLoginScreen = () => {
  const { reset } = useNav();
  const { setUser } = AuthState();
  const { setLoader } = LoadingState();

  const {
    themeValues: { colors },
  } = useThemed();
  const { screenStyle, googleBtnStyle } = s();

  const googleLogin = useCallback(async () => {
    setLoader('Signin in');
    const response = await login(setLoader);
    setLoader();
    if (response?.success && response?.data) {
      setUser(response?.data);
      const isExistingUser = response?.data?.userProfile?.name;
      reset({
        index: 0,
        routes: [
          {
            name: isExistingUser ? 'BottomTab' : 'EditProfileScreen',
            params: isExistingUser
              ? {}
              : {
                  type: 'new-profile',
                },
          },
        ],
      });
    }
  }, [login, setUser]);

  return (
    <ScreenWrapper style={screenStyle}>
      {/* <BaseText center sizeHugeHeading bold>
        Pay Buddy
      </BaseText> */}
      <Image
        source={Logos.PayBuddyLogo}
        style={{
          height: hp(35),
          width: wp(90),
          alignSelf: 'center',
          // backgroundColor: 'red',
          transform: [
            {
              rotate: '-35deg',
            },
          ],
          marginBottom: hp(2),
        }}
        resizeMode='contain'
        tintColor={colors.secondary}
      />
      <Header disableBack title='Sign in' center />
      <BaseText medium center style={{ maxWidth: wp(90) }}>
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
      width: wp(70),
    },
  }));
