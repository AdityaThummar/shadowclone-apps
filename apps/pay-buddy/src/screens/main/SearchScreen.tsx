import React, { useCallback } from 'react';
import { Header, Input, ScreenWrapper, UserCardHalf } from '@components';
import { FlatList } from 'react-native';

export const SearchScreen = () => {
  const renderUsers = useCallback(() => {
    return <UserCardHalf />;
  }, []);

  return (
    <ScreenWrapper>
      <Header title='Find People' disableBack />
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
