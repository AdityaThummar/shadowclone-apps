import { TextProps, TextStyle } from 'react-native';

export type BaseTextStyle = Omit<TextStyle, 'fontWeight'>;
export type BaseTextStyles = BaseTextStyle | BaseTextStyle[];

export type WeightProps = {
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
  regular?: boolean;
};
//dependes on "./FontFamily.ts"

export type SizeProps = {
  sizeMicro?: boolean;
  sizeMicroExtra?: boolean;
  sizeTiny?: boolean;
  sizeTinyExtra?: boolean;
  sizeSmall?: boolean;
  sizeSmallExtra?: boolean;
  sizeRegular?: boolean;
  sizeMedium?: boolean;
  sizeMediumExtra?: boolean;
  sizeBig?: boolean;
  sizeBigExtra?: boolean;
  sizeLarge?: boolean;
  sizeLargeExtra?: boolean;
  sizeHuge?: boolean;
  sizeHugeExtra?: boolean;
  sizeHugeHeading?: boolean;
};
//dependes on "./FontSize.ts"

export type AlignProps = {
  center?: boolean;
  left?: boolean;
  right?: boolean;
};
//for textalignment

export type BaseTextProps = WeightProps &
  SizeProps &
  AlignProps &
  Omit<TextProps, 'style'> & {
    style?: BaseTextStyles | BaseTextStyles[];
  };
