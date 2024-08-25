import React, { useRef, useEffect } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { themedStyles } from './wrapper';
import { commonStyles } from '@styles';

export type ScrollProps = ScrollViewProps & { autoScrollBottom?: boolean };

export const Scroll = (props: ScrollProps) => {
  const styles = s();

  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    if (props?.autoScrollBottom) {
      setTimeout(() => {
        ref?.current?.scrollToEnd();
      }, 200);
    }
  }, [props?.autoScrollBottom]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      ref={ref}
      {...props}
      style={[commonStyles.flex, props?.style]}
      contentContainerStyle={[
        !props?.horizontal
          ? styles.contentContainerStyle
          : styles.contentContainerStyleHorizontal,
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
    contentContainerStyleHorizontal: {
      paddingVertical: 5,
    },
  }));
