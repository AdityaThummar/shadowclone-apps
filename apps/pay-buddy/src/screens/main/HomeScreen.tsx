import React, {
  useCallback,
  useMemo,
  // useCallback,
  useState,
} from 'react';
import {
  BaseText,
  Chip,
  NoData,
  PayRequestCard,
  // Card,
  // IconButton,
  // PayRequestCard,
  PlusButton,
  ScreenWrapper,
  Scroll,
  TabItemType,
  themedStyles,
  TopTabs,
  useThemed,
} from '@components';
import {
  Alert,
  // SectionList,
  // SectionListData,
  // SectionListRenderItem,
  View,
} from 'react-native';
import { commonStyles, hp, wp } from '@styles';
import { useNav } from '../../helper';
import { RequestState } from '../../zustand/RequestState';
import { PayRequestItemType } from '../../api/payRequests';
import { AuthState } from '../../zustand';
import { onPressSummary } from './ChatListScreen';

export const showInProgress = () => {
  Alert.alert(
    'In Development',
    'This feature is in development, You will be seeing soon in upnext versions',
  );
};

const Tabs: TabItemType[] = [
  { name: 'Pending' },
  { name: 'Paid' },
  { name: "Your's" },
];

// type SectionType = {
//   title: string;
//   data: readonly string[];
// };

export const HomeScreen = () => {
  const {
    themeValues: { colors },
  } = useThemed();
  const { navigate } = useNav();
  const { user } = AuthState();
  const { requests, selfRequests } = RequestState();

  const styles = s();

  const [selectedTab, setSelectedTab] = useState<TabItemType>(Tabs[0]);

  const goToAddNew = () => {
    navigate('AddEditRequestScreen');
  };

  const renderRequests = useCallback(
    (_request: PayRequestItemType) => {
      const isOwn = _request?.created_by?.uid === user?.userProfile?.uid;
      const isPaid =
        !isOwn &&
        !!_request?.paidMembers &&
        _request?.paidMembers?.findIndex(
          (_pm) => _pm.uid === user?.userProfile?.uid,
        ) !== -1;

      return (
        <PayRequestCard
          key={_request?.id}
          data={_request}
          isOwn={isOwn}
          isPaid={isPaid}
        />
      );
    },
    [user?.userProfile],
  );

  const allRequests = useMemo(() => {
    switch (selectedTab.name) {
      case 'Pending':
        return [...requests]?.filter(
          (_pi) =>
            !_pi.paidMembers ||
            _pi.paidMembers?.findIndex(
              (_pm) => _pm.uid === user?.userProfile?.uid,
            ) === -1,
        );

      case 'Paid':
        return [...requests]?.filter(
          (_pi) =>
            _pi.paidMembers &&
            _pi.paidMembers?.findIndex(
              (_pm) => _pm.uid === user?.userProfile?.uid,
            ) !== -1,
        );

      case "Your's":
        return selfRequests;

      default:
        return [...requests, ...selfRequests];
    }
  }, [requests, selfRequests, selectedTab, user?.userProfile]);

  const remainingAmounts = useMemo(() => {
    let totalIncome = 0;
    let totalOut = 0;
    if (user?.userProfile?.uid?.toString()) {
      allRequests?.map((_req) => {
        let totalRemainingForRequest = 0;
        if (_req?.created_by?.uid === user?.userProfile?.uid) {
          if (_req.members) {
            _req.members?.map((_reqMem) => {
              const isPaid =
                _req?.paidMembers &&
                _req?.paidMembers?.findIndex(
                  (_pm) => _pm?.uid === _reqMem?.uid,
                ) !== -1;

              if (!isPaid) {
                const difAmount = _req?.diffAmounts?.[_reqMem?.uid];
                if (difAmount) {
                  totalRemainingForRequest += Number(difAmount ?? 0);
                } else {
                  totalRemainingForRequest += Number(_req?.requestAmount ?? 0);
                }
              }
            });
          }
          totalIncome += Number(totalRemainingForRequest ?? 0);
        } else {
          const isPaid =
            _req?.paidMembers &&
            _req?.paidMembers?.findIndex(
              (_pm) => _pm?.uid === user?.userProfile?.uid,
            ) !== -1;
          const needToPay = user?.userProfile?.uid
            ? _req?.diffAmounts?.[user.userProfile.uid?.toString()] ??
              _req?.requestAmount
            : 0;

          if (!isPaid) {
            totalOut += Number(needToPay ?? 0);
          }
        }
      });
    }
    return { totalIncome, totalOut };
  }, [allRequests, user?.userProfile]);

  return (
    <ScreenWrapper style={[{ margin: 0, backgroundColor: colors.primary }]}>
      <View style={[commonStyles.rowItemsCenter, styles.topContainer]}>
        <TopTabs
          tabs={Tabs}
          selectedTab={selectedTab}
          onPressTab={setSelectedTab}
          style={[commonStyles.flex]}
        />
        <PlusButton
          containerStyle={[{ marginRight: 20 }]}
          onPress={goToAddNew}
        />
      </View>
      <ScreenWrapper>
        {allRequests && allRequests.length > 0 ? (
          <Scroll>{allRequests.map(renderRequests)}</Scroll>
        ) : (
          <View style={[commonStyles.flex, commonStyles.centerCenter]}>
            <NoData />
          </View>
        )}
        {(!!remainingAmounts?.totalIncome || !!remainingAmounts?.totalOut) && (
          <View
            style={[
              commonStyles.rowItemCenterJustifyCenter,
              commonStyles.center,
              {
                marginTop: hp(1),
                gap: wp(3),
                maxWidth: wp(90),
                flexWrap: 'wrap',
              },
            ]}
          >
            <BaseText sizeSmall semibold>
              Pending amounts:
            </BaseText>
            {!!remainingAmounts?.totalIncome && (
              <Chip
                title={`₹ ${remainingAmounts?.totalIncome}`}
                titleProps={{
                  sizeMedium: true,
                  sizeTiny: false,
                }}
                icon='arrow-down'
                iconProps={{
                  iconStyle: {
                    color: colors.success,
                  },
                }}
                onPress={onPressSummary.bind(
                  this,
                  'income',
                  remainingAmounts,
                  false,
                )}
              />
            )}
            {!!remainingAmounts?.totalOut && (
              <Chip
                title={`₹ ${remainingAmounts?.totalOut}`}
                titleProps={{
                  sizeMedium: true,
                  sizeTiny: false,
                }}
                icon='arrow-up'
                iconProps={{
                  iconStyle: {
                    color: colors.error,
                  },
                }}
                onPress={onPressSummary.bind(
                  this,
                  'expense',
                  remainingAmounts,
                  false,
                )}
              />
            )}
          </View>
        )}
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    sectionHeader: {
      paddingHorizontal: 13,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      colors: colors.text,
    },
    topContainer: {
      borderBottomWidth: 1,
      borderColor: colors.inputBackground,
    },
  }));
