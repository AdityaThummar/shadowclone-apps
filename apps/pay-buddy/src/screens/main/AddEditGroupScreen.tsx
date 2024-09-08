import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Header,
  IconButton,
  Input,
  PlusButton,
  PrimaryButton,
  ScreenWrapper,
  Scroll,
  UserCardHalf,
  useThemed,
} from '@components';
import { RootRouteProps, useNav } from '../../helper';
import { GroupDetailsType, UserProfileType } from '../../api/types';
import { SelectionState } from '../../zustand/SelectionState';
import { AuthState } from '../../zustand';
import { hp, wp } from '@styles';
import { useImagePicker } from '@hooks';
import * as ImagePicker from 'expo-image-picker';
import { Alert, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { createGroup, updateGroup } from '../../api/groups';
import { LoadingState } from '@zustand';

export const AddEditGroupScreen = () => {
  const { push, goBack } = useNav();
  const { params } = useRoute<RootRouteProps<'AddEditGroupScreen'>>();
  const { user } = AuthState();
  const { selectedMemebersForNew, setSelectedMemebersForNew } =
    SelectionState();
  const { setLoader } = LoadingState();
  const {
    themeValues: { colors },
  } = useThemed();

  const oldData = params?.data;
  const isEdit = oldData?.id;
  const isAdmin = oldData?.member?.find(
    (_item) => _item.uid === user?.userProfile?.uid,
  )?.admin;

  const [data, setData] = useState<GroupDetailsType>({
    id: oldData?.id?.toString() ?? '',
    name: oldData?.name ?? '',
    bio: oldData?.bio ?? '',
    image: oldData?.image ?? '',
    member: oldData?.member ?? selectedMemebersForNew,
  });

  const [pickedImageResponse, setPickedImageResponse] =
    useState<ImagePicker.ImagePickerResult>();

  const onPickImage = (response: ImagePicker.ImagePickerResult) => {
    setPickedImageResponse(response);
  };

  const { openCamera, openGallery } = useImagePicker(undefined, onPickImage);

  const goToAddItem = useCallback(() => {
    push('SelectItemScreen', {
      type: `select_new_member`,
      header: `Select members`,
    });
  }, []);

  const setDetail = useCallback(
    (detail: keyof UserProfileType, data: string) => {
      setData((pre) => ({ ...pre, [detail]: data }));
    },
    [],
  );

  const selectedMembers: UserProfileType[] = useMemo(() => {
    let newArr = [...selectedMemebersForNew];
    if (user?.userProfile) {
      const isIn =
        selectedMembers?.findIndex((_) => _.uid === user?.userProfile?.uid) !==
        -1;
      if (isIn) {
        newArr = newArr.filter((_) => _.uid !== user?.userProfile?.uid);
        newArr.push(user.userProfile);
      }
    }
    return newArr;
  }, [selectedMemebersForNew, user?.userProfile]);

  const onSubmit = useCallback(async () => {
    if (!data.name) {
      Alert.alert('Oops', 'Please enter group name !!');
      return;
    }
    if (!selectedMembers || selectedMembers.length <= 1) {
      Alert.alert('Oops', 'Please add atleast 1 member other than you :)');
      return;
    }
    const newGroupMembers = selectedMembers?.map((_) => ({
      uid: _.uid,
      admin: _.uid === user?.userProfile?.uid,
    }));
    const groupData = {
      member: newGroupMembers ?? [],
      name: data?.name ?? '',
      bio: data?.bio,
      ...(pickedImageResponse?.assets?.[0]?.uri || data?.image
        ? { image: pickedImageResponse?.assets?.[0]?.uri ?? data?.image }
        : {}),
    };
    setLoader(isEdit ? 'Updating group' : 'Creating group');
    const uploadNewImage = !!pickedImageResponse?.assets?.[0]?.uri;
    if (isEdit) {
      const removeMemberIds = oldData?.member
        ?.filter(
          (_) =>
            selectedMemebersForNew?.findIndex((__) => __.uid === _.uid) === -1,
        )
        ?.map((_) => _.uid);
      await updateGroup(
        { ...groupData, id: oldData.id },
        uploadNewImage,
        removeMemberIds,
      );
    } else {
      await createGroup(groupData, uploadNewImage);
    }
    setLoader('');
    goBack();
  }, [
    data,
    selectedMembers,
    user,
    oldData,
    isEdit,
    pickedImageResponse,
    selectedMemebersForNew,
  ]);

  useEffect(() => {
    let userToSet: UserProfileType[] = [];
    if (oldData?.member && oldData?.member?.length > 0) {
      userToSet.push(...oldData.member);
    }
    userToSet = userToSet?.filter(
      (_item) => _item.uid !== user?.userProfile?.uid,
    );

    if (user?.userProfile) {
      userToSet.push(user?.userProfile);
    }

    setSelectedMemebersForNew(userToSet);
    return () => {
      setSelectedMemebersForNew([]);
    };
  }, [user?.userProfile, oldData]);

  const renderMemebers = useCallback(
    (item: UserProfileType) => {
      const onRemove = () => {
        setSelectedMemebersForNew(
          selectedMemebersForNew.filter((_) => _.uid !== item.uid),
        );
      };

      return (
        <UserCardHalf
          avatarSize='small'
          actions={[{ title: 'Remove', onPress: onRemove }]}
          item={item}
          containerStyle={{
            justifyContent: 'center',
          }}
          key={item.uid}
        />
      );
    },
    [selectedMemebersForNew],
  );

  return (
    <ScreenWrapper>
      <Header title={isEdit ? 'Edit Group' : 'Create New Group'} />
      <Scroll>
        <View style={{ alignSelf: 'center', marginTop: hp(2) }}>
          <Avatar
            uri={pickedImageResponse?.assets?.[0]?.uri ?? data?.image}
            size='big'
            containerStyle={{
              marginVertical: hp(2),
            }}
            isGroup
          />
          <View
            style={[
              {
                position: 'absolute',
                top: -hp(1),
                right: -wp(12),
                width: wp(19),
                // backgroundColor: 'red',
              },
            ]}
          >
            <IconButton
              name='pencil'
              iFamily='Foundation'
              containerStyle={{
                backgroundColor: colors.tint,
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
                elevation: 4,
                shadowColor: colors.tint,
                shadowRadius: 2,
                shadowOpacity: 0.5,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
                alignSelf: 'flex-start',
              }}
              iconStyle={{
                color: colors.primary,
              }}
              onPress={openGallery}
            />
            <IconButton
              name='camera'
              onPress={openCamera}
              containerStyle={{
                backgroundColor: colors.tint,
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
                elevation: 4,
                shadowColor: colors.tint,
                shadowRadius: 2,
                shadowOpacity: 0.5,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
                alignSelf: 'flex-end',
                marginRight: wp(1),
              }}
              iconStyle={{
                color: colors.primary,
              }}
            />
            {!!pickedImageResponse?.assets?.[0]?.uri && (
              <IconButton
                name='close'
                onPress={setPickedImageResponse.bind(this, undefined)}
                containerStyle={{
                  backgroundColor: colors.tint,
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                  elevation: 4,
                  shadowColor: colors.tint,
                  shadowRadius: 2,
                  shadowOpacity: 0.5,
                  shadowOffset: {
                    height: 0,
                    width: 0,
                  },
                  marginRight: wp(0),
                  marginTop: hp(1.5),
                  alignSelf: 'flex-end',
                }}
                iconStyle={{
                  color: colors.primary,
                }}
              />
            )}
          </View>
        </View>
        <Input
          label='Group name'
          value={data?.name}
          onChangeText={setDetail.bind(this, 'name')}
        />
        <Input
          label='Group bio'
          value={data?.bio}
          onChangeText={setDetail.bind(this, 'bio')}
          containerStyle={{ marginVertical: hp(1) }}
        />
        <Header
          title={`Members (${selectedMembers.length})`}
          sizeBig
          disableBack
          rightComponent={
            (isEdit ? isAdmin : true) ? (
              <PlusButton name='circle-with-plus' onPress={goToAddItem} />
            ) : null
          }
          containerStyle={{
            marginTop: hp(0.5),
          }}
        />
        <Scroll horizontal>{selectedMembers.map(renderMemebers)}</Scroll>
      </Scroll>
      <PrimaryButton
        title={isEdit ? 'Update Group' : 'Create Group'}
        style={{ marginTop: 15 }}
        onPress={onSubmit}
      />
    </ScreenWrapper>
  );
};
