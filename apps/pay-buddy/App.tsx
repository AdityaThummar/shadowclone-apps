import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { EntryPoint } from './src/navigation';
import { useFonts } from 'expo-font';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [loaded, error] = useFonts({
    primaryRegular: require('./src/assets/fonts/Inter-Regular.ttf'),
    primaryMedium: require('./src/assets/fonts/Inter-Medium.ttf'),
    primarySemiBold: require('./src/assets/fonts/Inter-SemiBold.ttf'),
    primaryBold: require('./src/assets/fonts/Inter-Bold.ttf'),
  });

  const configureNotifications = async () => {
    try {
      await SplashScreen.hideAsync();
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
        );
      }
      const tokenResponse = await Notifications.getExpoPushTokenAsync();
      console.log(
        '🚀 ~ configureNotifications ~ tokenResponse:',
        tokenResponse,
      );
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  };

  useEffect(() => {
    loaded && configureNotifications();
  }, [loaded]);

  return <EntryPoint />;
};

export default App;
