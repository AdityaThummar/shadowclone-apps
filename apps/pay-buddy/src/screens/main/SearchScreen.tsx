import React, { useCallback, useMemo, useState } from 'react';
import {
  BaseIcon,
  BaseText,
  Card,
  Header,
  IconButton,
  Input,
  ScreenWrapper,
  themedStyles,
  UserCardActionType,
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
import { UsersState } from '../../zustand';

export type SearchScreenListTypes =
  | 'group'
  | 'member'
  | 'sent_req'
  | 'blocked_users'
  | 'friends';

export type SearchScreenProps = {
  isSelect?: boolean;
  isSentReq?: boolean;
  isBlockedUsers?: boolean;
  isFriends?: boolean;
};

export const SearchScreen = (props: SearchScreenProps) => {
  const {
    isSelect = false,
    isSentReq = false,
    isBlockedUsers = false,
    isFriends = false,
  } = props;
  const { navigate } = useNav();
  const { sentRequest, newUsers, blockedUsers, friends } = UsersState();

  const [searchText, setSearchText] = useState<string>('');
  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  const styles = s();

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

  const renderUsers = useCallback(
    (item: { item: UserProfileType; index: number }) => {
      const Actions: UserCardActionType[] = isFriends
        ? [
            {
              title: 'Remove',
              onPress: onPressRemoveFriend.bind(this, item.item),
            },
          ]
        : isSentReq
        ? [
            {
              title: 'Cancel Request',
              onPress: cancelRequest.bind(this, item.item),
            },
          ]
        : isBlockedUsers
        ? [
            {
              title: 'Unblock',
              onPress: unBlockedUser.bind(this, item.item),
            },
          ]
        : [
            { title: 'Add', onPress: onPressAdd.bind(this, item.item) },
            {
              title: 'Block',
              onPress: blockedUser.bind(this, item.item),
            },
          ];

      return (
        <UserCardHalf
          item={item.item}
          actions={Actions}
          isSelection={isSelect}
          isLoading={loadingItems?.includes(item?.item?.uid)}
        />
      );
    },
    [isSelect, loadingItems],
  );

  const searchedArray: UserProfileType[] = useMemo(() => {
    const stext = searchText?.toLowerCase();
    const arr = newUsers?.filter((_item) =>
      _item?.name?.toLowerCase()?.includes(stext),
    );
    return searchText
      ? arr
      : isSentReq
      ? sentRequest
      : isFriends
      ? friends
      : isBlockedUsers
      ? blockedUsers
      : newUsers;
  }, [
    searchText,
    newUsers,
    isSentReq,
    sentRequest,
    isBlockedUsers,
    blockedUsers,
    isFriends,
  ]);

  const onPressOtherUser = (type: SearchScreenListTypes) => {
    navigate('SelectItemScreen', {
      type,
    });
  };

  const hideBack = useMemo(
    () => !isSelect && !isSentReq && !isBlockedUsers && !isFriends,
    [isSelect, isSentReq, isBlockedUsers, isFriends],
  );
  const hideSearch = useMemo(
    () => isSentReq || isBlockedUsers || isFriends,
    [isSentReq, isBlockedUsers, isFriends],
  );

  return (
    <ScreenWrapper>
      <KeyboardListner />
      <Header
        title={
          isSelect
            ? 'Select Members'
            : isSentReq
            ? 'Sent requests'
            : isFriends
            ? 'Your Friends'
            : isBlockedUsers
            ? 'Blocked users'
            : 'Find People'
        }
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
              <IconButton
                name='do-disturb'
                iFamily='MaterialIcons'
                iconStyle={[styles.iconStyle]}
                onPress={onPressOtherUser.bind(this, 'blocked_users')}
                size={30}
              />
              <IconButton
                name='paper-plane'
                iconStyle={[styles.iconStyle]}
                onPress={onPressOtherUser.bind(this, 'sent_req')}
              />
              <Card
                style={[commonStyles.rowItemsCenter, styles.friendsContainer]}
                onPress={onPressOtherUser.bind(this, 'friends')}
              >
                <BaseIcon
                  name='person'
                  iconStyle={[styles.iconStyle]}
                  size={20}
                />
                <BaseText sizeTiny semibold>
                  Friends
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
        <FlatList
          data={searchedArray}
          showsVerticalScrollIndicator={false}
          renderItem={renderUsers}
          numColumns={2}
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
    iconStyle: {
      color: colors.secondary,
    },
    friendsContainer: {
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      padding: wp(1.5),
      gap: wp(1),
      margin: 0,
    },
  }));
