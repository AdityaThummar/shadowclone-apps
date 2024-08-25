import React, { useMemo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StackScreenProps } from './types';
import {
  AddEditRequestScreen,
  ChatListScreen,
  EditProfileScreen,
  SelectItemScreen,
  SocialLoginScreen,
  ViewProfileScreen,
} from '../screens';
import { useThemed } from '@components';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AuthState } from '../zustand/AuthState';
import { AddEditGroupScreen } from '../screens/main/AddEditGroupScreen';

const NStack = createNativeStackNavigator<StackScreenProps>();

export const StackNavigation = () => {
  const {
    themeValues: { colors },
  } = useThemed();
  const { user } = AuthState();

  const screenOptions: NativeStackNavigationOptions = useMemo(
    () => ({
      contentStyle: {
        backgroundColor: colors.primary,
      },
      headerShown: false,
    }),
    [colors],
  );

  return (
    <NStack.Navigator
      screenOptions={screenOptions}
      initialRouteName={
        user?.firebaseUser?.user?.uid
          ? user?.userProfile?.name
            ? 'BottomTab'
            : 'EditProfileScreen'
          : 'SocialLogin'
      }
    >
      <NStack.Screen name='SocialLogin' component={SocialLoginScreen} />
      <NStack.Screen name='BottomTab' component={BottomTabNavigator} />
      <NStack.Screen
        name='AddEditRequestScreen'
        component={AddEditRequestScreen}
      />
      <NStack.Screen name='SelectItemScreen' component={SelectItemScreen} />
      <NStack.Screen name='AddEditGroupScreen' component={AddEditGroupScreen} />
      <NStack.Screen
        name='EditProfileScreen'
        component={EditProfileScreen}
        initialParams={{ type: 'new-profile', userData: undefined }}
      />
      <NStack.Screen name='ChatListScreen' component={ChatListScreen} />
      <NStack.Screen name='ViewProfileScreen' component={ViewProfileScreen} />
    </NStack.Navigator>
  );
};
