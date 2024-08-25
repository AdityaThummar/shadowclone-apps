import {
  Avatar,
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
import { Alert, View } from 'react-native';
import { LoadingState } from '@zustand';
import { commonStyles, hp, wp } from '@styles';
import { UsersState } from '../../zustand';

export const SettingsScreen = () => {
  const navigation = useNav();
  const { user, clearUser } = AuthState();
  const { clearState } = UsersState();
  const { setLoader } = LoadingState();

  const {
    themeValues: { setTheme, theme },
  } = useThemed();

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  const initLogout = useCallback(async () => {
    setLoader('Clearing creds');
    clearState();
    await logout();
    await GoogleSignin.signOut();
    clearUser();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SocialLogin',
        },
      ],
    });
    setLoader();
  }, [user]);

  const deleteAccount = useCallback(async () => {
    try {
      setLoader('Deleting profile');
      await deleteUserAccount();
    } catch (error) {
      console.log('🚀 ~ deleteAccount ~ error:', error);
    } finally {
      clearState();
      clearUser();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SocialLogin',
          },
        ],
      });
      setLoader();
    }
  }, [user]);

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

  const goToEditProfile = () => {
    navigation.navigate('EditProfileScreen', { type: 'edit-profile' });
  };

  return (
    <ScreenWrapper>
      <Header title='Settings' disableBack />
      {/* <Card>
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
      </Card> */}
      <Card
        style={[
          commonStyles.rowItemsCenter,
          {
            gap: wp(2),
          },
        ]}
        disabled
      >
        <Avatar uri={user?.userProfile?.image} size='small' />
        <View style={[commonStyles.flex, { gap: hp(0.3) }]}>
          <BaseText bold sizeHugeExtra numberOfLines={2}>
            {user?.userProfile?.name}
          </BaseText>
          {user?.userProfile?.bio && (
            <BaseText semibold sizeMedium numberOfLines={2}>
              {user?.userProfile?.bio}
            </BaseText>
          )}
        </View>
      </Card>
      <PrimaryButton title='Edit Account' onPress={goToEditProfile} />
      <PrimaryButton title='Switch Theme' onPress={toggleTheme} />
      <PrimaryButton title='Delete Account' onPress={confirmDelete} />
      <PrimaryButton title='Logout' onPress={initLogout} />
    </ScreenWrapper>
  );
};
