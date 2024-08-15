import React from 'react';
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
      ) : params?.type === 'sent_req' ? (
        <SearchScreen isSentReq />
      ) : params?.type === 'friends' ? (
        <SearchScreen isFriends />
      ) : params?.type === 'blocked_users' ? (
        <SearchScreen isBlockedUsers />
      ) : (
        <SearchScreen isSelect />
      )}
    </>
  );
};
