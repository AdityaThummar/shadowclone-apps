import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Header, Input, ScreenWrapper } from '@components';
import { RootRouteProps } from '../../helper';
import { GroupScreen } from './GroupScreen';
import { SearchScreen } from './SearchScreen';
import { useRoute } from '@react-navigation/native';

export const SelectItemScreen = () => {
  const { params } = useRoute<RootRouteProps<'SelectItemScreen'>>();

  return (
    <>
      {/* <Header title={params?.header ?? 'Select'} /> */}
      {params?.type === 'group' ? (
        <GroupScreen isSelect />
      ) : (
        <SearchScreen isSelect />
      )}
    </>
  );
};
