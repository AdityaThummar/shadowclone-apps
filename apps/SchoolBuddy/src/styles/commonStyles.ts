import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    alignSelf: 'center',
  },
  itemCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  centerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  rowItemsCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowItemsEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
