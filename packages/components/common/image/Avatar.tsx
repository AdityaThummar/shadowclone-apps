import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useThemed } from '../wrapper';
import { commonStyles, wp } from '@styles';
import { BaseIcon } from '../button';
import { ViewStyles } from '@types';

export type AvatarProps = {
  uri?: string;
  size?: 'big' | 'medium' | 'small' | 'tiny';
  containerStyle?: ViewStyles;
  isGroup?: boolean;
};

export const Avatar = (props: AvatarProps) => {
  const { size = 'medium', uri, containerStyle = {}, isGroup = false } = props;

  const {
    themeValues: { colors },
  } = useThemed();

  return (
    <View
      style={[
        {
          height:
            size === 'big'
              ? wp(45)
              : size === 'medium'
              ? wp(22)
              : size === 'small'
              ? wp(18)
              : wp(10),
          width:
            size === 'big'
              ? wp(45)
              : size === 'medium'
              ? wp(22)
              : size === 'small'
              ? wp(18)
              : wp(10),
          borderRadius: 100,
          alignSelf: 'center',
          overflow: 'hidden',
          backgroundColor: colors.inputBackground,
        },
        containerStyle,
      ]}
    >
      {uri ? (
        <Image
          source={{
            uri,
          }}
          style={{
            flex: 1,
          }}
        />
      ) : (
        <BaseIcon
          name={isGroup ? 'users' : 'user-large'}
          size={
            size === 'big'
              ? 80
              : size === 'medium'
              ? 50
              : size === 'small'
              ? 35
              : 20
          }
          color={colors.secondary}
          containerStyle={[
            commonStyles.centerCenter,
            {
              flex: 1,
            },
          ]}
          iFamily={'FontAwesome6'}
        />
      )}
    </View>
  );
};
