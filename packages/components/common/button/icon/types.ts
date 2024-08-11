import { GestureResponderEvent, TextStyle } from 'react-native';
import * as VectorIcons from '@expo/vector-icons';
import { ViewStyles } from '@types';

export type iFamily = keyof typeof VectorIcons;

export type iconProps = {
  name?: string;
  size?: number;
  color?: string;
  iconStyle?: ViewStyles & TextStyle;
  iFamily?: iFamily;
  containerStyle?: ViewStyles | ViewStyles[];
  onPress?: (event: GestureResponderEvent) => void;
};
