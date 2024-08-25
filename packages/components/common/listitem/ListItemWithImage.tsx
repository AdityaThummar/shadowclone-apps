import React from 'react';
import { View, Image } from 'react-native';
import { themedStyles, useThemed } from '../wrapper';
import { commonStyles } from '@styles';
import { BaseText } from '../text';
import { Card, CardProps } from '../Card';
import { IconButton } from '../button';
import { GroupDetailsType } from 'apps/pay-buddy/src/api/types';
import { Avatar } from '../image';

export type ListItemWithImageProps = {
  isSelection?: boolean;
  selected?: boolean;
  item: GroupDetailsType;
} & CardProps;

export const ListItemWithImage = (props: ListItemWithImageProps) => {
  const { isSelection = false, selected = false, item, ...cardProps } = props;
  const styles = s();
  const {
    themeValues: { colors },
  } = useThemed();

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
            right: 0,
          }}
          iFamily={selected ? 'Ionicons' : 'Feather'}
          size={25}
          color={colors.tint}
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
