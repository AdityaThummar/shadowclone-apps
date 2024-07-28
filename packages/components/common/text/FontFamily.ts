import { InputProps } from '../Input';
import { BaseTextProps } from './types';

export const FontFamily = {
  primaryRegular: 'primaryRegular',
  primaryMedium: 'primaryMedium',
  primarySemiBold: 'primarySemiBold',
  primaryBold: 'primaryBold',
};

export const getFontWeight = (props: BaseTextProps | InputProps) => {
  switch (true) {
    case props?.bold:
      return FontFamily.primaryBold;
    case props?.semibold:
      return FontFamily.primarySemiBold;
    case props?.medium:
      return FontFamily.primaryMedium;

    case props?.regular:
    default:
      return FontFamily.primaryRegular;
  }
};
