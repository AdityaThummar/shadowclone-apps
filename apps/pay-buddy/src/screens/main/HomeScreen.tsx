import React, { useCallback, useState } from 'react';
import {
  BaseText,
  IconButton,
  PayRequestCard,
  ScreenWrapper,
  TabItemType,
  themedStyles,
  TopTabs,
  useThemed,
} from '@components';
import {
  SectionList,
  SectionListData,
  SectionListRenderItem,
  View,
} from 'react-native';
import { commonStyles } from '@styles';

const Tabs: TabItemType[] = [
  { name: 'Pending' },
  { name: 'Paid' },
  { name: "Your's" },
];

type SectionType = {
  title: string;
  data: readonly string[];
};

export const HomeScreen = () => {
  const {
    themeValues: { colors },
  } = useThemed();

  const styles = s();

  const [selectedTab, setSelectedTab] = useState<TabItemType>(Tabs[0]);

  const renderPayCard: SectionListRenderItem<
    string,
    { title: string; data: string }
  > = useCallback(() => {
    return (
      <PayRequestCard
        // data={item}
        isOwn={selectedTab.name === Tabs[2].name}
        isPaid={selectedTab.name === Tabs[1].name}
      />
    );
  }, [selectedTab, styles]);

  const renderSectionHeader: (props: {
    section: SectionListData<string, SectionType>;
  }) => React.ReactElement = useCallback(
    (props: { section: SectionListData<string, SectionType> }) => {
      return (
        <BaseText bold sizeMedium style={[styles.sectionHeader]}>
          {props.section.title}
        </BaseText>
      );
    },
    [styles],
  );

  return (
    <ScreenWrapper style={[{ margin: 0, backgroundColor: 'white' }]}>
      <View style={[commonStyles.rowItemsCenter, styles.topContainer]}>
        <TopTabs
          tabs={Tabs}
          selectedTab={selectedTab}
          onPressTab={setSelectedTab}
          style={[commonStyles.flex]}
        />
        <IconButton
          name='plus'
          iFamily='Entypo'
          containerStyle={[{ marginRight: 20 }]}
          color={colors.tint}
        />
      </View>
      <ScreenWrapper style={{ marginTop: 0 }}>
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

        {/* <Input style={{ marginTop: 10 }} /> */}
        <SectionList
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
        />
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
