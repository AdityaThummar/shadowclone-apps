import { GroupDetailsType, UserProfileType } from '../api/types';
import { SearchScreenListTypes } from '../screens';
import { NavigatorScreenParams } from '@react-navigation/native';

export type StackScreenProps = {
  SocialLogin: undefined;
  BottomTab: NavigatorScreenParams<BottomTabScreens>;
  AddEditRequestScreen: undefined;
  SelectItemScreen?: {
    type?: SearchScreenListTypes;
    header?: string;
    onSelect?: (user?: UserProfileType) => void;
    selectedMemebers?: UserProfileType[];
  };
  AddEditGroupScreen?: {
    data: GroupDetailsType;
  };
  EditProfileScreen?: {
    type?: 'new-profile' | 'edit-profile' | 'new-group' | 'edit-group';
    userData?: UserProfileType;
  };
  ViewProfileScreen: {
    group: boolean;
    groupDetails?: GroupDetailsType;
    profileDetails?: UserProfileType;
  };
  ChatListScreen?: {
    group?: boolean;
    data?: GroupDetailsType;
  };
};

export type BottomTabScreens = {
  Home: undefined;
  Groups: undefined;
  Search: undefined;
  Notifications: undefined;
  Settings: undefined;
};
