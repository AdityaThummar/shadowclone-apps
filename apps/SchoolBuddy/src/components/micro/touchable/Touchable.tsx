import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export const Touchable = (prop: TouchableOpacityProps) => {
  return <TouchableOpacity activeOpacity={0.7} {...prop} />;
};
