import { Image, View } from 'react-native';
import React from 'react';
import { BaseText, Card, themedStyles } from '../common';
import { commonStyles } from '@styles';

export const NotificationCard = () => {
  const styles = s();
  return (
    <Card style={[commonStyles.rowItemsCenter, styles.container]}>
      <Image
        source={{
          uri: 'https://imgs.search.brave.com/yu-i7pY1ud41_FAPanF07Mo1vrMNqdFHL_SW_SYFhPI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzYyLzc2Lzk1/LzM2MF9GXzQ2Mjc2/OTU2Ml9sVHJ6ZFl6/b0NGYUU3ZW5BSGli/OWtoRWlLNmJTaXpo/Ny5qcGc',
        }}
        style={{
          height: 40,
          width: 40,
          borderRadius: 50,
        }}
      />
      <BaseText medium sizeSmallExtra style={[commonStyles.flex]}>
        <BaseText bold>Rakshit vaja</BaseText>
        {` paid `}
        <BaseText bold>₹50</BaseText>
        {` on your request in `}
        <BaseText bold>Group name</BaseText>
      </BaseText>
    </Card>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      gap: 10,
    },
  }));
