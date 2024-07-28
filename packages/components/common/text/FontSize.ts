import { InputProps } from '../input/types';
import { BaseTextProps } from './types';

export const FontSize = {
  sizeMicro: 10,
  sizeMicroExtra: 11,
  sizeTiny: 12,
  sizeTinyExtra: 13,
  sizeSmall: 14,
  sizeSmallExtra: 15,
  sizeRegular: 16,
  sizeMedium: 17,
  sizeMediumExtra: 18,
  sizeBig: 19,
  sizeBigExtra: 20,
  sizeLarge: 21,
  sizeLargeExtra: 22,
  sizeHuge: 24,
  sizeHugeExtra: 26,
  sizeHugeHeading: 28,
};

export const getFontSize: (props: BaseTextProps | InputProps) => number = (
  props,
) => {
  switch (true) {
    case props?.sizeMicro:
      return FontSize.sizeMicro;
    case props?.sizeMicroExtra:
      return FontSize.sizeMicroExtra;
    case props?.sizeTiny:
      return FontSize.sizeTiny;
    case props?.sizeTinyExtra:
      return FontSize.sizeTinyExtra;
    case props?.sizeSmall:
      return FontSize.sizeSmall;
    case props?.sizeSmallExtra:
      return FontSize.sizeSmallExtra;
    case props?.sizeMedium:
      return FontSize.sizeMedium;
    case props?.sizeMediumExtra:
      return FontSize.sizeMediumExtra;
    case props?.sizeBig:
      return FontSize.sizeBig;
    case props?.sizeBigExtra:
      return FontSize.sizeBigExtra;
    case props?.sizeLarge:
      return FontSize.sizeLarge;
    case props?.sizeLargeExtra:
      return FontSize.sizeLargeExtra;
    case props?.sizeHuge:
      return FontSize.sizeHuge;
    case props?.sizeHugeExtra:
      return FontSize.sizeHugeExtra;
    case props?.sizeHugeHeading:
      return FontSize.sizeHugeHeading;

    case props?.sizeRegular:
    default:
      return FontSize.sizeRegular;
  }
};
