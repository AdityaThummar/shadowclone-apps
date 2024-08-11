import React from 'react';
import { View, Image } from 'react-native';
import { useThemed } from '../wrapper';
import { commonStyles } from '@styles';
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
          height: size === 'big' ? 150 : 100,
          width: size === 'big' ? 150 : 100,
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
            uri:
              uri ??
              'https://imgs.search.brave.com/J2b4U21i3ZjGLwmsPGTsOAEDTsIJk2cYuNWPhk9RXJw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE0/ODQ1MTU5OTE2NDct/YzU3NjBmY2VjZmM3/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjAuMyZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1URjhmRzFo/YkdWOFpXNThNSHg4/TUh4OGZEQT0.jpeg',
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
