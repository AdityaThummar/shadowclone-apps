import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Card } from '../Card';
import { commonStyles, hp, wp } from '@styles';
import { themedStyles, useThemed } from '../wrapper';
import { BaseText } from '../text';
import { Divider } from '../Divider';
import { IconButton, TextButton } from '../button';
import { Input, InputProps } from '../Input';
import { UserProfileType } from 'apps/pay-buddy/src/api/types';
import { Avatar } from '../image';
import { ViewStyles } from '@types';

export type UserCardActionType = {
  title: string;
  onPress?: () => void;
};

export type UserCardhalfProps = {
  actions?: UserCardActionType[];
  avatarSize?: 'small' | 'big';
  input?: boolean;
  onChangeText?: (t: string) => void;
  inputProps?: InputProps;
  isSelection?: boolean;
  selected?: boolean;
  item?: UserProfileType;
  isLoading?: boolean;
  containerStyle?: ViewStyles;
};

export const UserCardHalf = (props: UserCardhalfProps) => {
  const {
    actions,
    avatarSize = 'big',
    input = false,
    onChangeText = () => {},
    inputProps = {},
    isSelection = false,
    selected = false,
    item,
    isLoading = false,
    containerStyle = {},
  } = props;

  const {
    themeValues: { colors },
  } = useThemed();
  const styles = s();

  const renderActions = useCallback(
    ({ item }: { item: UserCardActionType }) => {
      return (
        <TextButton
          {...item}
          containerStyle={{
            justifyContent: 'center',
          }}
          center
          sizeRegular
        />
      );
    },
    [],
  );

  return (
    <Card
      style={[
        commonStyles.flex,
        styles.container,
        containerStyle,
        isSelection && selected ? styles.selectedStyle : {},
      ]}
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
        {item?.name}
      </BaseText>
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
          {!!actions && actions.length > 0 && !isSelection && (
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
              <TextButton title={selected ? 'Remove' : 'Select'} />
            </>
          )}
          {input && (
            <>
              <Divider />
              <Input
                containerStyle={{ flex: 1, width: 100, alignSelf: 'center' }}
                style={{ textAlign: 'center' }}
                bold
                placeholder='₹50'
                {...{ onChangeText, ...inputProps }}
              />
            </>
          )}
        </>
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
