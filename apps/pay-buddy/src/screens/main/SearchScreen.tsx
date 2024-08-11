import React, { useCallback, useEffect, useState } from 'react';
import { Header, Input, ScreenWrapper, UserCardHalf } from '@components';
import { FlatList } from 'react-native';
import { getAllUsers } from '../../api/users';
import { UserProfileType } from '../../api/types';

export type SearchScreenProps = {
  isSelect?: boolean;
};

export const SearchScreen = (props: SearchScreenProps) => {
  const { isSelect = false } = props;
  const [users, setUsers] = useState<UserProfileType[]>([]);

  const renderUsers = useCallback(
    (item: { item: UserProfileType; index: number }) => {
      return (
        <UserCardHalf
          item={item.item}
          actions={[{ title: 'Add' }, { title: "Don't Suggest" }]}
          isSelection={isSelect}
          // selected={[0, 1, 2, 5].includes(item.index)}
        />
      );
    },
    [isSelect],
  );

  const getAllAppUsers = async () => {
    const response = await getAllUsers();
    if (response?.success && response?.data) {
      setUsers(response?.data?.users);
    }
  };

  useEffect(() => {
    getAllAppUsers();
  }, []);

  return (
    <ScreenWrapper>
      <Header
        title={isSelect ? 'Select Members' : 'Find People'}
        disableBack={!isSelect}
      />
      <Input style={{ marginBottom: 10 }} placeholder='Search here ..' />
      <FlatList
        data={users}
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
