import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  Header,
  Input,
  PlusButton,
  PrimaryButton,
  ScreenWrapper,
  Scroll,
  UserCardHalf,
} from '@components';
import { useNav } from '../../helper';
import { GroupScreen } from './GroupScreen';
import { SearchScreen } from './SearchScreen';

export const AddEditGroupScreen = () => {
  const {
    navigation: { push },
  } = useNav();

  const goToAddItem = () => {
    push('SelectItemScreen', {
      type: 'member',
      header: `Select members`,
    });
  };

  return (
    <ScreenWrapper>
      <Header title={'Create New Group'} />
      <Scroll>
        <Input label='Group name' />
        <Input label='Group bio' />
        <Header
          title='Members'
          sizeBig
          disableBack
          rightComponent={
            <PlusButton name='circle-with-plus' onPress={goToAddItem} />
          }
          containerStyle={{
            marginTop: 5,
          }}
        />
        <Scroll horizontal>
          <UserCardHalf avatarSize='small' actions={[{ title: 'Remove' }]} />
          <UserCardHalf avatarSize='small' actions={[{ title: 'Remove' }]} />
          <UserCardHalf avatarSize='small' actions={[{ title: 'Remove' }]} />
          <UserCardHalf avatarSize='small' actions={[{ title: 'Remove' }]} />
        </Scroll>
        <PrimaryButton title='Create Group' style={{ marginTop: 15 }} />
      </Scroll>
    </ScreenWrapper>
  );
};
