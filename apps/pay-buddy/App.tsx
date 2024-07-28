import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { EntryPoint } from './src/navigation';

const App = () => {
  const configureNotifications = async () => {
    try {
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
    configureNotifications();
  }, []);

  return <EntryPoint />;
};

export default App;
