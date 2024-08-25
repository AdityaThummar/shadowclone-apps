import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const useNav = <T extends keyof StackScreenProps>() => {
  type Props = BottomTabScreenProps<StackScreenProps, T> &
    NativeStackScreenProps<StackScreenProps, T>;
  type ScreenNavigationProp = Props['navigation'];

  return useNavigation<ScreenNavigationProp>();
};

export type RootRouteProps<RouteName extends keyof StackScreenProps> =
  RouteProp<StackScreenProps, RouteName>;
