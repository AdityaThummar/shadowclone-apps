import { UserProfileType } from '../api/types';
import { BottomTabScreenProps as BottomTabScreenProp } from '@react-navigation/bottom-tabs';

export type StackScreenProps = {
  SocialLogin: undefined;
  BottomTab: BottomTabScreenProp<BottomTabScreenProps>;
  AddEditRequestScreen: undefined;
  SelectItemScreen?: {
    type?: 'group' | 'member';
    header?: string;
  };
  AddEditGroupScreen?: undefined;
  EditProfileScreen?: {
    type?: 'new-profile' | 'edit-profile' | 'new-group' | 'edit-group';
    userData?: UserProfileType;
  };
};

export type BottomTabScreenProps = {
  Home: undefined;
  Groups: undefined;
  Search: undefined;
  Notifications: undefined;
  Settings: undefined;
};
