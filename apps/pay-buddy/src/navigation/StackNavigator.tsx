import React, { useMemo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StackScreenProps } from './types';
import { SocialLoginScreen } from '../screens';
import { useThemed } from '@components';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AuthState } from '../zustand/AuthState';

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
      initialRouteName={user?.user?.uid ? 'BottomTab' : 'SocialLogin'}
    >
      <NStack.Screen name='SocialLogin' component={SocialLoginScreen} />
      <NStack.Screen name='BottomTab' component={BottomTabNavigator} />
    </NStack.Navigator>
  );
};
