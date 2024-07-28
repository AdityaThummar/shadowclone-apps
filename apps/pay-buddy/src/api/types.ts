import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ErrorMessages } from './ApiErrorCodes';
import { User } from '@react-native-google-signin/google-signin';

export type ResponseType = {
  success: boolean;
  error?: keyof typeof ErrorMessages;
  data?: object;
};

export type GoogleSigninResponse = Omit<ResponseType, 'data'> & {
  data?: User;
};

export type LoginApiResponseType = Omit<ResponseType, 'data'> & {
  data?: FirebaseAuthTypes.UserCredential;
};
