import React, { useCallback, useMemo, useState } from 'react';
import {
  BaseIcon,
  BaseText,
  Card,
  Header,
  IconButton,
  Input,
  NotificationCount,
  PrimaryButton,
  ScreenWrapper,
  themedStyles,
  UserCardHalf,
} from '@components';
import { FlatList, View } from 'react-native';
import {
  blockUser,
  rejectRequest,
  removeFriend,
  sendFriendRequest,
  unBlockUser,
} from '../../api/users';
import { UserProfileType } from '../../api/types';
import { KeyboardListner } from '../../components';
import { commonStyles, hp, wp } from '@styles';
import { useNav } from '../../helper';
import { AuthState, UsersState } from '../../zustand';
import { SelectionState } from '../../zustand/SelectionState';
import { PayRequestItemType } from '../../api/payRequests';

export type SearchScreenListTypes =
  | 'member'
  | 'sent_req'
  | 'blocked_users'
  | 'friends'
  | 'select_new_member'
  | 'select_groups'
  | 'select_req_members';

export type SearchScreenProps = {
  type?: SearchScreenListTypes;
  payRequestItem?: PayRequestItemType;
};

export const SearchScreen = (props: SearchScreenProps) => {
  console.log('🚀 ~ SearchScreen ~ props:', props);
  const { type = 'member', payRequestItem } = props;
  const { navigate, goBack } = useNav();
  const { user } = AuthState();
  const { sentRequest, newUsers, blockedUsers, friends, userGroupsDetails } =
    UsersState();
  const { selectedGroups, selectedMemebersForNew, setSelectedMemebersForNew } =
    SelectionState();

  const styles = s();

  const [searchText, setSearchText] = useState<string>('');
  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  const onPressAdd = useCallback(
    async (user?: UserProfileType) => {
      const friendId = user?.uid ?? '__';
      setLoadingItems((pre) => [...pre, friendId]);
      const response = await sendFriendRequest(friendId);
      if (response.success) {
        setLoadingItems((pre) => pre.filter((_item) => _item != friendId));
      }
    },
    [sendFriendRequest],
  );

  const onPressRemoveFriend = useCallback(async (user?: UserProfileType) => {
    const friendId = user?.uid ?? '__';
    setLoadingItems((pre) => [...pre, friendId]);
    const response = await removeFriend(friendId);
    if (response.success) {
      setLoadingItems((pre) => pre.filter((_item) => _item != friendId));
    }
  }, []);

  const blockedUser = useCallback(async (user?: UserProfileType) => {
    const friendId = user?.uid ?? '__';
    setLoadingItems((pre) => [...pre, friendId]);
    const response = await blockUser(friendId);
    if (response.success) {
      setLoadingItems((pre) => pre.filter((_item) => _item != friendId));
    }
  }, []);

  const unBlockedUser = useCallback(async (user?: UserProfileType) => {
    const friendId = user?.uid ?? '__';
    setLoadingItems((pre) => [...pre, friendId]);
    const response = await unBlockUser(friendId);
    if (response.success) {
      setLoadingItems((pre) => pre.filter((_item) => _item != friendId));
    }
  }, []);

  const cancelRequest = useCallback(async (user?: UserProfileType) => {
    const friendId = user?.uid ?? '__';
    setLoadingItems((pre) => [...pre, friendId]);
    const response = await rejectRequest(friendId, true);
    if (response.success) {
      setLoadingItems((pre) => pre.filter((_item) => _item != friendId));
    }
  }, []);

  const getListActions = useCallback(() => {
    switch (type) {
      case 'friends':
        return [
          {
            title: 'Remove',
            onPress: onPressRemoveFriend,
          },
        ];

      case 'sent_req':
        return [
          {
            title: 'Cancel Request',
            onPress: cancelRequest,
          },
        ];

      case 'blocked_users':
        return [
          {
            title: 'Unblock',
            onPress: unBlockedUser,
          },
        ];

      case 'member':
        return [
          { title: 'Add', onPress: onPressAdd },
          {
            title: 'Block',
            onPress: blockedUser,
          },
        ];

      default:
        return [];
    }
  }, [type]);

  const onPressOtherUser = (type: SearchScreenListTypes) => {
    navigate('SelectItemScreen', {
      type,
    });
  };

  const hideBack = useMemo(() => type === 'member', [type]);
  const hideSearch = useMemo(() => !['member'].includes(type), [type]);

  const searchedArray: UserProfileType[] = useMemo(() => {
    const stext = searchText?.toLowerCase();
    const arr = newUsers?.filter((_item) =>
      _item?.name?.toLowerCase()?.includes(stext),
    );

    if (searchText) {
      return arr;
    }

    const reqMembers: UserProfileType[] = [];
    const allGroupsMember: UserProfileType[] = [];

    userGroupsDetails
      ?.map((_gp) => {
        const isIn = selectedGroups?.findIndex((_i) => _i.id === _gp.id) !== -1;
        if (isIn) {
          allGroupsMember.push(..._gp.member);
        }
      })
      .flat(1);

    [...(friends ?? []), ...(allGroupsMember ?? [])]?.forEach((_member) => {
      const isIn = reqMembers?.findIndex((_i) => _i.uid === _member.uid) !== -1;
      const isPaid =
        payRequestItem?.paidMembers &&
        payRequestItem?.paidMembers.findIndex(
          (_pm) => _pm?.uid === _member?.uid,
        ) !== -1;
      if (!isIn && _member.uid != user?.userProfile?.uid && !isPaid) {
        reqMembers.push(_member);
      }
    });

    switch (type) {
      case 'member':
        return newUsers ?? [];
      case 'blocked_users':
        return blockedUsers ?? [];
      case 'friends':
        return friends ?? [];
      case 'sent_req':
        return sentRequest ?? [];
      case 'select_new_member':
        return friends ?? [];
      case 'select_req_members':
        return [...reqMembers];

      default:
        return [];
    }
  }, [
    searchText,
    newUsers,
    sentRequest,
    blockedUsers,
    type,
    userGroupsDetails,
    payRequestItem,
  ]);

  const dynamicTitle = useMemo(() => {
    switch (type) {
      case 'friends':
        return 'Your Friends';
      case 'blocked_users':
        return 'Blocked users';
      case 'select_groups':
        return 'Select Groups';
      case 'member':
        return 'Find People';
      case 'sent_req':
        return `Sent requests`;

      default:
        return 'Select Members';
    }
  }, [type, sentRequest]);

  const isSelect = useMemo(
    () => ['select_new_member', 'select_req_members'].includes(type),
    [type],
  );

  const renderUsers = useCallback(
    (item: { item: UserProfileType; index: number }) => {
      const selected =
        selectedMemebersForNew.findIndex((_) => _.uid === item.item.uid) != -1;
      const onSelect = () => {
        setSelectedMemebersForNew(
          selected
            ? selectedMemebersForNew.filter((_) => _.uid != item.item.uid)
            : [...selectedMemebersForNew, item.item],
        );
      };

      return (
        <UserCardHalf
          item={item.item}
          actions={getListActions()}
          isSelection={isSelect}
          isLoading={loadingItems?.includes(item?.item?.uid)}
          {...{ onSelect, selected }}
        />
      );
    },
    [
      isSelect,
      loadingItems,
      type,
      selectedMemebersForNew,
      searchedArray,
      getListActions,
    ],
  );

  return (
    <ScreenWrapper>
      <KeyboardListner />
      <Header
        title={`${dynamicTitle}${
          searchedArray.length > 0 && !hideBack
            ? ` (${
                ['select_new_member', 'select_req_member'].includes(type)
                  ? selectedMemebersForNew.length - 1
                  : searchedArray.length
              })`
            : ``
        }`}
        disableBack={hideBack}
        rightComponent={
          !hideSearch && (
            <View
              style={[
                commonStyles.rowItemsCenter,
                {
                  gap: wp(3),
                },
              ]}
            >
              <View>
                <IconButton
                  name='do-disturb'
                  iFamily='MaterialIcons'
                  iconStyle={[styles.iconStyle]}
                  onPress={onPressOtherUser.bind(this, 'blocked_users')}
                  size={27}
                />
                <NotificationCount count={blockedUsers.length} />
              </View>
              <View>
                <IconButton
                  name='paper-plane'
                  iconStyle={[styles.iconStyle]}
                  onPress={onPressOtherUser.bind(this, 'sent_req')}
                  size={27}
                />
                <NotificationCount count={sentRequest.length} />
              </View>
              <Card
                style={[commonStyles.rowItemsCenter, styles.friendsContainer]}
                onPress={onPressOtherUser.bind(this, 'friends')}
              >
                <BaseIcon
                  name='person'
                  iconStyle={[styles.iconStyle]}
                  size={20}
                />
                <BaseText sizeSmall bold style={{ marginRight: wp(1) }}>
                  {friends.length}
                </BaseText>
              </Card>
            </View>
          )
        }
      />
      {!hideSearch && (
        <Input
          containerStyle={{ marginBottom: 10 }}
          placeholder='Search here ..'
          value={searchText}
          onChangeText={setSearchText}
        />
      )}
      {searchText && (
        <BaseText
          semibold
          style={{
            marginBottom: hp(1),
            marginHorizontal: wp(4),
          }}
        >{`${searchedArray?.length} search found for "${searchText}"`}</BaseText>
      )}

      {searchedArray.length === 0 ? (
        <View style={[commonStyles.flex, commonStyles.centerCenter]}>
          <BaseText center semibold sizeMedium>
            No Data
          </BaseText>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={searchedArray}
            showsVerticalScrollIndicator={false}
            renderItem={renderUsers}
            numColumns={2}
            contentContainerStyle={{
              paddingBottom: 15,
            }}
          />
          {isSelect && <PrimaryButton title='Done' onPress={goBack} />}
        </View>
      )}
    </ScreenWrapper>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    iconStyle: {
      color: colors.secondary,
    },
    friendsContainer: {
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      padding: wp(1),
      gap: wp(1),
      margin: 0,
      marginLeft: wp(1),
      paddingHorizontal: wp(2.5),
    },
  }));
