import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '../navigation/types';

export const useNav = <T extends keyof StackScreenProps>() => {
  type Props = NativeStackScreenProps<StackScreenProps, T>;
  type ScreenNavigationProp = Props['navigation'];

  return useNavigation<ScreenNavigationProp>();
};

export type RootRouteProps<RouteName extends keyof StackScreenProps> =
  RouteProp<StackScreenProps, RouteName>;
