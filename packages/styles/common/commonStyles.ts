import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexItemCenter: {
    flex: 1,
    alignItems: 'center',
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
  rowItemCenterJustifyCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowItemCenterJustifyAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowItemCenterJustifyEvenly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rowItemCenterJustifyBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenStyle: {
    flex: 1,
    margin: 10,
  },
});
