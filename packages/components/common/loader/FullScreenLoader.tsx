import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { Card } from '../Card';
import { commonStyles, hp, wp } from '@styles';
import { BaseStatusBar } from '../BaseStatusBar';
import { LoadingState } from '@zustand';
import { BaseText, BaseTextStyles } from '../text';
import { ScreenWrapper, useThemed } from '../wrapper';
import { ViewStyles } from '@types';

export type FullScreenLoaderType = {
  backgroundStyle?: ViewStyles;
  style?: ViewStyles;
  textStyle?: BaseTextStyles;
};

export const FullScreenLoader = (props: FullScreenLoaderType) => {
  const { backgroundStyle, style, textStyle } = props;

  const { isLoading, loadingMessage } = LoadingState();

  const {
    themeValues: { colors, theme },
  } = useThemed();

  const [localVisibility, setLocalVisibility] = useState(false);
  const BackgroundOpacity = useRef(new Animated.Value(0)).current;

  const BottomNavBgSetter = async (show = false) => {
    if (Platform.OS === 'android' && theme === 'light') {
      await NavigationBar.setBackgroundColorAsync(
        show
          ? colors?.modalBackgroundColor ?? '#FFFFFF'
          : colors?.primary ?? '#FFFFFF00',
      );
    }
  };

  const showBackground = async () => {
    setTimeout(() => {
      BottomNavBgSetter(true);
    }, 100);
    setLocalVisibility(true);
    Animated.timing(BackgroundOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const hideBackground = async () => {
    setTimeout(async () => {
      await BottomNavBgSetter(false);
    }, 100);
    Animated.timing(BackgroundOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(async () => {
      setLocalVisibility(false);
    });
  };

  useEffect(() => {
    isLoading ? showBackground() : hideBackground();
  }, [isLoading]);

  return (
    <>
      {localVisibility && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 100,
            },
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.modalBackgroundColor,
                zIndex: -1,
                opacity: BackgroundOpacity,
              },
              backgroundStyle,
            ]}
          />
          <ScreenWrapper
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            topSafeAreaViewStyle={{
              backgroundColor: 'transparent',
            }}
            style={{ backgroundColor: 'transparent' }}
          >
            <Card
              style={[
                {
                  position: 'absolute',
                  alignSelf: 'center',
                  bottom: hp(1),
                  paddingVertical: hp(2),
                  paddingHorizontal: wp(10),
                  gap: wp(2),
                  maxWidth: wp(90),
                },
                style,
              ]}
            >
              <ActivityIndicator size={25} color={colors.secondary} />
              <BaseText semibold sizeMedium center style={textStyle}>
                {!!loadingMessage ? loadingMessage : 'Please wait'}
              </BaseText>
            </Card>
          </ScreenWrapper>
          {theme === 'light' && (
            <BaseStatusBar backgroundColor={colors.modalBackgroundColor} />
          )}
        </View>
      )}
    </>
  );
};
