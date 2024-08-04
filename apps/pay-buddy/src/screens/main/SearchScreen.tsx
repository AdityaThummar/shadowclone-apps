import React, { useCallback } from 'react';
import { Header, Input, ScreenWrapper, UserCardHalf } from '@components';
import { FlatList } from 'react-native';

export type SearchScreenProps = {
  isSelect?: boolean;
};

export const SearchScreen = (props: SearchScreenProps) => {
  const { isSelect = false } = props;

  const renderUsers = useCallback(
    (item: { item: unknown; index: number }) => {
      return (
        <UserCardHalf
          actions={[{ title: 'Add' }, { title: "Don't Suggest" }]}
          isSelection={isSelect}
          selected={[0, 1, 2, 5].includes(item.index)}
        />
      );
    },
    [isSelect],
  );

  return (
    <ScreenWrapper>
      <Header
        title={isSelect ? 'Select Members' : 'Find People'}
        disableBack={!isSelect}
      />
      <Input style={{ marginBottom: 10 }} placeholder='Search here ..' />
      <FlatList
        data={[1, 2, 3, 5, 5, 5, 5, 5, 5]}
        showsVerticalScrollIndicator={false}
        renderItem={renderUsers}
        numColumns={2}
        contentContainerStyle={{
          paddingBottom: 15,
        }}
      />
    </ScreenWrapper>
  );
};
