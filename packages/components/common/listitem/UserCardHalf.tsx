import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
} from 'react-native';
import { Card } from '../Card';
import { commonStyles, hp, wp } from '@styles';
import { themedStyles, useThemed } from '../wrapper';
import { BaseText } from '../text';
import { Divider } from '../Divider';
import { BaseIcon, IconButton, PrimaryButton, TextButton } from '../button';
import { Input, InputProps } from '../Input';
import { UserProfileType } from 'apps/pay-buddy/src/api/types';
import { Avatar } from '../image';
import { ViewStyles } from '@types';
import { AuthState } from 'apps/pay-buddy/src/zustand';
import { useNav } from 'apps/pay-buddy/src/helper';

export type UserCardActionType = {
  title: string;
  onPress?: (item: UserProfileType) => void;
};

export type UserCardhalfProps = {
  actions?: UserCardActionType[];
  avatarSize?: 'small' | 'big';
  input?: boolean;
  value?: string;
  onChangeText?: (t: string) => void;
  onClearInput?: () => void;
  onBlurInput?: () => void;
  inputProps?: Omit<
    InputProps,
    'value' | 'onChangeText' | 'onClear' | 'onBlurInput'
  >;
  isSelection?: boolean;
  selected?: boolean;
  item: UserProfileType;
  isLoading?: boolean;
  containerStyle?: ViewStyles;
  onSelect?: (user: UserProfileType) => void;
  bottomLabel?: string;
  bottomLabelIcon?: string;
};

export const UserCardHalf = (props: UserCardhalfProps) => {
  const {
    actions,
    avatarSize = 'big',
    input = false,
    onChangeText = () => {},
    onClearInput = () => {},
    onBlurInput = () => {},
    value = '',
    inputProps = {},
    isSelection = false,
    selected = false,
    item,
    isLoading = false,
    containerStyle = {},
    onSelect,
    bottomLabel = '',
    bottomLabelIcon = '',
  } = props;

  const { push } = useNav();
  const {
    themeValues: { colors },
  } = useThemed();
  const { user } = AuthState();
  const styles = s();

  const renderActions = useCallback(
    (_item: { item: UserCardActionType }) => {
      const { onPress = () => {}, ...otherProps } = _item.item;

      const onPressHandler = (_?: GestureResponderEvent) => {
        _item?.item.onPress && _item?.item?.onPress(item);
      };

      return (
        <TextButton
          {...otherProps}
          onPress={onPressHandler}
          containerStyle={{
            justifyContent: 'center',
          }}
          center
          sizeRegular
        />
      );
    },
    [item],
  );

  const isSelfUser = useMemo(
    () => user?.userProfile?.uid === item?.uid,
    [user?.userProfile?.uid, item?.uid],
  );

  const onPressUser = useCallback(() => {
    push('ViewProfileScreen', { group: false, profileDetails: item });
  }, [item]);

  return (
    <Card
      style={[
        commonStyles.flex,
        styles.container,
        !!bottomLabel && {
          paddingBottom: hp(4),
          marginBottom: hp(2),
        },
        containerStyle,
        isSelection && selected ? styles.selectedStyle : {},
      ]}
      onPress={onPressUser}
    >
      {isSelection && selected && (
        <IconButton
          name={'checkmark-circle'}
          containerStyle={{
            top: 10,
            right: 10,
            position: 'absolute',
          }}
          color={colors.tint}
        />
      )}
      <Avatar uri={item?.image} />
      <BaseText semibold sizeMedium center numberOfLines={2}>
        {isSelfUser ? 'You' : item?.name}
      </BaseText>
      {input && (
        <>
          <Input
            containerStyle={{ flex: 1, width: 100, alignSelf: 'center' }}
            style={{ textAlign: 'center' }}
            bold
            placeholder='₹XX'
            onClear={onClearInput}
            onBlur={onBlurInput}
            {...{ value, onChangeText, ...inputProps }}
          />
        </>
      )}
      {isLoading ? (
        <ActivityIndicator
          style={{
            marginVertical: hp(1),
            flex: 1,
          }}
          size={'small'}
        />
      ) : (
        <>
          {!isSelfUser && !!actions && actions.length > 0 && !isSelection && (
            <>
              <FlatList
                data={actions}
                renderItem={renderActions}
                ItemSeparatorComponent={() => (
                  <Divider style={{ marginVertical: 5 }} />
                )}
                style={{
                  marginVertical: 5,
                }}
              />
            </>
          )}
          {isSelection && (
            <>
              <Divider />
              <TextButton
                title={selected ? 'Remove' : 'Select'}
                {...(onSelect
                  ? {
                      onPress: onSelect.bind(this, item),
                    }
                  : {})}
              />
            </>
          )}
        </>
      )}
      {!!bottomLabel && (
        <Card
          style={[
            commonStyles.rowItemCenterJustifyCenter,
            commonStyles.center,
            {
              gap: wp(0.5),
              paddingHorizontal: wp(4),
              position: 'absolute',
              bottom: -hp(2),
              paddingVertical: hp(1),
            },
          ]}
        >
          <BaseIcon name={bottomLabelIcon} color={colors.tint} size={20} />
          <BaseText sizeTinyExtra semibold style={{ color: colors.tint }}>
            {bottomLabel}
          </BaseText>
        </Card>
      )}
    </Card>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      gap: 5,
      maxWidth: wp(45),
      minWidth: wp(40),
      alignSelf: 'flex-start',
    },
    bioContainer: {
      height: 40,
      justifyContent: 'center',
    },
    addIconStyle: {
      color: colors.tint,
    },
    addButton: {
      gap: 3,
    },
    addButtonText: {
      color: colors.tint,
    },
    selectedStyle: {
      backgroundColor: colors.completedCardBackground,
    },
  }));
