import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { type ErrorCodes, ErrorMessages } from './ApiErrorCodes';
import {
  GetUserProfileApiResponseType,
  GoogleSigninResponse,
  LoginApiResponseType,
  ResponseType,
  UploadPhotoResponseType,
  UserProfileType,
} from './types';
import { FIREBASE_GOOGLE_WEB_CLIENT_IT } from 'apps/pay-buddy/configs/firebaseConfigs';
import { NoReasonErrorResponse } from './apiHelpers';

export const initGoogleLogin: () => Promise<GoogleSigninResponse> =
  async () => {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    if (!hasPlayServices) {
      return {
        success: false,
        error: 'no_play_services',
      };
    }
    GoogleSignin.configure({
      webClientId: FIREBASE_GOOGLE_WEB_CLIENT_IT,
    });
    await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();
    if (response?.user?.id) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        error: 'no_reason',
      };
    }
  };

export const getUserProfile: () => Promise<GetUserProfileApiResponseType> =
  async () => {
    try {
      const user = auth().currentUser;

      const updatedUser = await firestore()
        .collection('users')
        .doc(user?.uid?.toString())
        .get();
      const updatedUserData = updatedUser.data();

      if (!updatedUserData?.name) {
        return NoReasonErrorResponse;
      }

      const _finalData: UserProfileType = {
        name: updatedUserData?.name,
        image: updatedUserData?.image ?? '',
        bio: updatedUserData?.bio ?? '',
      };

      return {
        success: true,
        data: _finalData,
      };
    } catch (error) {
      console.log('🚀 ~ getUserProfile error:', error);
      return NoReasonErrorResponse;
    }
  };

export const login: (
  setLoader: (m?: string) => void,
) => Promise<LoginApiResponseType> = async (setLoader = () => {}) => {
  try {
    const googleResponse = await initGoogleLogin();
    setLoader('Getting profile');
    let error: keyof typeof ErrorCodes | undefined;
    if (googleResponse?.error) {
      error = googleResponse?.error;
    }
    if (error) {
      setLoader();
      Alert.alert('Oops', ErrorMessages[error]);
      return {
        success: false,
        error: googleResponse.error,
      };
    }
    if (!googleResponse?.data?.idToken) {
      setLoader();
      return NoReasonErrorResponse;
    }
    const firebaseLogin = await auth().signInWithCredential(
      auth.GoogleAuthProvider.credential(googleResponse?.data?.idToken),
    );

    const userData = await getUserProfile();
    setLoader();

    return {
      success: true,
      data: {
        firebaseUser: firebaseLogin,
        userProfile: userData?.success ? userData?.data : undefined,
      },
    };
  } catch (error) {
    setLoader();
    console.log('🚀 ~ login ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const logout: () => Promise<ResponseType> = async () => {
  try {
    GoogleSignin.configure({
      webClientId: FIREBASE_GOOGLE_WEB_CLIENT_IT,
    });
    await GoogleSignin.signOut();
    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~ logout ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const deleteUserAccount: () => Promise<ResponseType> = async () => {
  try {
    const user = auth().currentUser;
    await firestore().collection('users')?.doc(user?.uid?.toString()).delete();
    await auth().currentUser?.delete();
    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.log('🚀 ~ deleteUserAccount ~ error:', error);
    return NoReasonErrorResponse;
  }
};

export const uploadUserProfile: (
  data: UserProfileType,
) => Promise<GetUserProfileApiResponseType> = async (data) => {
  try {
    const user = auth().currentUser;
    await firestore().collection('users').doc(user?.uid?.toString()).set(data);

    const updatedUserData = await getUserProfile();

    if (!updatedUserData?.success) {
      return NoReasonErrorResponse;
    }

    return updatedUserData;
  } catch (error) {
    console.log('🚀 ~  uploadUserProfile error:', error);
    return NoReasonErrorResponse;
  }
};

export const uploadUserProfilePhoto: (
  uri: string,
) => Promise<UploadPhotoResponseType> = async (uri) => {
  try {
    const user = auth().currentUser;
    const fetRes = await fetch(uri);
    const blob = await fetRes.blob();
    const storageRef = storage().ref(`users/${user?.uid}`);
    const uplaod = await storageRef.put(blob);
    console.log('🚀 ~ )=>uploadUserProfilePhoto ~ uplaod:', uplaod);
    const downloadUrl = await storageRef.getDownloadURL();
    console.log('🚀 ~ )=>uploadUserProfilePhoto ~ uri:', uri);

    return {
      success: true,
      data: {
        uri: downloadUrl,
      },
    };
  } catch (error) {
    console.log('🚀 ~ uploadUserProfilePhoto ~ error:', error);
    return NoReasonErrorResponse;
  }
};
