import {
  Avatar,
  Header,
  IconButton,
  PayRequestCard,
  PrimaryButton,
  ScreenWrapper,
  Scroll,
  useThemed,
} from '@components';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { RootRouteProps, useNav } from '../../helper';
import { hp, wp } from '@styles';
import { View } from 'react-native';
import { AuthState } from '../../zustand';
import { RequestState } from '../../zustand/RequestState';
import {
  PayRequestItemAPIPaylod,
  PayRequestItemType,
  updateRequest,
} from '../../api/payRequests';
import { LoadingState } from '@zustand';

export const ChatListScreen = () => {
  const { params } = useRoute<RootRouteProps<'ChatListScreen'>>();
  const group = params?.group;
  const data = params?.data;

  const { user } = AuthState();
  const { requests, selfRequests } = RequestState();
  const { setLoader } = LoadingState();

  const { navigate } = useNav();
  const {
    themeValues: { colors },
  } = useThemed();

  const renderChatImage = useCallback(
    () => <Avatar isGroup={group} uri={data?.image} size='tiny' />,
    [],
  );

  const renderChatItem = useCallback(
    (_item: PayRequestItemType) => {
      const isOwn = _item.created_by?.uid === user?.userProfile?.uid;
      const isPaid =
        !isOwn &&
        !!_item.paidMembers &&
        _item.paidMembers?.findIndex(
          (_pm) => _pm?.uid === user?.userProfile?.uid,
        ) !== -1;

      return (
        <PayRequestCard
          containerStyle={{
            width: wp(85),
            alignSelf: isOwn ? 'flex-end' : 'flex-start',
          }}
          data={_item}
          isOwn={isOwn}
          isPaid={isPaid}
        />
      );
    },
    [user],
  );

  const goToInfo = useCallback(() => {
    navigate('ViewProfileScreen', { group: true, groupDetails: data });
  }, [data]);

  const renderRightComponent = useCallback(
    () => (
      <View>
        <IconButton
          color={colors.tint}
          name='information-circle'
          size={30}
          onPress={goToInfo}
        />
      </View>
    ),
    [],
  );

  const goToCreateNew = useCallback(() => {
    navigate('AddEditRequestScreen');
  }, []);

  const allRequests = useMemo(
    () =>
      [...requests, ...selfRequests]?.filter(
        (_item) =>
          _item.groups &&
          _item?.groups?.findIndex((_gp) => _gp.id === data?.id) !== -1,
      ),
    [data, requests, selfRequests],
  );

  return (
    <ScreenWrapper>
      <Header
        leftComponent={renderChatImage()}
        title={data?.name}
        rightComponent={renderRightComponent()}
      />
      <Scroll autoScrollBottom>{allRequests?.map(renderChatItem)}</Scroll>
      <PrimaryButton
        title='Create new request'
        style={{
          marginTop: hp(2),
        }}
        onPress={goToCreateNew}
      />
    </ScreenWrapper>
  );
};
