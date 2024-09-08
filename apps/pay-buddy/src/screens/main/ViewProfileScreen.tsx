import {
  Avatar,
  BaseText,
  Card,
  Header,
  PrimaryButton,
  ScreenWrapper,
  Scroll,
  themedStyles,
  UserCardHalf,
} from '@components';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RootRouteProps, useNav } from '../../helper';
import { hp } from '@styles';
import { AuthState, UsersState } from '../../zustand';
import { acceptFriend, removeRequest } from './NotificationsScreen';
import { LoadingState } from '@zustand';
import {
  blockUser,
  rejectRequest,
  removeFriend,
  sendFriendRequest,
  unBlockUser,
} from '../../api/users';
import {
  GroupDetailsType,
  GroupMemberType,
  ResponseType,
  UserProfileType,
} from '../../api/types';
import { Alert, View } from 'react-native';
import { deleteGroup, getGroupDetails, leaveGroup } from '../../api/groups';

type ProfileActionTypes =
  | 'add-friend'
  | 'cancel-request'
  | 'accept-request'
  | 'remove-request'
  | 'remove-friend'
  | 'block'
  | 'unblock'
  | 'edit-profile';

export const ViewProfileScreen = () => {
  const { user } = AuthState();
  const {
    blockedUsers,
    friends,
    newUsers,
    receivedRequests,
    sentRequest,
    userGroupsDetails,
  } = UsersState();
  const { setLoader, isLoading } = LoadingState();

  const { push, navigate, goBack } = useNav();
  const { params } = useRoute<RootRouteProps<'ViewProfileScreen'>>();
  const { group } = params;

  const [groupDetails, setGroupDetails] = useState<GroupDetailsType>();

  const styles = s();

  useEffect(() => {
    (async () => {
      if (userGroupsDetails?.length > 0 && !isLoading) {
        const foundGroup = userGroupsDetails?.find(
          (_) => _.id === params?.groupDetails?.id,
        );
        if (foundGroup && Object.keys(foundGroup).length > 0) {
          setGroupDetails(foundGroup);
        } else {
          if (params?.groupDetails?.id) {
            setLoader('Getting group');
            const groupDetails = await getGroupDetails([
              params?.groupDetails?.id,
            ]);
            setLoader('');
            if (groupDetails?.error || !groupDetails?.data?.groups?.[0]?.id) {
              Alert.alert(
                'Oops',
                'Either this group is deleted or something went wrong when try to get group details.',
              );
              goBack();
            } else {
              setGroupDetails(groupDetails?.data?.groups?.[0]);
            }
          }
        }
      } else if (params?.groupDetails) {
        setGroupDetails(params?.groupDetails);
      }
    })();
  }, [params?.groupDetails, userGroupsDetails, isLoading]);

  const isGroupExistLocally = useMemo(() => {
    return (
      !!groupDetails?.id &&
      userGroupsDetails?.findIndex((_ugp) => _ugp.id === groupDetails?.id) !==
        -1
    );
  }, [userGroupsDetails, groupDetails]);

  const profileDetails = useMemo(() => {
    return (
      [
        ...(blockedUsers ?? []),
        ...(friends ?? []),
        ...(newUsers ?? []),
        ...(receivedRequests ?? []),
        ...(sentRequest ?? []),
        ...(user?.userProfile?.uid ? [user.userProfile] : []),
      ]?.find((_: UserProfileType) => _.uid === params?.profileDetails?.uid) ??
      params?.profileDetails
    );
  }, [
    blockedUsers,
    friends,
    newUsers,
    receivedRequests,
    sentRequest,
    params?.profileDetails,
    user,
  ]);

  const isAdmin = groupDetails?.member?.find(
    (_item) => _item.uid === user?.userProfile?.uid,
  )?.admin;

  const isFriend = useMemo(
    () =>
      !group &&
      friends.findIndex((_item) => _item.uid === profileDetails?.uid) !== -1,
    [friends, group, profileDetails],
  );
  const isUnknown = useMemo(
    () =>
      !group &&
      newUsers.findIndex((_item) => _item.uid === profileDetails?.uid) !== -1,
    [newUsers, group, profileDetails],
  );
  const isBlocked = useMemo(
    () =>
      !group &&
      blockedUsers.findIndex((_item) => _item.uid === profileDetails?.uid) !==
        -1,
    [blockedUsers, group, profileDetails],
  );
  const isRequested = useMemo(
    () =>
      !group &&
      sentRequest.findIndex((_item) => _item.uid === profileDetails?.uid) !==
        -1,
    [sentRequest, group, profileDetails],
  );
  const isRequesting = useMemo(
    () =>
      !group &&
      receivedRequests.findIndex(
        (_item) => _item.uid === profileDetails?.uid,
      ) !== -1,
    [receivedRequests, group, profileDetails],
  );

  const onPressProfileActions = useCallback(
    async (type: ProfileActionTypes) => {
      if (!profileDetails?.uid) {
        return;
      }
      await new Promise<ResponseType>((res, rej) => {
        try {
          switch (type) {
            case 'add-friend':
              setLoader('Sending Request');
              sendFriendRequest(profileDetails?.uid).then(res);
              break;
            case 'remove-friend':
              setLoader('Removing friend');
              removeFriend(profileDetails?.uid).then(res);
              break;
            case 'accept-request':
              setLoader('Adding Friend');
              acceptFriend(profileDetails?.uid).then(res);
              break;
            case 'remove-request':
              setLoader('Removing request');
              removeRequest(profileDetails?.uid).then(res);
              break;
            case 'cancel-request':
              setLoader('Removing request');
              rejectRequest(profileDetails?.uid, true).then(res);
              break;
            case 'block':
              setLoader('Blocking user');
              blockUser(profileDetails?.uid).then(res);
              break;
            case 'unblock':
              setLoader('Unblocking user');
              unBlockUser(profileDetails?.uid).then(res);
              break;

            case 'edit-profile':
              push('EditProfileScreen', {
                type: 'edit-profile',
                userData: user?.userProfile,
              });
              break;

            default:
              break;
          }
        } catch (error) {
          console.log('🚀 ~ newPromise ~ error:', error);
          rej(error);
        }
      });
      setLoader();
    },
    [!profileDetails?.uid],
  );

  const goToEditGroup = useCallback(() => {
    if (!groupDetails) {
      return;
    }
    push('AddEditGroupScreen', {
      data: groupDetails,
    });
  }, [groupDetails]);

  const leave = useCallback(async () => {
    setLoader('Leaving group');
    const response = await leaveGroup(groupDetails?.id);
    setLoader();
    if (response?.success) {
      navigate('BottomTab', {
        screen: 'Groups',
      });
    }
  }, [groupDetails]);

  const onPressDeleteGroup = useCallback(() => {
    const delGroup = async () => {
      if (groupDetails?.id) {
        setLoader('Deleting group');
        await deleteGroup(groupDetails);
        setLoader('');
        navigate('BottomTab', {
          screen: 'Groups',
        });
      }
    };

    Alert.alert(
      `Are you sure ?`,
      `You want to delete this group${
        groupDetails?.name ? ':\n' + groupDetails?.name : ''
      }`,
      [
        {
          text: 'Yes, Delete now',
          onPress: delGroup,
        },
        {
          text: 'Cancel',
        },
      ],
    );
  }, [groupDetails]);

  const groupMembers = useMemo(() => {
    const members: GroupMemberType[] = [];
    const admins: GroupMemberType[] = [];
    if (groupDetails?.member) {
      groupDetails?.member?.map((_item) => {
        if (_item?.admin) {
          admins.push(_item);
        } else if (_item.uid !== user?.userProfile?.uid) {
          members.push(_item);
        }
      });
    }
    const finalArray = [...admins, ...members];
    const isNotIn =
      finalArray?.findIndex(
        (_item) => _item?.uid === user?.userProfile?.uid,
      ) === -1;
    if (isNotIn && user?.userProfile) {
      finalArray.push(user?.userProfile);
    }
    return finalArray;
  }, [groupDetails, user?.userProfile]);

  const renderGroupMemebers = useCallback((_item: GroupMemberType) => {
    return (
      <UserCardHalf
        item={_item}
        bottomLabel={_item?.admin ? 'Admin' : ''}
        bottomLabelIcon='ribbon'
        key={_item.uid}
      />
    );
  }, []);

  const profileToDisplay = useMemo(
    () => (group ? groupDetails : profileDetails),
    [group, groupDetails, profileDetails],
  );

  return (
    <ScreenWrapper>
      <Header title={`${group ? 'Group' : 'Profile'} details`} />
      <Scroll>
        {!isLoading && (
          <Card
            style={{
              gap: hp(1.5),
              paddingVertical: hp(2),
              marginBottom: hp(2),
            }}
          >
            <Avatar uri={profileToDisplay?.image} size='big' />
            <BaseText center sizeHugeHeading bold>
              {profileToDisplay?.name}
            </BaseText>
            {profileToDisplay?.bio && (
              <BaseText center sizeBig medium>
                {profileToDisplay.bio}
              </BaseText>
            )}
          </Card>
        )}
        {profileDetails?.uid && !isLoading && (
          <>
            {isRequesting && !isBlocked && (
              <>
                <PrimaryButton
                  title='Accept Request'
                  onPress={onPressProfileActions.bind(this, 'accept-request')}
                />
                <PrimaryButton
                  title='Remove'
                  onPress={onPressProfileActions.bind(this, 'remove-request')}
                />
              </>
            )}
            {isRequested && !isBlocked && (
              <PrimaryButton
                title='Cancel Request'
                onPress={onPressProfileActions.bind(this, 'cancel-request')}
              />
            )}
            {isUnknown && !isBlocked && (
              <PrimaryButton
                title='Add'
                onPress={onPressProfileActions.bind(this, 'add-friend')}
              />
            )}
            {isFriend && !isBlocked && (
              <PrimaryButton
                title='Remove Friend'
                onPress={onPressProfileActions.bind(this, 'remove-friend')}
              />
            )}
            {(isFriend || isUnknown) && !isBlocked && (
              <PrimaryButton
                title='Block'
                onPress={onPressProfileActions.bind(this, 'block')}
              />
            )}
            {isBlocked && (
              <PrimaryButton
                title='Unblock'
                onPress={onPressProfileActions.bind(this, 'unblock')}
              />
            )}
            {profileDetails?.uid === user?.userProfile?.uid && (
              <PrimaryButton
                title='Edit profile'
                onPress={onPressProfileActions.bind(this, 'edit-profile')}
              />
            )}
          </>
        )}
        {group && !!groupDetails?.id && !isLoading && (
          <>
            <View style={{ flex: 1, marginBottom: hp(1) }}>
              <Header
                title={`Members (${groupDetails?.member?.length})`}
                sizeBig
                disableBack
                containerStyle={{
                  marginTop: hp(0.5),
                }}
              />
              <Scroll horizontal>
                {groupMembers?.map(renderGroupMemebers)}
              </Scroll>
            </View>
            {isGroupExistLocally && (
              <PrimaryButton title='Leave' onPress={leave} />
            )}
            {isAdmin && (
              <>
                <PrimaryButton title='Edit Group' onPress={goToEditGroup} />
                <PrimaryButton
                  title='Delete Group'
                  style={styles.deleteContainer}
                  onPress={onPressDeleteGroup}
                />
              </>
            )}
          </>
        )}
      </Scroll>
    </ScreenWrapper>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    deleteContainer: {
      backgroundColor: colors.error,
    },
  }));
