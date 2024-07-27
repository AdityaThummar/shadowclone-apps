import { InputProps } from '../input/types';
import { BaseTextProps } from './types';

export const FontFamily = {
  primaryRegular: 'Inter-Regular',
  primaryMedium: 'Inter-Medium',
  primarySemiBold: 'Inter-SemiBold',
  primaryBold: 'Inter-Bold',
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
