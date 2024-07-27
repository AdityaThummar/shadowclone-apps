import React, { useMemo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StackScreenProps } from './types';
import { LoginScreen, SignupScreen } from '../../screens';
import { ThemeState } from '../../zustand';

const NStack = createNativeStackNavigator<StackScreenProps>();

export const StackNavigation = () => {
  const { colors } = ThemeState();

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
