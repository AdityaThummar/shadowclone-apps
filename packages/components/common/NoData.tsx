import React from 'react';
import { BaseText, BaseTextProps } from './text';

export type NoDataProps = BaseTextProps;

export const NoData = (props: BaseTextProps = {}) => {
  return (
    <BaseText regular sizeRegular {...props}>
      No Data
    </BaseText>
  );
};
