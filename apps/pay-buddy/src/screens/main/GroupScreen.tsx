import {
  BaseText,
  Header,
  IconButton,
  Input,
  ListItemWithImage,
  ScreenWrapper,
  Scroll,
  useThemed,
} from '@components';
import React, { useCallback } from 'react';
import { useNav } from '../../helper';
import { View } from 'react-native';
import { commonStyles } from '@styles';
import { GroupDetailsType } from '../../api/types';
import { UsersState } from '../../zustand';

export type GroupScreenProps = {
  isSelect?: boolean;
};

export const GroupScreen = (props: GroupScreenProps) => {
  const { isSelect = false } = props;

  const { navigate } = useNav();
  const { userGroupsDetails } = UsersState();

  const {
    themeValues: { colors },
  } = useThemed();

  const goToAddNew = useCallback(() => {
    navigate('AddEditGroupScreen');
  }, []);

  const goToChat = useCallback((_item: GroupDetailsType) => {
    navigate('ChatListScreen', {
      group: true,
      data: _item,
    });
  }, []);

  const renderGroup = useCallback((_item: GroupDetailsType) => {
    return (
      <ListItemWithImage
        key={_item.id}
        item={_item}
        onPress={goToChat.bind(this, _item)}
      />
    );
  }, []);

  return (
    <ScreenWrapper>
      <Header
        title={isSelect ? 'Select Groups' : 'Groups'}
        disableBack={!isSelect}
        rightComponent={
          <IconButton
            color={colors.tint}
            name='plus'
            iFamily='Entypo'
            onPress={goToAddNew}
          />
        }
      />
      <Input style={{ marginBottom: 10 }} placeholder='Search here ..' />
      {userGroupsDetails?.length > 0 ? (
        <Scroll>{userGroupsDetails?.map(renderGroup)}</Scroll>
      ) : (
        <View style={[commonStyles.centerCenter, commonStyles.flex]}>
          <BaseText regular sizeRegular center>
            No Data
          </BaseText>
        </View>
      )}
    </ScreenWrapper>
  );
};
