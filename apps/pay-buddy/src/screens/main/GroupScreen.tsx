import {
  Header,
  IconButton,
  Input,
  ListItemWithImage,
  ScreenWrapper,
  Scroll,
  useThemed,
} from '@components';
import React from 'react';

export const GroupScreen = () => {
  const {
    themeValues: { colors },
  } = useThemed();

  return (
    <ScreenWrapper>
      <Header
        title='Groups'
        disableBack
        rightComponent={
          <IconButton color={colors.tint} name='plus' iFamily='Entypo' />
        }
      />
      <Input style={{ marginBottom: 10 }} placeholder='Search here ..' />
      <Scroll>
        <ListItemWithImage />
        <ListItemWithImage />
        <ListItemWithImage />
        <ListItemWithImage />
        <ListItemWithImage />
        <ListItemWithImage />
      </Scroll>
    </ScreenWrapper>
  );
};
