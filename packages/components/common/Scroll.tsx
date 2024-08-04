import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { themedStyles } from './wrapper';
import { commonStyles } from '@styles';

export type ScrollProps = ScrollViewProps;

export const Scroll = (props: ScrollProps) => {
  const styles = s();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
      style={[commonStyles.flex, props?.style]}
      contentContainerStyle={[
        styles.contentContainerStyle,
        props?.contentContainerStyle,
      ]}
    />
  );
};

const s = () =>
  themedStyles(() => ({
    contentContainerStyle: {
      paddingBottom: 15,
    },
  }));
