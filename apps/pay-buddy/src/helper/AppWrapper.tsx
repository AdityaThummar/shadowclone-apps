import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { useThemed } from '@components';

export const AppWrapper = ({ children }: React.PropsWithChildren) => {
  // const [isUpdaing, setIsUpdaing] = useState(false);

  const onFetchUpdateAsync = async () => {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          // setIsUpdaing(true);
          await Updates.fetchUpdateAsync();
          setTimeout(async () => {
            // setIsUpdaing(false);
            await Updates.reloadAsync();
          }, 1000);
        }
      }
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
        );
      }
      const tokenResponse = await Notifications.getExpoPushTokenAsync();
      console.log('🚀 ~ onFetchUpdateAsync ~ tokenResponse:', tokenResponse);
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  };

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  return <>{children}</>;
};
