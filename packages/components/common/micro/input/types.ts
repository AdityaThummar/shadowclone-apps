import { TextInputProps } from 'react-native';
import { BaseTextProps, BaseTextStyle, SizeProps, WeightProps } from '../text';
import { ViewStyles } from '../../../types/commonTypes';

export type InputProps = TextInputProps &
  SizeProps &
  WeightProps & {
    containerStyle?: ViewStyles;
    inputContainerStyle?: ViewStyles;
    labelProps?: Omit<BaseTextProps, 'style'>;
    labelStyle?: BaseTextStyle;
    label?: string;
    horizontal?: boolean;
    isPassword?: boolean;
    error?: string;
  };
