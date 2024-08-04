export type StackScreenProps = {
  SocialLogin: undefined;
  BottomTab: undefined;
  AddEditRequestScreen: undefined;
  SelectItemScreen?: {
    type?: 'group' | 'member';
    header?: string;
  };
  AddEditGroupScreen?: undefined;
  EditProfileScreen?: undefined;
};

export type BottomTabScreenProps = {
  Home: undefined;
  Groups: undefined;
  Search: undefined;
  Notifications: undefined;
  Settings: undefined;
};
