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
import { useNav } from '../../helper';

export type GroupScreenProps = {
  isSelect?: boolean;
};

export const GroupScreen = (props: GroupScreenProps) => {
  const { isSelect = false } = props;

  const {
    themeValues: { colors },
  } = useThemed();

  const {
    navigation: { push },
  } = useNav();

  const goToAddNew = () => {
    push('AddEditGroupScreen');
  };

  return (
    <ScreenWrapper>
      <Header
        title={isSelect ? 'Select Groups' : 'Groups'}
        disableBack={!isSelect}
        rightComponent={
          <IconButton
            color={colors.tint}
            name='plus'
            iFamily='Entypo'
            onPress={goToAddNew}
          />
        }
      />
      <Input style={{ marginBottom: 10 }} placeholder='Search here ..' />
      <Scroll>
        <ListItemWithImage isSelection={isSelect} />
        <ListItemWithImage isSelection={isSelect} selected />
        <ListItemWithImage isSelection={isSelect} />
        <ListItemWithImage isSelection={isSelect} />
        <ListItemWithImage isSelection={isSelect} selected />
        <ListItemWithImage isSelection={isSelect} />
      </Scroll>
    </ScreenWrapper>
  );
};
