import React from 'react';
import { View, Image } from 'react-native';
import { themedStyles } from '../wrapper';
import { commonStyles } from '@styles';
import { BaseText } from '../text';
import { Card } from '../Card';

export const ListItemWithImage = () => {
  const styles = s();

  return (
    <Card style={[commonStyles.rowItemsCenter, styles.container]}>
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
    </Card>
  );
};

const s = () =>
  themedStyles(() => ({
    container: {
      gap: 10,
    },
    detailContainer: {
      flex: 1,
      gap: 2,
    },
  }));
