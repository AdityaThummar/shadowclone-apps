import { View } from 'react-native';
import React from 'react';
import {
  Header,
  IconButton,
  Input,
  ListItemWithImage,
  PlusButton,
  PrimaryButton,
  ScreenWrapper,
  Scroll,
  UserCardHalf,
} from '@components';
import { commonStyles } from '@styles';
import { useNav } from '../../helper';
import { Divider } from 'packages/components/common/Divider';

export const AddEditRequestScreen = () => {
  const {
    navigation: { navigate },
  } = useNav();

  const goToAddItem = (type: 'group' | 'member' = 'member') => {
    navigate('SelectItemScreen', {
      type,
      header: `Select ${type}`,
    });
  };

  return (
    <ScreenWrapper>
      <Header title='New Pay Request' />
      <Scroll>
        <View
          style={[
            commonStyles.rowItemsCenter,
            {
              marginVertical: 10,
            },
          ]}
        >
          <Input
            placeholder='Ex. Pizza, Pasta etc'
            containerStyle={[{ flex: 2.5 }]}
            label='Title'
          />
          <Input
            label='Amount'
            placeholder='₹XX'
            containerStyle={[commonStyles.flex]}
          />
        </View>
        <Header
          title='Groups'
          sizeBig
          disableBack
          rightComponent={
            <PlusButton
              name='circle-with-plus'
              onPress={goToAddItem.bind(this, 'group')}
            />
          }
          containerStyle={{
            marginTop: 5,
          }}
        />
        <ListItemWithImage />
        <ListItemWithImage />
        <ListItemWithImage />
        <ListItemWithImage />
        <ListItemWithImage />
        <Header
          title='Members'
          sizeBig
          disableBack
          rightComponent={
            <PlusButton
              name='circle-with-plus'
              onPress={goToAddItem.bind(this, 'member')}
            />
          }
          containerStyle={{
            marginTop: 5,
          }}
        />
        <Scroll horizontal>
          <UserCardHalf avatarSize='small' input />
          <UserCardHalf avatarSize='small' input />
          <UserCardHalf avatarSize='small' input />
          <UserCardHalf avatarSize='small' input />
        </Scroll>
        <PrimaryButton title='Create Request' style={{ marginTop: 15 }} />
      </Scroll>
    </ScreenWrapper>
  );
};
