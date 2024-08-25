import { useCallback, useEffect } from 'react';
import { AuthState, UsersState } from '../zustand';
import { getUsersForFriend, listnerPath, requestUsersSetter } from './users';
import { getGroupDetails, groupListnerPaths } from './groups';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { UserGroups } from './types';

export const FirebaseListner = () => {
  const { user } = AuthState();
  const userId = user?.userProfile?.uid;

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
  }, [userGroups]);

  const setNewGroups = useCallback(
    (
      snap: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
    ) => {
      const formatedArray: UserGroups[] = snap.docs.map((_gp) => {
        const _gpData = _gp?.data();
        return {
          id: _gpData?.id,
          date: _gpData?.date,
        };
      });
      setUserGroups(formatedArray);
    },
    [],
  );

  const init = async () => {
    getAndSetSentRequests(true);
    getAndSetReceivedRequests(true);
    getAndSetBlockUsers(true);
    getAndSetFriends(true);
    getNewUsers();
    // getNewGroups();
  };

  useEffect(() => {
    let friendsListner: () => void;
    let receivedRequestListner: () => void;
    let sentRequestListner: () => void;
    let blockUsersListner: () => void;
    let blockByUsersListner: () => void;
    let newUsersListner: () => void;
    let groupListner: () => void;

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
