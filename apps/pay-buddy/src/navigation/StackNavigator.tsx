import React, { useMemo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StackScreenProps } from './types';
import { LoginScreen, SignupScreen } from '../screens/auth';
import { useThemed } from '@components';

const NStack = createNativeStackNavigator<StackScreenProps>();

export const StackNavigation = () => {
  const {
    themeValues: { colors },
  } = useThemed();

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
    <NStack.Navigator screenOptions={screenOptions} initialRouteName='Login'>
      <NStack.Screen name='Login' component={LoginScreen} />
      <NStack.Screen name='Signup' component={SignupScreen} />
    </NStack.Navigator>
  );
};
