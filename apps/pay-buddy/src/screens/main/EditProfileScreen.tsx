import { Alert, Linking, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  Avatar,
  Header,
  IconButton,
  Input,
  PrimaryButton,
  ScreenWrapper,
  useThemed,
} from '@components';
import { RootRouteProps, useNav } from '../../helper';
import { useRoute } from '@react-navigation/native';
import { AuthState } from '../../zustand/AuthState';
import { hp, wp } from '@styles';
import { UserProfileType } from '../../api/types';
import { uploadUserProfile, uploadUserProfilePhoto } from '../../api';
import { LoadingState } from '@zustand';

export const EditProfileScreen = () => {
  const { params } = useRoute<RootRouteProps<'EditProfileScreen'>>();
  const { reset, goBack } = useNav();

  const { user, setUser } = AuthState();
  const { setLoader } = LoadingState();
  const {
    themeValues: { colors },
  } = useThemed();

  const [data, setData] = useState<UserProfileType>(
    params?.userData?.name
      ? params?.userData
      : {
          name: user?.userProfile?.name ?? '',
          bio: user?.userProfile?.bio ?? '',
          image:
            user?.userProfile?.image ??
            user?.firebaseUser?.user?.photoURL ??
            '',
        },
  );

  const [pickedImageResponse, setPickedImageResponse] =
    useState<ImagePicker.ImagePickerResult>();

  console.log(
    '🚀 ~ EditProfileScreen ~ pickedImageResponse:',
    pickedImageResponse,
  );

  const setDetail = useCallback(
    (detail: keyof UserProfileType, data: string) => {
      setData((pre) => ({ ...pre, [detail]: data }));
    },
    [],
  );

  const submit = useCallback(async () => {
    if (!params?.type) {
      return;
    }
    const functionRef =
      // ['new-profile', 'edit-profile'].includes(params?.type)
      //   ?
      uploadUserProfile;
    // : () => {};
    setLoader('Updating profile');
    setTimeout(() => {
      setLoader();
    }, 2000);
    return;
    const response = await functionRef(data);

    if (response.success && response.data?.name && user?.firebaseUser) {
      let profileData = response.data;
      if (pickedImageResponse?.assets?.[0]?.uri) {
        const uploadPhoto = await uploadUserProfilePhoto(
          pickedImageResponse?.assets?.[0]?.uri,
        );

        if (uploadPhoto?.success) {
          const response2 = await functionRef({
            ...data,
            image: uploadPhoto.data?.uri,
          });
          if (response2?.success && response2?.data) {
            profileData = response2?.data;
          }
        }
      }
      setLoader();

      setUser({ firebaseUser: user?.firebaseUser, userProfile: profileData });
      if (['edit-profile', 'edit-group'].includes(params?.type)) {
        goBack();
      } else {
        reset({
          index: 0,
          routes: [
            {
              name: 'BottomTab',
            },
          ],
        });
      }
    }

    console.log('🚀 ~ submit ~ response:', response);
  }, [data, pickedImageResponse]);

  const openCamera = async () => {
    try {
      setLoader('Processing camera');
      const permission = await ImagePicker.getCameraPermissionsAsync();
      if (permission?.granted) {
        const response = await ImagePicker.launchCameraAsync();
        if (!response?.canceled) {
          setPickedImageResponse(response);
        }
      } else {
        Alert.alert(
          'Oops',
          'You need to give access of Camera to capture an image',
          [
            {
              text: 'Cancel',
            },
            {
              text: 'Open Settings',
              onPress: Linking.openSettings,
            },
          ],
        );
      }
      setLoader();
    } catch (error) {
      console.log('🚀 ~ openCamera ~ error:', error);
      setLoader();
    }
  };

  const openGallery = async () => {
    try {
      setLoader('Processing photos');
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (permission?.granted) {
        const response = await ImagePicker.launchImageLibraryAsync({
          selectionLimit: 1,
        });
        if (!response?.canceled) {
          setPickedImageResponse(response);
        }
      } else {
        Alert.alert(
          'Oops',
          'You need to give access of Photos to select an image',
          [
            {
              text: 'Cancel',
            },
            {
              text: 'Open Settings',
              onPress: Linking.openSettings,
            },
          ],
        );
      }
      setLoader();
    } catch (error) {
      console.log('🚀 ~ openGallery ~ error:', error);
      setLoader();
    }
  };

  return (
    <ScreenWrapper>
      <Header
        title={
          params?.type === 'new-profile' ? 'Create new profile' : 'Edit Profile'
        }
        disableBack={params?.type === 'new-profile'}
      />
      <View style={{ alignSelf: 'center', marginTop: hp(2) }}>
        <Avatar
          uri={pickedImageResponse?.assets?.[0]?.uri ?? data?.image}
          size='big'
          containerStyle={{
            marginVertical: hp(2),
          }}
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
        label='Name'
        value={data?.name}
        onChangeText={setDetail.bind(this, 'name')}
      />
      <Input
        label='Bio'
        value={data.bio}
        onChangeText={setDetail.bind(this, 'bio')}
      />
      <PrimaryButton
        title={'Save'}
        style={{ marginTop: 15 }}
        onPress={submit}
      />
    </ScreenWrapper>
  );
};
