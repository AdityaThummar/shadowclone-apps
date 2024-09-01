import React, {
  useCallback,
  useMemo,
  // useCallback,
  useState,
} from 'react';
import {
  BaseText,
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
import { commonStyles } from '@styles';
import { useNav } from '../../helper';
import { RequestState } from '../../zustand/RequestState';
import { PayRequestItemType } from '../../api/payRequests';
import { AuthState } from '../../zustand';

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

  // const renderPayCard: SectionListRenderItem<
  //   string,
  //   { title: string; data: string }
  // > = useCallback(() => {
  //   return (
  //     <PayRequestCard
  //       // data={item}
  //       isOwn={selectedTab.name === Tabs[2].name}
  //       isPaid={selectedTab.name === Tabs[1].name}
  //     />
  //   );
  // }, [selectedTab, styles]);

  // const renderSectionHeader: (props: {
  //   section: SectionListData<string, SectionType>;
  // }) => React.ReactElement = useCallback(
  //   (props: { section: SectionListData<string, SectionType> }) => {
  //     return (
  //       <BaseText bold sizeMedium style={[styles.sectionHeader]}>
  //         {props.section.title}
  //       </BaseText>
  //     );
  //   },
  //   [styles],
  // );

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

      return <PayRequestCard data={_request} isOwn={isOwn} isPaid={isPaid} />;
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
        {/* <Card>
          <BaseText semibold center>
            {`All these are just a skeleton components that we will develop in upmost version, For now just know and enjoy this demo app we allow you to access.Thank you for using this App 🙂`}
          </BaseText>
        </Card> */}
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
          // stickyHeaderIndices={[0]}
        >
          <Header title='Home' disableBack />
          <PayRequestCard />
          <PayRequestCard />
          <PayRequestCard />
          <PayRequestCard />
        </ScrollView> */}

        {allRequests && allRequests.length > 0 ? (
          <Scroll>{allRequests.map(renderRequests)}</Scroll>
        ) : (
          <View style={[commonStyles.flex, commonStyles.centerCenter]}>
            <NoData />
          </View>
        )}

        {/* <Input style={{ marginTop: 10 }} /> */}
        {/* <SectionList
          sections={[
            {
              title: 'Today',
              data: ['1'],
            },
            {
              title: 'Yesterday',
              data: ['1'],
            },
            {
              title: 'Thu 01 Aug 2024',
              data: ['1', '2'],
            },
            {
              title: 'Wed 31 Jul 2024',
              data: ['1', '2', '3'],
            },
          ]}
          renderItem={renderPayCard}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          contentContainerStyle={{
            paddingBottom: 15,
          }}
        /> */}
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
