import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GroupDetailsType, ResponseType, UserProfileType } from './types';
import { NoReasonErrorResponse } from './apiHelpers';
import { FIREBASE_PATHS } from './FirebasePaths';

export type PayRequestDiffAmountType = {
  [key: string]: string;
};

export type PayRequestItemType = {
  id: string;
  created_by: UserProfileType;
  date: string;
  title?: string;
  members: UserProfileType[];
  paidMembers?: UserProfileType[];
  groups: GroupDetailsType[];
  requestAmount: string;
  diffAmounts?: PayRequestDiffAmountType;
};

export type PayRequestItemAPIPaylod = {
  id?: string;
  created_by: string;
  date: string;
  title?: string;
  members: string[];
  paidMembers?: string[];
  groups: string[];
  requestAmount: string;
  diffAmounts?: PayRequestDiffAmountType;
};

export const createNewRequest: (
  data: PayRequestItemAPIPaylod,
) => Promise<ResponseType> = async (data: PayRequestItemAPIPaylod) => {
  try {
    const requestRef = firestore().collection(FIREBASE_PATHS.requests);
    const response = await requestRef.add(data);
    await requestRef.doc(response?.id).update({
      ...data,
      id: response?.id,
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

export const updateRequest: (
  data: PayRequestItemAPIPaylod,
) => Promise<ResponseType> = async (data: PayRequestItemAPIPaylod) => {
  try {
    if (!data?.id) {
      return NoReasonErrorResponse;
    }
    console.log('🚀 ~ )=>Promise<ResponseType>= ~ data?.id:', data?.id);
    const requestRef = firestore()
      .collection(FIREBASE_PATHS.requests)
      .doc(data?.id);
    await requestRef.update(data);

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const markAsPaid: (
  data: PayRequestItemType,
) => Promise<ResponseType> = async (data: PayRequestItemType) => {
  try {
    const userId = auth().currentUser?.uid;
    if (!data?.id || !userId) {
      return NoReasonErrorResponse;
    }

    const newPaidMembers = [...(data?.paidMembers ?? [])]
      ?.map((_m) => _m.uid)
      ?.filter((_m) => _m !== userId);
    newPaidMembers?.push(userId);

    const payRequstPayload: PayRequestItemAPIPaylod = {
      ...data,
      created_by: data?.created_by?.uid ?? '',
      members: data?.members?.map((_m) => _m.uid),
      paidMembers: newPaidMembers,
      groups: data?.groups?.map((_g) => _g.id),
    };

    return await updateRequest(payRequstPayload);
  } catch (error) {
    console.log('🚀 ~ markAsPaid ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const deleteRequest: (
  data: PayRequestItemType,
) => Promise<ResponseType> = async (data: PayRequestItemType) => {
  try {
    if (!data?.id) {
      return NoReasonErrorResponse;
    }

    if (!data?.id) {
      return NoReasonErrorResponse;
    }
    await firestore()
      .collection(FIREBASE_PATHS.requests)
      .doc(data?.id)
      .delete();

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~ markAsPaid ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const payRequestListnerPath = (id: string) =>
  firestore()
    .collection(FIREBASE_PATHS.requests)
    .where('members', 'array-contains', id);

export const selfPayRequestListnerPath = (id: string) =>
  firestore().collection(FIREBASE_PATHS.requests).where('created_by', '==', id);
