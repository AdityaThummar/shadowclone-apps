import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useNav } from '../helper';

export const KeyboardListner = () => {
  const navigation = useNav();

  useEffect(() => {
    const keyboardShowListner = Keyboard.addListener('keyboardWillShow', () => {
      navigation.setOptions({
        tabBarStyle: {
          display: 'none',
        },
      });
    });

    const keyboardHideListner = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        navigation.setOptions({
          tabBarStyle: {
            display: 'flex',
          },
        });
      },
    );

    return () => {
      keyboardShowListner.remove();
      keyboardHideListner.remove();
    };
  }, [navigation]);

  return null;
};
