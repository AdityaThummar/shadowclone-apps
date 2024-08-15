import React from 'react';
import { View, Image } from 'react-native';
import { useThemed } from '../wrapper';
import { commonStyles, wp } from '@styles';
import { BaseIcon } from '../button';
import { ViewStyles } from '@types';

export type AvatarProps = {
  uri?: string;
  size?: 'big' | 'medium' | 'small';
  containerStyle?: ViewStyles;
};

export const Avatar = (props: AvatarProps) => {
  const { size = 'medium', uri, containerStyle = {} } = props;

  const {
    themeValues: { colors },
  } = useThemed();

  return (
    <View
      style={[
        {
          height: size === 'big' ? wp(45) : size === 'medium' ? wp(22) : wp(18),
          width: size === 'big' ? wp(45) : size === 'medium' ? wp(22) : wp(18),
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
          name='user-large'
          size={size === 'big' ? 80 : 50}
          color={colors.secondary}
          containerStyle={[
            commonStyles.centerCenter,
            {
              flex: 1,
            },
          ]}
          iFamily='FontAwesome6'
        />
      )}
    </View>
  );
};
