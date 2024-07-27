import { GestureResponderEvent, TextStyle } from 'react-native';
import { ViewStyles } from '../../../../types/commonTypes';

export type iFamily =
  | 'MaterialCommunityIcons'
  | 'Entypo'
  | 'Ionicons'
  | 'AntDesign'
  | 'EvilIcons'
  | 'Feather'
  | 'Fontisto'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Foundation'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial'
  | undefined;

export type iconProps = {
  name?: string;
  size?: number;
  color?: string;
  iconStyle?: ViewStyles & TextStyle;
  iFamily?: iFamily;
  containerStyle?: ViewStyles | ViewStyles[];
  onPress?: (event: GestureResponderEvent) => void;
};
