import React, { useCallback, useMemo } from 'react';
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
  View,
} from 'react-native';
import { commonStyles } from '@styles';
import { addFriend, rejectRequest } from '../../api/users';
import { UserProfileType } from '../../api/types';
import { UsersState } from '../../zustand';

type SectionType = {
  title: string;
  data: unknown[];
};

export const NotificationsScreen = () => {
  const { receivedRequests } = UsersState();

  const styles = s();

  const removeRequest = async (friendId: string) => {
    await rejectRequest(friendId, false);
  };
  const acceptFriend = async (friendId: string) => {
    await addFriend(friendId);
  };

  const renderUsers = useCallback(({ item }: { item: UserProfileType }) => {
    return (
      <UserCardHalf
        actions={[
          { title: 'Add', onPress: acceptFriend.bind(this, item?.uid) },
          { title: 'Remove', onPress: removeRequest.bind(this, item?.uid) },
        ]}
        item={item}
      />
    );
  }, []);

  const renderPayCard: SectionListRenderItem<
    string,
    { title: string; data: UserProfileType[] }
  > = useCallback(({ section }) => {
    if (section.title?.includes('Friend Requests')) {
      return (
        <FlatList
          data={section.data}
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

  const data = useMemo(
    () => [
      ...(receivedRequests.length > 0
        ? [
            {
              title: `Friend Requests (${receivedRequests.length})`,
              data: receivedRequests,
            },
          ]
        : []),
    ],
    [receivedRequests],
  );

  return (
    <ScreenWrapper>
      <Header title='Notifications' disableBack />
      {data?.length === 0 ? (
        <View style={[commonStyles.centerCenter, commonStyles.flex]}>
          <BaseText regular sizeRegular center>
            No Data
          </BaseText>
        </View>
      ) : (
        <SectionList
          // sections={[
          //   {
          //     title: 'Friend Requests (6)',
          //     data: [[1, 2, 3]],
          //   },
          //   {
          //     title: 'Today',
          //     data: [1],
          //   },
          //   {
          //     title: 'Yesterday',
          //     data: [1],
          //   },
          //   {
          //     title: 'Thu 01 Aug 2024',
          //     data: [1, 2],
          //   },
          //   {
          //     title: 'Wed 31 Jul 2024',
          //     data: [1, 2, 3],
          //   },
          // ]}
          sections={data}
          renderItem={renderPayCard}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          contentContainerStyle={{
            paddingBottom: 15,
          }}
        />
      )}
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
