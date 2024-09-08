import { useCallback, useEffect } from 'react';
import { AuthState, UsersState } from '../zustand';
import {
  getAllUsers,
  getUsersForFriend,
  listnerPath,
  requestUsersSetter,
} from './users';
import { getGroupDetails, groupListnerPaths } from './groups';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { GroupDetailsType, UserGroups, UserProfileType } from './types';
import {
  PayRequestItemAPIPaylod,
  PayRequestItemType,
  payRequestListnerPath,
  selfPayRequestListnerPath,
} from './payRequests';
import { RequestState } from '../zustand/RequestState';

export const FirebaseListner = () => {
  const { user } = AuthState();
  const {
    blockedUsers,
    friends,
    newUsers,
    receivedRequests,
    sentRequest,
    userGroupsDetails,
  } = UsersState();
  const {
    setReceivedRequests,
    setSentRequests,
    setNewUsers,
    setBlockedUsers,
    setFriends,
    userGroups,
    setUserGroups,
    setUserGroupsDetails,
  } = UsersState();
  const { setRequests, setSelfRequests } = RequestState();

  const userId = user?.userProfile?.uid;

  const getNewUsers = async () => {
    const response = await getUsersForFriend();
    if (response?.success && response?.data?.users) {
      setNewUsers(response?.data?.users);
    }
  };

  const getAndSetSentRequests = async (skipNewUserCalls = false) => {
    await requestUsersSetter('sent_req', setSentRequests);
    if (!skipNewUserCalls) {
      await getNewUsers();
    }
  };
  const getAndSetReceivedRequests = async (skipNewUserCalls = false) => {
    await requestUsersSetter('received_req', setReceivedRequests);
    if (!skipNewUserCalls) {
      await getNewUsers();
    }
  };
  const getAndSetBlockUsers = async (skipNewUserCalls = false) => {
    await requestUsersSetter('blocked_users', setBlockedUsers);
    if (!skipNewUserCalls) {
      await getNewUsers();
    }
  };
  const getAndSetFriends = async (skipNewUserCalls = false) => {
    await requestUsersSetter('friends', setFriends);
    if (!skipNewUserCalls) {
      await getNewUsers();
    }
  };

  const getNewGroups = useCallback(async () => {
    const response = await getGroupDetails();
    if (response?.success && response?.data?.groups) {
      setUserGroupsDetails(response?.data?.groups);
    }
  }, [userGroups, user]);

  const setNewGroups = useCallback(
    (
      snap: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
    ) => {
      const totalGroups: UserGroups[] = [];

      snap?.docChanges()?.map((_scgp) => {
        const _data = _scgp?.doc?.data();
        totalGroups?.push({
          id: _data?.id,
          date: _data?.date,
        });
      });

      snap.docs.map((_gp) => {
        const _gpData = _gp?.data();
        return {
          id: _gpData?.id,
          date: _gpData?.date,
        };
      });

      const uniqueGroups: UserGroups[] = [];

      totalGroups?.map((_gp) => {
        const isIn =
          uniqueGroups?.findIndex((_tgp) => _tgp?.id === _gp?.id) !== -1;
        if (!!_gp?.id && !isIn) {
          uniqueGroups.push(_gp);
        }
      });

      setUserGroups(uniqueGroups);
    },
    [],
  );

  const getNewPayRequests = useCallback(
    async (
      self = false,
      snap: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
    ) => {
      const allRequestsRow: PayRequestItemAPIPaylod[] = snap.docs.map(
        (_p) => _p.data() as PayRequestItemAPIPaylod,
      );
      const allMembersRow: string[] = allRequestsRow
        .map((_pi) => [..._pi.members, _pi.created_by])
        .flat(1);
      const allGroupsRow: string[] = allRequestsRow
        .map((_pi) => _pi.groups)
        .flat(1);

      const uniqueMembers: string[] = [];
      const uniqueGroups: string[] = [];

      allMembersRow.map((_am) => {
        const isIncluded =
          uniqueMembers?.findIndex((_um) => _um === _am) !== -1;
        if (!isIncluded) {
          uniqueMembers.push(_am);
        }
      });

      allGroupsRow.map((_am) => {
        const isIncluded = uniqueGroups?.findIndex((_um) => _um === _am) !== -1;
        if (!isIncluded) {
          uniqueGroups.push(_am);
        }
      });

      const userprofiles: UserProfileType[] = [];
      const groupDetails: GroupDetailsType[] = [];

      const unListedProfiles: string[] = [];
      const unListedGroups: string[] = [];

      const totalKnownUsers = [
        ...blockedUsers,
        ...friends,
        ...newUsers,
        ...receivedRequests,
        ...sentRequest,
      ];
      if (user?.userProfile) {
        totalKnownUsers.push(user?.userProfile);
      }

      uniqueMembers?.map((_um) => {
        const isKnownItem = totalKnownUsers?.find((_tku) => _tku.uid === _um);
        if (isKnownItem && Object.keys(isKnownItem).length !== 0) {
          userprofiles?.push(isKnownItem);
        } else {
          unListedProfiles.push(_um);
        }
      });

      uniqueGroups?.map((_um) => {
        const isKnownItem = userGroupsDetails?.find((_tku) => _tku.id === _um);
        if (isKnownItem && Object.keys(isKnownItem).length !== 0) {
          groupDetails?.push(isKnownItem);
        } else {
          unListedGroups.push(_um);
        }
      });

      if (unListedProfiles?.length > 0) {
        const unListedUserResponse = await getAllUsers(unListedProfiles, true);
        unListedProfiles?.map((_ulp) => {
          const userGet = unListedUserResponse?.data?.users?.find(
            (_u) => _u.uid === _ulp,
          );
          if (userGet && Object.keys(userGet).length > 0) {
            userprofiles?.push(userGet);
          }
        });
      }
      if (unListedGroups?.length > 0) {
        const unListedGroupsResponse = await getGroupDetails(unListedGroups);
        unListedGroups?.map((_ulp) => {
          const groupGet = unListedGroupsResponse?.data?.groups?.find(
            (_u) => _u.id === _ulp,
          );
          if (groupGet && Object.keys(groupGet).length > 0) {
            groupDetails?.push(groupGet);
          }
        });
      }

      const userRequestDetails: PayRequestItemType[] = allRequestsRow?.map(
        (_rowreq) => {
          const members = _rowreq?.members?.map(
            (__rm) =>
              userprofiles?.find((_up) => _up.uid === __rm) as UserProfileType,
          );
          const paidMembers = _rowreq?.paidMembers?.map(
            (__rm) =>
              userprofiles?.find((_up) => _up.uid === __rm) as UserProfileType,
          );
          const groups = _rowreq?.groups?.map(
            (__rm) =>
              groupDetails?.find((_gd) => _gd.id === __rm) as GroupDetailsType,
          );
          const created_by = userprofiles?.find(
            (_up) => _up.uid === _rowreq.created_by,
          ) as UserProfileType;

          const _item: PayRequestItemType = {
            ..._rowreq,
            members,
            groups,
            id: _rowreq?.id ?? '',
            created_by,
            paidMembers: paidMembers,
          };
          return _item;
        },
      );

      if (self) {
        setSelfRequests(userRequestDetails);
      } else {
        setRequests(userRequestDetails);
      }
    },
    [user, blockedUsers, friends, newUsers, receivedRequests, sentRequest],
  );

  const init = async () => {
    getAndSetSentRequests(true);
    getAndSetReceivedRequests(true);
    getAndSetBlockUsers(true);
    getAndSetFriends(true);
    getNewUsers();
    getNewGroups();
  };

  useEffect(() => {
    let friendsListner: () => void;
    let receivedRequestListner: () => void;
    let sentRequestListner: () => void;
    let blockUsersListner: () => void;
    let blockByUsersListner: () => void;
    let newUsersListner: () => void;
    let groupListner: () => void;

    let userRequests: () => void;
    let userSelfRequests: () => void;

    if (userId) {
      console.log('calling newone');
      init();
      sentRequestListner = listnerPath('sent_req')?.onSnapshot(
        getAndSetSentRequests.bind(this, false),
      );
      receivedRequestListner = listnerPath('received_req')?.onSnapshot(
        getAndSetReceivedRequests.bind(this, false),
      );
      friendsListner = listnerPath('friends')?.onSnapshot(
        getAndSetFriends.bind(this, false),
      );
      blockUsersListner = listnerPath('blocked_users')?.onSnapshot(
        getAndSetBlockUsers.bind(this, false),
      );
      newUsersListner = listnerPath('new_users').onSnapshot(getNewUsers);
      blockByUsersListner = listnerPath('blocked_by')?.onSnapshot(getNewUsers);

      groupListner = listnerPath('user_groups')?.onSnapshot(setNewGroups);
      console.log('-----usseelistner', {
        sent_req: listnerPath('sent_req'),
        received_req: listnerPath('received_req'),
        friends: listnerPath('friends'),
        blocked_users: listnerPath('blocked_users'),
        new_users: listnerPath('new_users'),
        blocked_by: listnerPath('blocked_by'),
        user_groups: listnerPath('user_groups'),
      });

      userRequests = payRequestListnerPath(userId).onSnapshot(
        getNewPayRequests.bind(this, false),
      );

      userSelfRequests = selfPayRequestListnerPath(userId).onSnapshot(
        getNewPayRequests.bind(this, true),
      );
    }

    return () => {
      if (friendsListner) {
        friendsListner();
      }
      if (receivedRequestListner) {
        receivedRequestListner();
      }
      if (sentRequestListner) {
        sentRequestListner();
      }
      if (blockUsersListner) {
        blockUsersListner();
      }
      if (blockByUsersListner) {
        blockByUsersListner();
      }
      if (newUsersListner) {
        newUsersListner();
      }
      if (groupListner) {
        groupListner();
      }

      if (userRequests) {
        userRequests();
      }
      if (userSelfRequests) {
        userSelfRequests();
      }
    };
  }, [user?.userProfile]);

  useEffect(() => {
    let groupDetailsListner: () => void;
    if (userGroups?.length > 0) {
      groupDetailsListner = groupListnerPaths(
        userGroups?.map((_) => _.id),
      ).onSnapshot(getNewGroups);
    } else {
      setUserGroupsDetails([]);
    }
    return () => {
      if (groupDetailsListner) {
        groupDetailsListner();
      }
    };
  }, [userGroups]);

  return null;
};
