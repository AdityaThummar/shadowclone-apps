import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { NoReasonErrorResponse } from './apiHelpers';
import {
  GetUserListApiResponseType,
  ResponseType,
  UserListType,
  UserProfileType,
} from './types';
import { FIREBASE_PATHS } from './FirebasePaths';

const currentUserId = auth().currentUser?.uid?.toString();

export const convertDataToUser = (
  userData: FirebaseFirestoreTypes.DocumentData,
) => ({
  ...userData,
  name: userData?.name ?? '',
  uid: userData?.uid ?? '',
});

export const getAllUsers: () => Promise<GetUserListApiResponseType> =
  async () => {
    try {
      const users = await firestore().collection('users').get();
      if (!users?.docs) {
        return NoReasonErrorResponse;
      }

      const user = auth().currentUser?.uid;

      const userArr: UserProfileType[] = [];
      users.forEach((element) => {
        const userData = element.data();
        if (element.id !== user) {
          userArr.push(convertDataToUser(userData));
        }
      });

      return {
        success: true,
        data: {
          users: userArr,
        },
      };
    } catch (error) {
      console.log('🚀 ~  uploadUserProfile error:', error);
      return NoReasonErrorResponse;
    }
  };

export const getUsersForFriend: () => Promise<GetUserListApiResponseType> =
  async () => {
    try {
      const user = auth().currentUser?.uid?.toString();
      const usersRef = firestore().collection('users');
      const users = await usersRef.get();
      const friends = await firestore()
        .collection(FIREBASE_PATHS.aditionalInfo)
        .doc(user)
        .collection(FIREBASE_PATHS.friends)
        .get();
      const sentReq = await firestore()
        .collection(FIREBASE_PATHS.aditionalInfo)
        .doc(user)
        .collection(FIREBASE_PATHS.sent_req)
        .get();
      const receivedReq = await firestore()
        .collection(FIREBASE_PATHS.aditionalInfo)
        .doc(user)
        .collection(FIREBASE_PATHS.received_req)
        .get();
      const blockedUsers = await firestore()
        .collection(FIREBASE_PATHS.aditionalInfo)
        .doc(user)
        .collection(FIREBASE_PATHS.blocked_users)
        .get();
      const blockedByUsers = await firestore()
        .collection(FIREBASE_PATHS.aditionalInfo)
        .doc(user)
        .collection(FIREBASE_PATHS.blocked_by)
        .get();

      if (
        !users?.docs ||
        !friends?.docs ||
        !sentReq?.docs ||
        !receivedReq?.docs ||
        !blockedUsers.docs ||
        !blockedByUsers?.docs
      ) {
        return NoReasonErrorResponse;
      }

      const ignoreIds = [
        ...(friends?.docs ?? []),
        ...(sentReq?.docs ?? []),
        ...(receivedReq?.docs ?? []),
        ...(blockedUsers?.docs ?? []),
        ...(blockedByUsers?.docs ?? []),
      ]?.map((_doc) => _doc.data()?.uid ?? '__');

      ignoreIds.push(user);

      const userArr: UserProfileType[] = [];
      users.forEach((element) => {
        const userData = element.data();
        if (!!userData?.uid && !ignoreIds.includes(userData.uid)) {
          userArr.push(convertDataToUser(userData));
        }
      });

      return {
        success: true,
        data: {
          users: userArr,
        },
      };
    } catch (error) {
      console.log('🚀 ~  uploadUserProfile error:', error);
      return NoReasonErrorResponse;
    }
  };

export const sendFriendRequest: (
  friendId: string,
) => Promise<ResponseType> = async (friendId) => {
  try {
    const uid = auth().currentUser?.uid;
    await firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(uid?.toString())
      .collection('sent_req')
      .doc(friendId)
      .set({
        uid: friendId,
        date: new Date()?.getTime()?.toString(),
      });
    await firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(friendId?.toString())
      .collection('received_req')
      .doc(uid)
      .set({
        uid,
        date: new Date()?.getTime()?.toString(),
      });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const listnerPath = (type: UserListType) => {
  const additionalInfoPath = firestore()
    .collection(FIREBASE_PATHS.aditionalInfo)
    .doc(currentUserId);
  switch (type) {
    case 'sent_req':
      return additionalInfoPath.collection(FIREBASE_PATHS.sent_req);
    case 'received_req':
      return additionalInfoPath.collection(FIREBASE_PATHS.received_req);
    case 'blocked_by':
      return additionalInfoPath.collection(FIREBASE_PATHS.blocked_by);
    case 'blocked_users':
      return additionalInfoPath.collection(FIREBASE_PATHS.blocked_users);
    case 'friends':
      return additionalInfoPath.collection(FIREBASE_PATHS.friends);
    default:
      return additionalInfoPath.collection(FIREBASE_PATHS.sent_req);
  }
};

export const getRequests: (
  type?: UserListType,
) => Promise<GetUserListApiResponseType> = async (type = 'sent_req') => {
  try {
    const path = listnerPath(type);

    const response = await path.get();
    if (!response?.docs) {
      return NoReasonErrorResponse;
    }
    const usersArr = response?.docs?.map((_doc) => _doc.data());
    if (usersArr.length === 0) {
      return {
        success: true,
        data: {
          users: [],
        },
      };
    }
    const ids = usersArr.map((_reqitem) => _reqitem?.uid);
    const usersRef = firestore()
      .collection(FIREBASE_PATHS.users)
      .where('uid', 'in', ids);
    const users = await usersRef.get();

    if (!users?.docs) {
      return NoReasonErrorResponse;
    }

    const userArr: UserProfileType[] = users?.docs?.map((_user) => {
      const userData = _user.data();
      return convertDataToUser(userData);
    });

    return {
      success: true,
      data: {
        users: userArr,
      },
    };
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const rejectRequest: (
  friendId: string,
  withdraw?: boolean,
) => Promise<ResponseType> = async (friendId, withdraw = false) => {
  try {
    const user = auth().currentUser?.uid?.toString();
    const firstPath = withdraw
      ? FIREBASE_PATHS.sent_req
      : FIREBASE_PATHS.received_req;
    const secondPath = withdraw
      ? FIREBASE_PATHS.received_req
      : FIREBASE_PATHS.sent_req;

    const ownDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(user)
      .collection(firstPath)
      .doc(friendId);
    const friendDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(friendId)
      .collection(secondPath)
      .doc(user);

    await Promise.all([
      await ownDeletionPathRef.delete(),
      await friendDeletionPathRef.delete(),
    ]);

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const blockUser: (friendId: string) => Promise<ResponseType> = async (
  friendId,
) => {
  try {
    const user = auth().currentUser?.uid?.toString();

    const ownDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(user)
      .collection(FIREBASE_PATHS.blocked_users)
      .doc(friendId);
    const friendDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(friendId)
      .collection(FIREBASE_PATHS.blocked_by)
      .doc(user);

    await Promise.all([
      await ownDeletionPathRef.set({
        uid: friendId,
        date: new Date(),
      }),
      await friendDeletionPathRef.set({
        uid: user,
        date: new Date(),
      }),
    ]);

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const unBlockUser: (friendId: string) => Promise<ResponseType> = async (
  friendId,
) => {
  try {
    const user = auth().currentUser?.uid?.toString();

    const ownDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(user)
      .collection(FIREBASE_PATHS.blocked_users)
      .doc(friendId);
    const friendDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(friendId)
      .collection(FIREBASE_PATHS.blocked_by)
      .doc(user);

    await Promise.all([
      await ownDeletionPathRef.delete(),
      await friendDeletionPathRef.delete(),
    ]);

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const addFriend: (friendId: string) => Promise<ResponseType> = async (
  friendId,
) => {
  try {
    const user = auth().currentUser?.uid?.toString();

    const ownAdditionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(user)
      .collection(FIREBASE_PATHS.friends)
      .doc(friendId);
    const friendAdditionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(friendId)
      .collection(FIREBASE_PATHS.friends)
      .doc(user);

    const ownDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(user)
      .collection(FIREBASE_PATHS.received_req)
      .doc(friendId);
    const friendDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(friendId)
      .collection(FIREBASE_PATHS.sent_req)
      .doc(user);

    await Promise.all([
      ownDeletionPathRef.delete(),
      friendDeletionPathRef.delete(),
      await ownAdditionPathRef.set({
        date: new Date(),
        uid: friendId,
      }),
      await friendAdditionPathRef.set({
        date: new Date(),
        uid: user,
      }),
    ]);

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const removeFriend: (friendId: string) => Promise<ResponseType> = async (
  friendId,
) => {
  try {
    const user = auth().currentUser?.uid?.toString();

    const ownDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(user)
      .collection(FIREBASE_PATHS.friends)
      .doc(friendId);
    const friendDeletionPathRef = firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(friendId)
      .collection(FIREBASE_PATHS.friends)
      .doc(user);

    await Promise.all([
      ownDeletionPathRef.delete(),
      friendDeletionPathRef.delete(),
    ]);

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const requestUsersSetter = async (
  type: UserListType = 'sent_req',
  setterFunction: (user: UserProfileType[]) => void = () => {},
) => {
  const response = await getRequests(type);

  if (response?.data?.users) {
    setterFunction(response?.data?.users);
  }
};
