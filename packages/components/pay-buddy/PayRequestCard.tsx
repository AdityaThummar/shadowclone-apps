import React, { useMemo, useCallback } from 'react';
import { View, Image } from 'react-native';
import {
  Avatar,
  BaseIcon,
  BaseText,
  Card,
  Chip,
  TextButton,
  themedStyles,
} from '../common';
import { commonStyles, hp, wp } from '@styles';
import { Divider } from '../common/Divider';
import { ViewStyles } from '@types';
import {
  markAsPaid,
  PayRequestItemAPIPaylod,
  PayRequestItemType,
  updateRequest,
} from 'apps/pay-buddy/src/api/payRequests';
import { showInProgress } from 'apps/pay-buddy/src/screens';
import { useNav } from 'apps/pay-buddy/src/helper';
import { LoadingState } from '@zustand';
import { AuthState } from 'apps/pay-buddy/src/zustand';

export type PayRequestCardProps = {
  containerStyle?: ViewStyles;
  data?: PayRequestItemType;
  isOwn: boolean;
  isPaid: boolean;
};

export const PayRequestCard = (props: PayRequestCardProps) => {
  const { containerStyle, data, isOwn = false, isPaid = false } = props;

  const { navigate } = useNav();
  const { setLoader } = LoadingState();

  const styles = s();

  const allPaid = useMemo(
    () => data?.paidMembers?.length === data?.members?.length,
    [data],
  );

  const paidMemberCount = useMemo(
    () => (data?.paidMembers ? data?.paidMembers?.length : 0),
    [data?.paidMembers],
  );

  const goToRequestInfo = useCallback(() => {
    navigate('AddEditRequestScreen', { viewOnly: true, id: data?.id });
  }, [data]);

  const onPressMarkAsPaid = useCallback(async () => {
    if (data?.id) {
      setLoader('Updating request');
      await markAsPaid(data);
      setLoader('');
    }
  }, [data]);

  return (
    <Card
      style={[
        styles.container,
        isPaid || allPaid ? styles.completedStyle : {},
        containerStyle,
      ]}
      onPress={goToRequestInfo}
    >
      <View style={[commonStyles.rowItemsCenter, styles.topContainer]}>
        <Avatar size='tiny' uri={data?.created_by?.image} />
        <View style={[commonStyles.flex, { gap: 3 }]}>
          <BaseText bold>
            {isOwn ? 'You' : data?.created_by?.name ?? `Vikram aditya chaudhry`}
          </BaseText>
          <BaseText medium sizeSmall>
            {data?.date
              ? new Date(data?.date).toDateString()
              : new Date().toDateString()}
          </BaseText>
        </View>
        <BaseText sizeLargeExtra bold style={styles.amount} numberOfLines={1}>
          {`₹${data?.requestAmount ?? '00'}`}
        </BaseText>
      </View>
      <Divider />
      <View style={styles.middleContainer}>
        {!!data?.title && (
          <BaseText sizeLargeExtra bold>
            {data?.title}
          </BaseText>
        )}
        <View style={[commonStyles.rowItemsCenter, { gap: wp(2) }]}>
          <Chip
            title={`${data?.members?.length} Members`}
            icon='user-large'
            iconProps={{
              iFamily: 'FontAwesome6',
            }}
          />
          {data?.groups && data?.groups?.length > 0 && (
            <Chip
              title={`${data?.groups?.length} Groups`}
              icon='users'
              iconProps={{
                iFamily: 'FontAwesome6',
              }}
            />
          )}
        </View>
      </View>
      {
        <>
          <Divider />
          <View style={[commonStyles.row, styles.bottomContainer]}>
            {isPaid ? (
              <View style={[commonStyles.rowItemsCenter, styles.paidContainer]}>
                <BaseIcon
                  name='checkmark-circle'
                  size={20}
                  iconStyle={styles.paidIcon}
                />
                <BaseText bold style={[styles.paidIcon]}>
                  Paid
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
                    onPress={showInProgress}
                    containerStyle={styles.actionButtonStyle}
                    title={`${paidMemberCount} Paid`}
                  />
                  <Divider vertical />
                  <TextButton
                    onPress={showInProgress}
                    containerStyle={styles.actionButtonStyle}
                    style={styles.remainingMemberButonColor}
                    title={`${
                      data?.members
                        ? data?.members?.length - paidMemberCount
                        : 0
                    } Remains`}
                  />
                </>
              )
            ) : (
              data && (
                <>
                  <TextButton
                    onPress={onPressMarkAsPaid}
                    containerStyle={styles.actionButtonStyle}
                    title='Mark as Paid'
                  />
                  <Divider vertical />
                  <TextButton
                    onPress={showInProgress}
                    containerStyle={styles.actionButtonStyle}
                    title='Pay Now'
                  />
                </>
              )
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
      gap: hp(1),
      minWidth: wp(70),
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
      marginHorizontal: 5,
      gap: hp(1),
    },
    bottomContainer: {
      height: hp(3.5),
      justifyContent: 'center',
      alignItems: 'center',
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
    actionButtonStyle: {
      ...commonStyles.flex,
      ...commonStyles.centerCenter,
    },
  }));
