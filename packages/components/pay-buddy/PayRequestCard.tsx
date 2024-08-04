import React from 'react';
import { View, Image } from 'react-native';
import { BaseIcon, BaseText, Card, TextButton, themedStyles } from '../common';
import { commonStyles } from '@styles';
import { Divider } from '../common/Divider';
import { ViewStyles } from '@types';
import { PayRequestItemType } from 'apps/pay-buddy/src/api/payRequests';

export type PayRequestCardProps = {
  containerStyle?: ViewStyles;
  data?: PayRequestItemType;
  isOwn: boolean;
  isPaid: boolean;
};

export const PayRequestCard = (props: PayRequestCardProps) => {
  const { containerStyle, data, isOwn = false, isPaid = false } = props;

  const styles = s();

  const allPaid = isOwn && Math.random() < 0.5;

  return (
    <Card
      style={[
        styles.container,
        isPaid || allPaid ? styles.completedStyle : {},
        containerStyle,
      ]}
    >
      <View style={[commonStyles.rowItemsCenter, styles.topContainer]}>
        <Image
          source={{
            uri:
              data?.user?.image ??
              'https://imgs.search.brave.com/ugRIeNH7jBTHZaHmvGXVVJoLmLVRZbLW8sGbRd1y8L8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTA3/NDgwODcyL3Bob3Rv/L3BvcnRyYWl0LW9m/LWEtbWF0dXJlLW1h/bi1zbWlsaW5nLWF0/LXRoZS1jYW1lcmEu/d2VicD9iPTEmcz0x/NzA2NjdhJnc9MCZr/PTIwJmM9YXY5OHJq/SU8yTXJ6TGFPSnN5/b2FBV3VwQ2tlcFpL/MVRKMGN1LURLQktB/dz0',
          }}
          style={{
            height: 40,
            width: 40,
            borderRadius: 50,
          }}
        />
        <View style={[commonStyles.flex, { gap: 3 }]}>
          <BaseText bold>
            {isOwn ? 'You' : data?.user?.name ?? `Vikram aditya chaudhry`}
          </BaseText>
          <BaseText medium sizeSmall>
            {data?.date
              ? new Date(data?.date).toDateString()
              : new Date().toDateString()}
          </BaseText>
        </View>
        <BaseText sizeLargeExtra bold style={styles.amount} numberOfLines={1}>
          {`₹${data?.amount ?? 56}`}
        </BaseText>
      </View>
      <Divider />
      <View style={styles.middleContainer}>
        <BaseText sizeLargeExtra bold>
          {data?.title ?? `Samosa, Pizza and Vadapav`}
        </BaseText>
        <BaseText sizeSmall semibold>
          Requested to 3 members
        </BaseText>
      </View>
      {
        <>
          <Divider />
          <View
            style={[
              commonStyles.rowItemCenterJustifyEvenly,
              styles.bottomContainer,
            ]}
          >
            {isPaid ? (
              <View style={[commonStyles.rowItemsCenter, styles.paidContainer]}>
                <BaseIcon
                  name='checkmark-circle'
                  size={20}
                  iconStyle={styles.paidIcon}
                />
                <BaseText bold style={styles.paidIcon}>
                  Paid on Sat 23 Aug 2024
                </BaseText>
              </View>
            ) : isOwn ? (
              allPaid ? (
                <View
                  style={[commonStyles.rowItemsCenter, styles.paidContainer]}
                >
                  <BaseIcon
                    name='checkmark-circle'
                    size={20}
                    iconStyle={styles.paidIcon}
                  />
                  <BaseText bold style={styles.paidIcon}>
                    All Members paid
                  </BaseText>
                </View>
              ) : (
                <>
                  <TextButton
                    containerStyle={commonStyles.flex}
                    title='2 Paid'
                  />
                  <Divider vertical />
                  <TextButton
                    containerStyle={commonStyles.flex}
                    style={styles.remainingMemberButonColor}
                    title='3 Remaining'
                  />
                </>
              )
            ) : (
              <>
                <TextButton
                  containerStyle={commonStyles.flex}
                  title='Mark as Paid'
                />
                <Divider vertical />
                <TextButton
                  containerStyle={commonStyles.flex}
                  title='Pay Now'
                />
              </>
            )}
          </View>
        </>
      }
    </Card>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      gap: 5,
    },
    topContainer: {
      gap: 10,
    },
    amount: {
      backgroundColor: colors.inputBackground,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 18,
      overflow: 'hidden',
      maxWidth: 80,
    },
    detailsContainer: {
      gap: 10,
    },
    middleContainer: {
      marginBottom: 5,
      marginHorizontal: 5,
      gap: 3,
    },
    bottomContainer: {
      height: 35,
    },
    paidContainer: {
      gap: 5,
    },
    paidIcon: {
      color: colors.tint,
    },
    completedStyle: {
      backgroundColor: colors.completedCardBackground,
    },
    remainingMemberButonColor: {
      color: colors.secondary,
    },
  }));
