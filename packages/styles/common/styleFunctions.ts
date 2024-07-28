import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export const hp = (percentage: number = 1) => {
  return (height * percentage) / 100;
};

export const wp = (percentage: number = 1) => {
  return (width * percentage) / 100;
};
