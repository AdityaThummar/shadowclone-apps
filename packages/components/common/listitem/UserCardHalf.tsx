import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Card } from '../Card';
import { commonStyles } from '@styles';
import { themedStyles, useThemed } from '../wrapper';
import { BaseText } from '../text';
import { Divider } from '../Divider';
import { BaseIcon, IconButton, TextButton } from '../button';

export type UserCardhalfProps = {
  isRequest?: boolean;
};

export const UserCardHalf = (props: UserCardhalfProps) => {
  const { isRequest = false } = props;
  const {
    themeValues: { colors },
  } = useThemed();
  const styles = s();

  return (
    <Card style={[commonStyles.flex, styles.container]}>
      <Image
        source={{
          uri: 'https://imgs.search.brave.com/J2b4U21i3ZjGLwmsPGTsOAEDTsIJk2cYuNWPhk9RXJw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE0/ODQ1MTU5OTE2NDct/YzU3NjBmY2VjZmM3/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjAuMyZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1URjhmRzFo/YkdWOFpXNThNSHg4/TUh4OGZEQT0.jpeg',
        }}
        style={{
          height: isRequest ? 80 : 100,
          width: isRequest ? 80 : 100,
          borderRadius: 100,
        }}
      />
      <BaseText semibold sizeMedium center>
        Darshan Golakiya
      </BaseText>
      <Divider />
      {isRequest ? (
        <>
          <TextButton title={'Add'} />
          <Divider />
          <TextButton title={'Remove'} />
        </>
      ) : (
        <View style={[commonStyles.rowItemsCenter, styles.addButton]}>
          <TextButton title='Send Request' />
        </View>
      )}
    </Card>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      alignItems: 'center',
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
  }));
