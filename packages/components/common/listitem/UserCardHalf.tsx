import React, { useCallback } from 'react';
import { Dimensions, Image, FlatList } from 'react-native';
import { Card } from '../Card';
import { commonStyles } from '@styles';
import { themedStyles, useThemed } from '../wrapper';
import { BaseText } from '../text';
import { Divider } from '../Divider';
import { IconButton, TextButton } from '../button';
import { Input, InputProps } from '../Input';

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
      <Image
        source={{
          uri: 'https://imgs.search.brave.com/J2b4U21i3ZjGLwmsPGTsOAEDTsIJk2cYuNWPhk9RXJw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE0/ODQ1MTU5OTE2NDct/YzU3NjBmY2VjZmM3/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjAuMyZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1URjhmRzFo/YkdWOFpXNThNSHg4/TUh4OGZEQT0.jpeg',
        }}
        style={{
          height: avatarSize === 'big' ? 100 : 80,
          width: avatarSize === 'big' ? 100 : 80,
          borderRadius: 100,
          alignSelf: 'center',
        }}
      />
      <BaseText semibold sizeMedium center>
        Darshan Golakiya
      </BaseText>
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
    </Card>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      gap: 5,
      maxWidth: Dimensions.get('window').width * 0.45,
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
