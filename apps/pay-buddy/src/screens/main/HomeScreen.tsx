import { Text } from 'react-native';
import React from 'react';
import { Header, PrimaryButton, ScreenWrapper } from '@components';
import { AuthState } from '../../zustand/AuthState';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNav } from '../../helper';
import { logout } from '../../api';

export const HomeScreen = () => {
  const { setUser } = AuthState();
  const { navigation } = useNav();

  const initLogout = async () => {
    setUser(undefined);
    await logout();
    await GoogleSignin.signOut();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SocialLogin',
        },
      ],
    });
  };

  return (
    <ScreenWrapper>
      <Header title='Home' disableBack />
      <PrimaryButton title='Logout' onPress={initLogout} />
    </ScreenWrapper>
  );
};
