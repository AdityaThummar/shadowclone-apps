import React from 'react';
import { Card } from './Card';
import { useThemed } from './wrapper';
import { hp, wp } from '@styles';
import { BaseText } from './text';

export type NotificationCountProps = {
  count: string | number;
};

export const NotificationCount = ({ count }: NotificationCountProps) => {
  const {
    themeValues: { colors },
  } = useThemed();

  if (!Number(count)) {
    return null;
  }

  return (
    <Card
      style={{
        backgroundColor: colors.tint,
        position: 'absolute',
        top: -hp(0.5),
        right: -hp(0.5),
        height: wp(4.5),
        width: wp(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(4.5),
        padding: 0,
        margin: 0,
      }}
      disabled
    >
      <BaseText sizeTiny semibold style={{ color: colors.primary }}>
        {count?.toString()}
      </BaseText>
    </Card>
  );
};
