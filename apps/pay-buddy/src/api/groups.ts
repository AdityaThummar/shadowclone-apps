import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  CreateGroupAPIPayloadType,
  CreateGroupMemberType,
  GetGroupDetailsResponseType,
  GroupDetailsType,
  ResponseType,
  UserProfileType,
} from './types';
import { NoReasonErrorResponse } from './apiHelpers';
import { getAllUsers } from './users';
import { FIREBASE_PATHS } from './FirebasePaths';

export const getGroupDetails: (
  groups?: string[],
) => Promise<GetGroupDetailsResponseType> = async (groups = []) => {
  const currentUserId = auth().currentUser?.uid?.toString();
  try {
    const userGroups = groups;
    if (groups?.length === 0 || !groups) {
      const response = await firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(currentUserId)
      .collection(FIREBASE_PATHS.groups)
      .get();
      response.docs.forEach((_group) => {
        const _groupData = _group.data();
        if (_groupData?.id) {
          userGroups?.push(_groupData?.id);
        }
      });
    }
    const group = await firestore()
      .collection(FIREBASE_PATHS.groups)
      .where('id', 'in', userGroups)
      .get();
    let groupArr: GroupDetailsType[] = [];
    const totalMembers: string[] = [];
    group?.docs?.forEach((_item) => {
      const data = _item.data();
      const obj: GroupDetailsType = {
        id: data?.id ?? '',
        member: data?.member ?? [],
        name: data?.name ?? data?.id ?? '',
        bio: data?.bio ?? '',
        image: data?.image ?? '',
      };
      if (data?.member) {
        (data?.member ?? []).map((_memeber: CreateGroupMemberType) => {
          if (_memeber?.uid && !totalMembers.includes(_memeber?.uid)) {
            totalMembers.push(_memeber?.uid);
          }
        });
      }
      groupArr.push(obj);
    });

    const membersDetails = await getAllUsers(totalMembers, false);
    let totalMembersDetails: UserProfileType[] = [];
    if (membersDetails.success && membersDetails.data?.users) {
      totalMembersDetails = membersDetails.data.users;
    }
    groupArr = groupArr.map((_gp) => {
      let newObj = { ..._gp };
      const memberArr: UserProfileType[] = [];
      _gp?.member?.forEach((_m) => {
        const _member = totalMembersDetails?.find((__m) => __m.uid === _m.uid);
        if (_member?.uid) {
          memberArr.push({ ..._m, ..._member });
        }
      });
      newObj = {
        ...newObj,
        member: memberArr,
      };
      return newObj;
    });

    return {
      success: true,
      data: {
        groups: groupArr,
      },
    };
  } catch (error) {
    console.log('🚀 ~ getUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const groupListnerPaths = (groupArray: string[]) =>
  firestore().collection(FIREBASE_PATHS.groups).where('id', 'in', groupArray);

export const createGroup: (
  data: CreateGroupAPIPayloadType,
  uploadNewImage?: boolean,
) => Promise<ResponseType> = async (
  data: CreateGroupAPIPayloadType,
  uploadNewImage = false,
) => {
  try {
    const response = await firestore()
      .collection(FIREBASE_PATHS.groups)
      .add(data);
    const newGroupId = response?.id;
    if (!newGroupId) {
      return NoReasonErrorResponse;
    }
    let newData = {
      ...data,
      id: newGroupId,
    };
    if (!!uploadNewImage && data?.image) {
      const fetRes = await fetch(data?.image);
      const blob = await fetRes.blob();
      const imageref = storage().ref(`${FIREBASE_PATHS.groups}/${newGroupId}`);
      await imageref.put(blob);
      const imageUrl = await imageref.getDownloadURL();
      newData = {
        ...newData,
        image: imageUrl,
      };
    }
    await firestore()
      .collection(FIREBASE_PATHS.groups)
      .doc(newGroupId)
      .update(newData);
    data.member?.forEach(async (m) => {
      if (!m.uid) {
        return;
      }
      await firestore()
        .collection(FIREBASE_PATHS.aditionalInfo)
        .doc(m?.uid)
        .collection(FIREBASE_PATHS.groups)
        .doc(newGroupId)
        .set({
          id: newGroupId,
          date: new Date(),
        });
    });
    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const updateGroup: (
  data: CreateGroupAPIPayloadType & { id: string },
  uploadNewImage?: boolean,
  removeMemberIds?: string[],
) => Promise<ResponseType> = async (
  data: CreateGroupAPIPayloadType & { id: string },
  uploadNewImage = false,
  removeMemberIds = [],
) => {
  const getMemberGroupPathRef = (id: string) =>
    firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(id)
      .collection(FIREBASE_PATHS.groups)
      .doc(data?.id);

  try {
    const groupId = data?.id;
    if (!groupId) {
      return NoReasonErrorResponse;
    }
    let finalData = { ...data };
    if (!!uploadNewImage && data?.image) {
      const fetRes = await fetch(data?.image);
      const blob = await fetRes.blob();
      const imageref = storage().ref(`${FIREBASE_PATHS.groups}/${groupId}`);
      await imageref.put(blob);
      const imageUrl = await imageref.getDownloadURL();
      finalData = {
        ...finalData,
        image: imageUrl,
      };
    }
    await firestore()
      .collection(FIREBASE_PATHS.groups)
      .doc(data?.id)
      .update(finalData);
    data.member?.forEach(async (m) => {
      const memberRef = getMemberGroupPathRef(m?.uid);
      const memberGroupDoc = await memberRef.get();
      const isExists = memberGroupDoc.data()?.id;
      if (!m.uid || !isExists) {
        return;
      }
      await memberRef.update({
        id: data?.id,
        date: new Date(),
      });
    });
    removeMemberIds?.forEach(async (_mid) => {
      const memberRef = getMemberGroupPathRef(_mid);
      await memberRef.delete();
    });
    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const leaveGroup: (id?: string) => Promise<ResponseType> = async (
  id?: string,
) => {
  try {
    if (!id) {
      return NoReasonErrorResponse;
    }
    const currentUser = auth().currentUser?.uid;
    await firestore()
      .collection(FIREBASE_PATHS.aditionalInfo)
      .doc(currentUser)
      .collection(FIREBASE_PATHS.groups)
      .doc(id)
      .delete();
    const groupRef = firestore().collection(FIREBASE_PATHS.groups).doc(id);
    const oldGroup = await groupRef.get();
    const GroupDetails = oldGroup?.data();
    const newMembers = GroupDetails?.member?.filter(
      (_: CreateGroupMemberType) => _.uid !== currentUser,
    );
    const newGroupDetails: GroupDetailsType = {
      id,
      member: newMembers ?? [],
      name: GroupDetails?.name ?? '',
      bio: GroupDetails?.bio ?? '',
      image: GroupDetails?.image ?? '',
    };
    await groupRef.update(newGroupDetails);

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return NoReasonErrorResponse;
  }
};
