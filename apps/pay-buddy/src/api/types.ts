import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { type ErrorMessages } from './ApiErrorCodes';
import { User } from '@react-native-google-signin/google-signin';

export type ResponseType = {
  success: boolean;
  error?: keyof typeof ErrorMessages;
  data?: object;
};

export type GoogleSigninResponse = Omit<ResponseType, 'data'> & {
  data?: User;
};

export type UserProfileType = {
  name: string;
  bio?: string;
  image?: string;
};

export type UserData = {
  firebaseUser: FirebaseAuthTypes.UserCredential;
  userProfile?: UserProfileType;
};

export type LoginApiResponseType = Omit<ResponseType, 'data'> & {
  data?: UserData;
};

export type GetUserProfileApiResponseType = Omit<ResponseType, 'data'> & {
  data?: UserProfileType;
};

export type UploadPhotoResponseType = Omit<ResponseType, 'data'> & {
  data?: {
    uri?: string;
  };
};

export type GetUserListApiResponseType = Omit<ResponseType, 'data'> & {
  data?: {
    users: UserProfileType[];
  };
};
