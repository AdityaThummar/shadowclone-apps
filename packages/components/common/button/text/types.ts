import { ViewStyles } from '@types';
import { TouchableOpacityProps } from 'react-native';
import { BaseTextProps, BaseTextStyle } from '../../text';

export type TextButtonProps = {
  containerStyle?: ViewStyles;
  containerProps?: Omit<TouchableOpacityProps, 'onPress'>;
  onPress?: () => void;
  title?: string;
  style?: BaseTextStyle;
} & Omit<BaseTextProps, 'children'>;
