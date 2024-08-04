import React from 'react';
import { View, Image } from 'react-native';
import { themedStyles, useThemed } from '../wrapper';
import { commonStyles } from '@styles';
import { BaseText } from '../text';
import { Card, CardProps } from '../Card';
import { IconButton } from '../button';

export type ListItemWithImageProps = {
  isSelection?: boolean;
  selected?: boolean;
} & CardProps;

export const ListItemWithImage = (props: ListItemWithImageProps) => {
  const { isSelection = false, selected = false, ...cardProps } = props;
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
      <Image
        source={{
          uri: 'https://imgs.search.brave.com/bfYK3qlSOrqEFePfn3_Doq2llUOGbGxRMXGtI_kWARs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NjY0OTIwMzE3NzMt/NGY0ZTQ0NjcxODU3/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjAuMyZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1USjhmR2R2/YjJRbE1qQnRZVzU4/Wlc1OE1IeDhNSHg4/ZkRBPQ.jpeg',
        }}
        style={{
          height: 70,
          width: 70,
          borderRadius: 70,
        }}
      />
      <View style={styles.detailContainer}>
        <BaseText sizeBig bold>
          Group Name goes Here
        </BaseText>
        <BaseText medium>Recently: Samosa, Vadapav, and Pizza</BaseText>
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
