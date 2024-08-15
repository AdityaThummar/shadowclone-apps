import auth from '@react-native-firebase/auth';
import { useEffect } from 'react';
import { AuthState, UsersState } from '../zustand';
import { getUsersForFriend, listnerPath, requestUsersSetter } from './users';

export const FirebaseListner = () => {
  const userId = auth()?.currentUser?.uid;
  const { user } = AuthState();
  if (!userId) {
    return null;
  }

  const {
    setReceivedRequests,
    setSentRequests,
    setNewUsers,
    setBlockedUsers,
    setFriends,
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

  const init = async () => {
    getAndSetSentRequests(true);
    getAndSetReceivedRequests(true);
    getAndSetBlockUsers(true);
    getAndSetFriends(true);
    getNewUsers();
  };

  useEffect(() => {
    let friendsListner: () => void;
    let receivedRequestListner: () => void;
    let sentRequestListner: () => void;
    let blockUsersListner: () => void;
    let blockByUsersListner: () => void;

    if (userId) {
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

      blockByUsersListner = listnerPath('blocked_by')?.onSnapshot(getNewUsers);
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
    };
  }, [userId, user?.userProfile?.uid]);

  return null;
};
