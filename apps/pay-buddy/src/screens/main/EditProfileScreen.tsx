import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  Header,
  IconButton,
  Input,
  PrimaryButton,
  ScreenWrapper,
  useThemed,
} from '@components';
import { registerErrorHandlers } from 'expo-dev-client';
import { useNav } from '../../helper';

export const EditProfileScreen = () => {
  const {
    themeValues: { colors },
  } = useThemed();
  return (
    <ScreenWrapper>
      <Header title='Edit Profile' />
      <View style={{ alignSelf: 'center' }}>
        <Image
          source={{
            uri: 'https://imgs.search.brave.com/J2b4U21i3ZjGLwmsPGTsOAEDTsIJk2cYuNWPhk9RXJw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE0/ODQ1MTU5OTE2NDct/YzU3NjBmY2VjZmM3/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjAuMyZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1URjhmRzFo/YkdWOFpXNThNSHg4/TUh4OGZEQT0.jpeg',
          }}
          style={{
            height: 150,
            width: 150,
            borderRadius: 100,
            alignSelf: 'center',
            marginVertical: 15,
          }}
        />
        <IconButton
          name='pencil'
          iFamily='Foundation'
          containerStyle={{
            position: 'absolute',
            top: -10,
            right: -10,
            backgroundColor: colors.tint,
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            elevation: 4,
            shadowColor: colors.tint,
            shadowRadius: 2,
            shadowOpacity: 0.5,
            shadowOffset: {
              height: 0,
              width: 0,
            },
          }}
          iconStyle={{
            color: colors.primary,
          }}
        />
      </View>
      <Input label='Name' />
      <Input label='Bio' />
      <PrimaryButton title={'Save'} style={{ marginTop: 15 }} />
    </ScreenWrapper>
  );
};
