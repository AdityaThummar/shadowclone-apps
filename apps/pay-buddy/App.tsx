import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { EntryPoint } from './src/navigation';
import {
  InterBold,
  InterMedium,
  InterRegular,
  InterSemiBold,
} from './src/assets';
import { EXPO_PROJECT_ID } from './configs/expoConfigs';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [loaded, error] = useFonts({
    primaryMedium: InterMedium,
    primaryRegular: InterRegular,
    primarySemiBold: InterSemiBold,
    primaryBold: InterBold,
  });

  const configureNotifications = async () => {
    try {
      await SplashScreen.hideAsync();
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
        );
      }
      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID,
      });
      console.log(
        '🚀 ~ configureNotifications ~ tokenResponse:',
        tokenResponse,
      );
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      // alert(`Error fetching latest Expo update: ${error}`);
    }
  };

  useEffect(() => {
    if (loaded) {
      configureNotifications();
    }
    if (error) {
      console.log('errorerrorerrorerror', error);
    }
  }, [loaded, error]);

  return <EntryPoint />;
};

export default App;
