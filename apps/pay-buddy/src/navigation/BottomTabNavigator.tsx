import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { BottomTabScreenProps } from './types';
import { HomeScreen, SearchScreen } from '../screens';
import { BaseIcon, useThemed } from '@components';

const BottomTab = createBottomTabNavigator<BottomTabScreenProps>();

export const BottomTabNavigator = () => {
  const {
    themeValues: { colors },
  } = useThemed();

  const screenOptions: BottomTabNavigationOptions = useMemo(
    () => ({
      contentStyle: {
        backgroundColor: colors.primary,
      },
      headerShown: false,
      tabBarShowLabel: false,
    }),
    [colors],
  );

  const renderTabIcon = useCallback(
    (
      iconName: string,
      props: {
        focused: boolean;
        color: string;
        size: number;
      },
    ) => {
      return <BaseIcon name={iconName} color={props.color} size={props.size} />;
    },
    [],
  );

  return (
    <BottomTab.Navigator screenOptions={screenOptions}>
      <BottomTab.Screen
        name='Home'
        options={{
          tabBarIcon: renderTabIcon.bind(this, 'home'),
        }}
        component={HomeScreen}
      />
      <BottomTab.Screen
        name='Search'
        options={{
          tabBarIcon: renderTabIcon.bind(this, 'search'),
        }}
        component={SearchScreen}
      />
    </BottomTab.Navigator>
  );
};
