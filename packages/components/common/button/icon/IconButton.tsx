import React from 'react';
import { View } from 'react-native';
import * as VectorIcons from '@expo/vector-icons';
import { iconProps } from './types';
import { Touchable } from '../../Touchable';

export const IconButton = ({
  name = 'add',
  size = 25,
  color = 'red',
  containerStyle,
  iconStyle = {},
  iFamily = 'Ionicons',
  onPress = () => {},
}: iconProps) => {
  const Icon = VectorIcons[iFamily];

  return (
    <Touchable onPress={onPress} style={containerStyle}>
      <Icon name={name} size={size} color={color} style={[iconStyle]} />
    </Touchable>
  );
};

export const BaseIcon = ({
  name = 'add',
  size = 25,
  color = 'red',
  iconStyle = {},
  iFamily = 'Ionicons',
  containerStyle,
}: iconProps) => {
  const Icon = VectorIcons[iFamily];

  return (
    <View style={containerStyle}>
      <Icon name={name} size={size} color={color} style={[iconStyle]} />
    </View>
  );
};
