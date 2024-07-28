import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '../navigation/types';

export const useNav = <T extends keyof StackScreenProps>() => {
  type Props = NativeStackScreenProps<StackScreenProps, T>;
  type ScreenNavigationProp = Props['navigation'];

  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<RouteProp<StackScreenProps, T>>();

  return { navigation, route };
};
