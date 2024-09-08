import {
  BaseText,
  Header,
  IconButton,
  Input,
  ListItemWithImage,
  PrimaryButton,
  ScreenWrapper,
  Scroll,
  useThemed,
} from '@components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNav } from '../../helper';
import { View } from 'react-native';
import { commonStyles, hp, wp } from '@styles';
import { GroupDetailsType, UserProfileType } from '../../api/types';
import { UsersState } from '../../zustand';
import { SelectionState } from '../../zustand/SelectionState';

export type GroupScreenProps = {
  isSelect?: boolean;
};

export const GroupScreen = (props: GroupScreenProps) => {
  const { isSelect = false } = props;

  const { navigate, goBack } = useNav();
  const { userGroupsDetails } = UsersState();
  const { selectedGroups, setSelectedGroups, setSelectedMemebersForNew } =
    SelectionState();

  const {
    themeValues: { colors },
  } = useThemed();

  const [searchText, setSearchText] = useState<string>('');

  const goToAddNew = useCallback(() => {
    navigate('AddEditGroupScreen');
  }, []);

  const goToChat = useCallback((_item: GroupDetailsType) => {
    navigate('ChatListScreen', {
      group: true,
      data: _item,
    });
  }, []);

  const toggleSelection = useCallback(
    (_item: GroupDetailsType) => {
      const isIn = selectedGroups?.findIndex((_) => _.id === _item.id) !== -1;
      let newArr = [...selectedGroups];
      if (isIn) {
        newArr = newArr.filter((_) => _.id !== _item.id);
      } else {
        newArr = [...newArr, _item];
      }
      const newMembersArray: UserProfileType[] = [];
      newArr?.map((_gp) => {
        _gp.member?.map((_member) => {
          const isMemberIn =
            newMembersArray?.findIndex((_) => _.uid === _member.uid) !== -1;
          if (!isMemberIn) {
            newMembersArray.push(_member);
          }
        });
      });
      setSelectedMemebersForNew(newMembersArray);
      setSelectedGroups(newArr);
    },
    [selectedGroups],
  );

  const renderGroup = useCallback(
    (_item: GroupDetailsType) => {
      const onPressHandler = () =>
        isSelect ? toggleSelection(_item) : goToChat(_item);

      return (
        <ListItemWithImage
          key={_item.id}
          item={_item}
          onPress={onPressHandler}
          isSelection={isSelect}
          selected={selectedGroups?.findIndex((_) => _.id === _item.id) !== -1}
        />
      );
    },
    [isSelect, selectedGroups],
  );

  const searchedArray: GroupDetailsType[] = useMemo(() => {
    const stext = searchText?.toLowerCase();

    const arr = userGroupsDetails?.filter((_item) =>
      _item?.name?.toLowerCase()?.includes(stext),
    );

    if (searchText) {
      return arr;
    } else {
      return userGroupsDetails;
    }
  }, [searchText, userGroupsDetails]);

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
      <Input
        containerStyle={{ marginBottom: 10 }}
        placeholder='Search here ..'
        value={searchText}
        onChangeText={setSearchText}
      />
      {searchText && (
        <BaseText
          semibold
          style={{
            marginBottom: hp(1),
            marginHorizontal: wp(4),
          }}
        >{`${searchedArray?.length} search found for "${searchText}"`}</BaseText>
      )}
      {searchedArray?.length > 0 ? (
        <Scroll>{searchedArray?.map(renderGroup)}</Scroll>
      ) : (
        <View style={[commonStyles.centerCenter, commonStyles.flex]}>
          <BaseText regular sizeRegular center>
            No Data
          </BaseText>
        </View>
      )}
      {isSelect && <PrimaryButton title='Done' onPress={goBack} />}
    </ScreenWrapper>
  );
};
