import { Header, PrimaryButton, ScreenWrapper, useThemed } from '@components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useCallback } from 'react';
import { AuthState } from '../../zustand/AuthState';
import { useNav } from '../../helper';
import { logout } from '../../api';

export const SettingsScreen = () => {
  const { setUser } = AuthState();
  const { navigation } = useNav();

  const {
    themeValues: { setTheme, theme },
  } = useThemed();

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  const initLogout = useCallback(async () => {
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
  }, [setUser]);

  return (
    <ScreenWrapper>
      <Header title='Settings' disableBack />
      <PrimaryButton title='Switch Theme' onPress={toggleTheme} />
      <PrimaryButton title='Logout' onPress={initLogout} />
    </ScreenWrapper>
  );
};
