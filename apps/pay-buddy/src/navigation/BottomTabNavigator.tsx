import React, { useCallback, useEffect, useMemo } from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { BottomTabScreenProps } from './types';
import {
  GroupScreen,
  HomeScreen,
  NotificationsScreen,
  SearchScreen,
  SettingsScreen,
} from '../screens';
import {
  BaseIcon,
  BaseText,
  Card,
  NotificationCount,
  useThemed,
} from '@components';
import { getUserProfile, logout } from '../api';
import { useNav } from '../helper';
import { AuthState, UsersState } from '../zustand';
import { View } from 'react-native';
import { hp, wp } from '@styles';

const BottomTab = createBottomTabNavigator<BottomTabScreenProps>();

export const BottomTabNavigator = () => {
  const { clearUser } = AuthState();
  const { reset } = useNav();
  const { receivedRequests } = UsersState();
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
      tabBarStyle: {
        backgroundColor: colors.primary,
      },
      tabBarActiveTintColor: colors.tint,
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
      return (
        <View>
          <BaseIcon {...props} name={iconName} />
          {iconName === 'notifications' && (
            <NotificationCount count={receivedRequests.length} />
          )}
        </View>
      );
    },
    [receivedRequests, colors],
  );

  const checkUser = async () => {
    const response = await getUserProfile();
    if (!response?.success || !response?.data?.uid) {
      await logout();
      clearUser();
      reset({
        index: 0,
        routes: [
          {
            name: 'SocialLogin',
          },
        ],
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <BottomTab.Navigator screenOptions={screenOptions} initialRouteName='Home'>
      <BottomTab.Screen
        name='Home'
        options={{
          tabBarIcon: renderTabIcon.bind(this, 'home'),
        }}
        component={HomeScreen}
      />
      <BottomTab.Screen
        name='Groups'
        options={{
          tabBarIcon: renderTabIcon.bind(this, 'people'),
        }}
        component={GroupScreen}
      />
      <BottomTab.Screen
        name='Search'
        options={{
          tabBarIcon: renderTabIcon.bind(this, 'person-add'),
        }}
        component={SearchScreen}
      />
      <BottomTab.Screen
        name='Notifications'
        options={{
          tabBarIcon: renderTabIcon.bind(this, 'notifications'),
        }}
        component={NotificationsScreen}
      />
      <BottomTab.Screen
        name='Settings'
        options={{
          tabBarIcon: renderTabIcon.bind(this, 'settings'),
        }}
        component={SettingsScreen}
      />
    </BottomTab.Navigator>
  );
};
