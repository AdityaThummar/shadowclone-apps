import {
  BaseText,
  Card,
  Header,
  PrimaryButton,
  ScreenWrapper,
  useThemed,
} from '@components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useCallback } from 'react';
import { AuthState } from '../../zustand/AuthState';
import { useNav } from '../../helper';
import { deleteUserAccount, logout } from '../../api';
import { Alert } from 'react-native';

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

  const deleteAccount = async () => {
    try {
      const response = await deleteUserAccount();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SocialLogin',
          },
        ],
      });
      console.log('🚀 ~ deleteAccount ~ response:', response);
    } catch (error) {
      console.log('🚀 ~ deleteAccount ~ error:', error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Are you sure ?',
      'After deleting account you will not be able to access our app',
      [
        {
          text: 'Yes, Delete now',
          onPress: deleteAccount,
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  return (
    <ScreenWrapper>
      <Header title='Settings' disableBack />
      <Card>
        <BaseText semibold center>
          {`All these are just a skeleton components that we will develop in upmost version, For now just know and enjoy this demo app we allow you to access.Thank you for using this App 🙂`}
        </BaseText>
      </Card>
      <Card>
        <BaseText semibold center>
          {`You can delete your account by pressing on below "Delete Account" button`}
        </BaseText>
      </Card>
      <Card>
        <BaseText semibold center>
          {`You can logout by pressing on below "Logout" button`}
        </BaseText>
      </Card>
      <PrimaryButton title='Switch Theme' onPress={toggleTheme} />
      <PrimaryButton title='Delete Account' onPress={confirmDelete} />
      <PrimaryButton title='Logout' onPress={initLogout} />
    </ScreenWrapper>
  );
};
