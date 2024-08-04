import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Header, Input, ScreenWrapper } from '@components';
import { useNav } from '../../helper';
import { GroupScreen } from './GroupScreen';
import { SearchScreen } from './SearchScreen';

export const SelectItemScreen = () => {
  const {
    route: { params },
  } = useNav();

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
