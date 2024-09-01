import React, { useCallback } from 'react';
import { View, Image } from 'react-native';
import { themedStyles, useThemed } from '../wrapper';
import { commonStyles, wp } from '@styles';
import { BaseText } from '../text';
import { Card, CardProps } from '../Card';
import { IconButton, TextButton } from '../button';
import { GroupDetailsType } from 'apps/pay-buddy/src/api/types';
import { Avatar } from '../image';
import { useNav } from 'apps/pay-buddy/src/helper';

export type ListItemWithImageProps = {
  isSelection?: boolean;
  selected?: boolean;
  item: GroupDetailsType;
  enableRemove?: boolean;
  onPressRemove?: (item: GroupDetailsType) => void;
} & CardProps;

export const ListItemWithImage = (props: ListItemWithImageProps) => {
  const {
    isSelection = false,
    selected = false,
    item,
    enableRemove,
    onPressRemove,
    ...cardProps
  } = props;

  const { push } = useNav();
  const {
    themeValues: { colors },
  } = useThemed();

  const styles = s();

  return (
    <Card
      {...cardProps}
      style={[
        commonStyles.rowItemsCenter,
        styles.container,
        isSelection && selected ? styles.selectedStyle : {},
        cardProps?.style,
      ]}
    >
      <Avatar size='small' uri={item?.image} isGroup />
      <View style={styles.detailContainer}>
        <BaseText sizeBig bold>
          {item?.name}
        </BaseText>
        {/* <BaseText medium>Recently: Samosa, Vadapav, and Pizza</BaseText> */}
      </View>
      {isSelection && (
        <IconButton
          name={selected ? 'checkmark-circle' : 'circle'}
          containerStyle={{
            top: 0,
            right: wp(1),
          }}
          iFamily={selected ? 'Ionicons' : 'Feather'}
          size={25}
          color={colors.tint}
          onPress={cardProps?.onPress}
        />
      )}
      {enableRemove && (
        <IconButton
          name={'close-circle'}
          containerStyle={{
            top: 0,
            right: wp(1),
          }}
          size={30}
          color={colors.tint}
          onPress={onPressRemove?.bind(this, item)}
        />
      )}
    </Card>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      gap: 10,
    },
    detailContainer: {
      flex: 1,
      gap: 2,
    },
    selectedStyle: {
      backgroundColor: colors.completedCardBackground,
    },
  }));
