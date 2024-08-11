import { BaseText, Header, Input, ScreenWrapper } from '@components';
import React from 'react';
// import { useNav } from '../../helper';
import { View } from 'react-native';
import { commonStyles } from '@styles';

export type GroupScreenProps = {
  isSelect?: boolean;
};

export const GroupScreen = (props: GroupScreenProps) => {
  const { isSelect = false } = props;

  // const { push } = useNav();

  // const goToAddNew = () => {
  //   push('AddEditGroupScreen');
  // };

  return (
    <ScreenWrapper>
      <Header
        title={isSelect ? 'Select Groups' : 'Groups'}
        disableBack={!isSelect}
        // rightComponent={
        //   <IconButton
        //     color={colors.tint}
        //     name='plus'
        //     iFamily='Entypo'
        //     onPress={goToAddNew}
        //   />
        // }
      />
      <Input style={{ marginBottom: 10 }} placeholder='Search here ..' />
      {/* <Scroll> */}
      {/* <ListItemWithImage isSelection={isSelect} />
        <ListItemWithImage isSelection={isSelect} selected />
        <ListItemWithImage isSelection={isSelect} />
        <ListItemWithImage isSelection={isSelect} />
        <ListItemWithImage isSelection={isSelect} selected />
        <ListItemWithImage isSelection={isSelect} /> */}
      <View style={[commonStyles.centerCenter, commonStyles.flex]}>
        <BaseText regular sizeRegular center>
          No Data
        </BaseText>
      </View>
      {/* </Scroll> */}
    </ScreenWrapper>
  );
};
