import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = (
  preCall: () => void = () => {},
  postCall: (res: ImagePicker.ImagePickerResult) => void = () => {},
) => {
  const openCamera = async () => {
    preCall();
    try {
      let permission = await ImagePicker.getCameraPermissionsAsync();
      if (!permission.granted) {
        if (permission.canAskAgain) {
          permission = await ImagePicker.requestCameraPermissionsAsync();
        } else {
          Alert.alert(
            'Oops',
            'You need to give access of Camera to capture an image',
            [
              {
                text: 'Cancel',
              },
              {
                text: 'Open Settings',
                onPress: Linking.openSettings,
              },
            ],
          );
        }
      }

      if (permission?.granted) {
        const response = await ImagePicker.launchCameraAsync();
        if (!response?.canceled) {
          postCall(response);
          return 'canceled';
        } else {
          postCall(response);
          return response;
        }
      }
    } catch (error) {
      console.log('🚀 ~ openCamera ~ error:', error?.toString());
      if (error?.toString()?.includes('Camera not available on simulator')) {
        Alert.alert('Oops', 'Seems this device does not support camera !!');
        return;
      }
    }
  };

  const openGallery = async () => {
    preCall();
    try {
      let permission = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        if (permission.canAskAgain) {
          permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        } else {
          Alert.alert(
            'Oops',
            'You need to give access of Photos to select an image',
            [
              {
                text: 'Cancel',
              },
              {
                text: 'Open Settings',
                onPress: Linking.openSettings,
              },
            ],
          );
        }
      }
      if (permission.granted) {
        const response = await ImagePicker.launchImageLibraryAsync({
          selectionLimit: 1,
        });
        if (!response?.canceled) {
          postCall(response);
          return 'canceled';
        } else {
          postCall(response);
          return response;
        }
      }
    } catch (error) {
      console.log('🚀 ~ openGallery ~ error:', error);
    }
  };

  return { openCamera, openGallery };
};
