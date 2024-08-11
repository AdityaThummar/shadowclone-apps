import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { FullScreenLoader } from '@components';
import { LoadingState } from '@zustand';

export const AppWrapper = ({ children }: React.PropsWithChildren) => {
  const { setLoader } = LoadingState();

  const onFetchUpdateAsync = async () => {
    try {
      setLoader('Checking updates');
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setLoader('Downloading update');
          await Updates.fetchUpdateAsync();
          setTimeout(async () => {
            await Updates.reloadAsync();
          }, 1000);
        }
        setLoader();
      }
      setLoader();
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
        );
      }
      const tokenResponse = await Notifications.getExpoPushTokenAsync();
      console.log('🚀 ~ onFetchUpdateAsync ~ tokenResponse:', tokenResponse);
    } catch (error) {
      setLoader();
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      console.log(`Error fetching latest Expo update: ${error}`);
    }
  };

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  return (
    <>
      {children}
      <FullScreenLoader />
    </>
  );
};
