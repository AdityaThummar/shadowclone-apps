import { ViewStyles } from '../../../types/commonTypes';
import { BaseTextProps } from '../text';

export type HeaderProps = {
  title?: string;
  containerStyle?: ViewStyles;
  disableBack?: boolean;
  onPressBack?: () => void;
} & BaseTextProps;
