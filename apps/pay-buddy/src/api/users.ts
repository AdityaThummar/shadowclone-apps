import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NoReasonErrorResponse } from './apiHelpers';
import { GetUserListApiResponseType, UserProfileType } from './types';

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
          userArr.push({
            ...userData,
            name: userData?.name ?? '',
          });
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
