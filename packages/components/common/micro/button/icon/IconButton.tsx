import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as VectorIcons from '@expo/vector-icons';
import { iconProps } from './types';

export const iconFamilies = {
  AntDesign: 'AntDesign',
  Entypo: 'Entypo',
  EvilIcons: 'EvilIcons',
  Feather: 'Feather',
  Fontisto: 'Fontisto',
  FontAwesome: 'FontAwesome',
  FontAwesome5: 'FontAwesome5',
  Foundation: 'Foundation',
  Ionicons: 'Ionicons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  MaterialIcons: 'MaterialIcons',
  Octicons: 'Octicons',
  SimpleLineIcons: 'SimpleLineIcons',
  Zocial: 'Zocial',
};

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
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Icon name={name} size={size} color={color} style={[iconStyle]} />
    </TouchableOpacity>
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
