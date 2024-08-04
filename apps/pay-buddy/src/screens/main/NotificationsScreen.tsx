import React, { useCallback } from 'react';
import {
  BaseText,
  Header,
  NotificationCard,
  ScreenWrapper,
  themedStyles,
  UserCardHalf,
} from '@components';
import {
  FlatList,
  SectionList,
  SectionListData,
  SectionListRenderItem,
} from 'react-native';

type SectionType = {
  title: string;
  data: unknown[];
};

export const NotificationsScreen = () => {
  const styles = s();

  // const NotificationData = [];

  const renderUsers = useCallback(() => {
    return <UserCardHalf isRequest />;
  }, []);

  const renderPayCard: SectionListRenderItem<
    string,
    { title: string; data: { sample: string } }
  > = useCallback(({ section }) => {
    console.log('🚀 ~ >=useCallback ~ section:', section);
    if (section.title?.includes('Friend Requests')) {
      return (
        <FlatList
          data={section.data?.[0]}
          horizontal
          renderItem={renderUsers}
          showsHorizontalScrollIndicator={false}
        />
      );
    }
    return <NotificationCard />;
  }, []);

  const renderSectionHeader = useCallback(
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
    <ScreenWrapper>
      <Header title='Notifications' disableBack />
      <SectionList
        sections={[
          {
            title: 'Friend Requests (6)',
            data: [[1, 2, 3]],
          },
          {
            title: 'Today',
            data: [1],
          },
          {
            title: 'Yesterday',
            data: [1],
          },
          {
            title: 'Thu 01 Aug 2024',
            data: [1, 2],
          },
          {
            title: 'Wed 31 Jul 2024',
            data: [1, 2, 3],
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
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    sectionHeader: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      colors: colors.text,
    },
  }));
