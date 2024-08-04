import React from 'react';
import { IconButton } from './IconButton';
import { iconProps } from './types';
import { useThemed } from '../../wrapper';

export const PlusButton = (props: iconProps) => {
  const {
    themeValues: { colors },
  } = useThemed();

  return (
    <IconButton name='plus' color={colors.tint} iFamily='Entypo' {...props} />
  );
};
