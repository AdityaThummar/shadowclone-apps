import { TouchableOpacityProps } from 'react-native';
import { BaseTextProps, BaseTextStyle } from '../../text';

export type PrimaryButtonProps = {
  title?: string;
  titleProps?: BaseTextProps;
  titleStyle?: BaseTextStyle;
} & TouchableOpacityProps;
