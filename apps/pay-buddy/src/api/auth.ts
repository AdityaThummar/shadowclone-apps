import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { type ErrorCodes, ErrorMessages } from './ApiErrorCodes';
import {
  GoogleSigninResponse,
  LoginApiResponseType,
  ResponseType,
} from './types';
import auth from '@react-native-firebase/auth';
import { FIREBASE_GOOGLE_WEB_CLIENT_IT } from 'apps/pay-buddy/configs/firebaseConfigs';

export const initGoogleLogin: () => Promise<GoogleSigninResponse> =
  async () => {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    console.log('🚀 ~ initGoogleLogin ~ init:', hasPlayServices);
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
    console.log('🚀 ~ response:', response);
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

export const login: () => Promise<LoginApiResponseType> = async () => {
  try {
    const googleResponse = await initGoogleLogin();
    console.log('🚀 ~ constlogin: ~ googleResponse:', googleResponse);
    let error: keyof typeof ErrorCodes | undefined;
    if (googleResponse?.error) {
      error = googleResponse?.error;
    }
    if (error) {
      Alert.alert('Oops', ErrorMessages[error]);
      return {
        success: false,
        error: googleResponse.error,
      };
    }
    if (!googleResponse?.data?.idToken) {
      return {
        success: false,
        error: 'no_reason',
      };
    }
    const firebaseLogin = await auth().signInWithCredential(
      auth.GoogleAuthProvider.credential(googleResponse?.data?.idToken),
    );
    console.log('🚀 ~ constlogin: ~ firebaseLogin:', firebaseLogin);
    return {
      success: true,
      data: firebaseLogin,
    };
  } catch (error) {
    console.log('🚀 ~ login ~ error:', error);
    return {
      success: false,
      error: 'no_reason',
    };
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
    return {
      success: false,
      error: 'no_reason',
    };
  }
};
