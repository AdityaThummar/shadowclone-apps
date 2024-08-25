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
import React, { useCallback } from 'react';
import { RootRouteProps, useNav } from '../../helper';
import { hp, wp } from '@styles';
import { View } from 'react-native';

export const ChatListScreen = () => {
  const { params } = useRoute<RootRouteProps<'ChatListScreen'>>();
  const group = params?.group;
  const data = params?.data;

  const { navigate } = useNav();
  const {
    themeValues: { colors },
  } = useThemed();

  const renderChatImage = useCallback(
    () => <Avatar isGroup={group} uri={data?.image} size='tiny' />,
    [],
  );

  const renderChatItem = useCallback(
    (self = false, isallPaid = false, isPaid = false) => {
      return (
        <PayRequestCard
          containerStyle={{
            width: wp(85),
            alignSelf: self ? 'flex-end' : 'flex-start',
            marginVertical: hp(self ? 3 : 1),
          }}
          isOwn={self}
          allPaid={isallPaid}
          isPaid={isPaid}
        />
      );
    },
    [],
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

  return (
    <ScreenWrapper>
      <Header
        leftComponent={renderChatImage()}
        title={data?.name}
        rightComponent={renderRightComponent()}
      />
      <Scroll autoScrollBottom>
        {renderChatItem(false, false, true)}
        {renderChatItem(false, false)}
        {renderChatItem(true, true)}
        {renderChatItem()}
        {renderChatItem(false, false, true)}
        {renderChatItem(true)}
        {renderChatItem()}
        {renderChatItem(false, false, true)}
        {renderChatItem(false, false, true)}
      </Scroll>
      <PrimaryButton
        title='Create new request'
        style={{
          marginTop: hp(2),
        }}
      />
    </ScreenWrapper>
  );
};
