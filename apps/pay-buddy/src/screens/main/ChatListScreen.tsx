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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RootRouteProps, useNav } from '../../helper';
import { hp, wp } from '@styles';
import { Alert, View } from 'react-native';
import { AuthState, UsersState } from '../../zustand';
import { RequestState } from '../../zustand/RequestState';
import {
  PayRequestItemAPIPaylod,
  PayRequestItemType,
  updateRequest,
} from '../../api/payRequests';
import { LoadingState } from '@zustand';
import { SelectionState } from '../../zustand/SelectionState';
import { getGroupDetails } from '../../api/groups';
import { GroupDetailsType } from '../../api/types';

export const ChatListScreen = () => {
  const { params } = useRoute<RootRouteProps<'ChatListScreen'>>();
  const group = params?.group;
  const data = params?.data;

  const { user } = AuthState();
  const { userGroupsDetails } = UsersState();
  const { requests, selfRequests } = RequestState();
  const { setLoader } = LoadingState();
  const { setSelectedGroups } = SelectionState();

  const { navigate, goBack } = useNav();
  const {
    themeValues: { colors },
  } = useThemed();

  const [groupDetails, setGroupDetails] = useState<GroupDetailsType>();

  useEffect(() => {
    (async () => {
      if (userGroupsDetails?.length > 0) {
        const foundGroup = userGroupsDetails?.find((_) => _.id === data?.id);
        if (foundGroup && Object.keys(foundGroup).length > 0) {
          setGroupDetails(foundGroup);
        } else {
          if (data?.id) {
            setLoader('Getting group');
            const groupDetails = await getGroupDetails([data?.id]);
            setLoader('');
            if (groupDetails?.error || !groupDetails?.data?.groups?.[0]?.id) {
              Alert.alert(
                'Oops',
                'Either this group is deleted or something went wrong when try to get group details.',
              );
              goBack();
            } else {
              setGroupDetails(groupDetails?.data?.groups?.[0]);
            }
          }
        }
      } else if (data) {
        setGroupDetails(data);
      }
    })();
  }, [data, userGroupsDetails]);

  const allRequests = useMemo(
    () =>
      [...requests, ...selfRequests]?.filter(
        (_item) =>
          _item.groups &&
          _item?.groups?.findIndex((_gp) => _gp?.id === groupDetails?.id) !==
            -1,
      ),
    [groupDetails, requests, selfRequests],
  );

  const renderChatImage = useCallback(
    () => <Avatar isGroup={group} uri={groupDetails?.image} size='tiny' />,
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
          key={`request-chat-${_item?.id}`}
        />
      );
    },
    [user],
  );

  const goToInfo = useCallback(() => {
    navigate('ViewProfileScreen', { group: true, groupDetails: groupDetails });
  }, [groupDetails]);

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
    [groupDetails],
  );

  const goToCreateNew = useCallback(() => {
    if (group && groupDetails?.id) {
      setSelectedGroups([groupDetails]);
    }
    navigate('AddEditRequestScreen');
  }, [group, groupDetails]);

  return (
    <ScreenWrapper>
      <Header
        leftComponent={renderChatImage()}
        title={groupDetails?.name}
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
