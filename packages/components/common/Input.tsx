import React, { useCallback, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextStyle,
  View,
} from 'react-native';
import { BaseText, getFontWeight } from './text';
import { getFontSize } from './text/FontSize';
import { IconButton } from './button';
import { commonStyles } from 'packages/styles/common';
import { TextInputProps } from 'react-native';
import { BaseTextProps, BaseTextStyle, SizeProps, WeightProps } from './text';
import { ViewStyles } from '../../types/common/commonTypes';
import { themedStyles } from './wrapper';

export type InputProps = TextInputProps &
  SizeProps &
  WeightProps & {
    containerStyle?: ViewStyles;
    inputContainerStyle?: ViewStyles;
    labelProps?: Omit<BaseTextProps, 'style'>;
    labelStyle?: BaseTextStyle;
    label?: string;
    horizontal?: boolean;
    isPassword?: boolean;
    error?: string;
  };

export const Input = (props: InputProps) => {
  const {
    onFocus = () => {},
    onBlur = () => {},
    containerStyle = {},
    inputContainerStyle = {},
    labelProps = {},
    labelStyle = {},
    label = undefined,
    horizontal = false,
    isPassword = false,
    error,
    ...otherProps
  } = props;
  const styles = s();

  const [isFocused, setIsFocused] = useState(false);
  const [textShown, setTextShown] = useState(!isPassword);

  const weightStyles: Pick<TextStyle, 'fontFamily'> = useMemo(() => {
    return {
      fontFamily: getFontWeight({
        ...props,
        medium: props?.medium === undefined ? true : props?.medium,
      }),
    };
  }, [props]);

  const sizeStyles: Pick<TextStyle, 'fontSize'> = useMemo(() => {
    return { fontSize: getFontSize(props) };
  }, [props]);

  const focusHandler = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus(e);
  };
  const blurHandler = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur(e);
  };

  const toggleTextVisibility = useCallback(() => {
    setTextShown((pre) => !pre);
  }, []);

  return (
    <View
      style={[
        styles.container,
        horizontal && styles.horizontalContainer,
        containerStyle,
      ]}
    >
      {!!label && (
        <BaseText
          semibold
          {...labelProps}
          style={[styles.labelStyle, labelStyle]}
        >
          {label}
        </BaseText>
      )}
      <View
        style={[
          styles.inputContainer,
          commonStyles.rowItemsCenter,
          inputContainerStyle,
        ]}
      >
        <TextInput
          placeholder='Type Something ..'
          //   placeholderTextColor={inputPlaceHolder}
          secureTextEntry={!textShown}
          {...otherProps}
          style={[
            weightStyles,
            sizeStyles,
            styles.input,
            isFocused && styles.focusedInput,
            !!error && styles.errorOutline,
            otherProps.style ?? {},
          ]}
          onFocus={focusHandler}
          onBlur={blurHandler}
        />
        {isPassword && (
          <IconButton
            name={textShown ? 'eye-off' : 'eye'}
            size={20}
            iconStyle={styles.passwordIcon}
            containerStyle={styles.passwordIconContainer}
            onPress={toggleTextVisibility}
          />
        )}
      </View>
      {error && (
        <BaseText style={[styles.errorText]} medium>
          Please enter email
        </BaseText>
      )}
    </View>
  );
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      gap: 5,
      margin: 2,
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputContainer: {
      flexGrow: 1,
      gap: 8,
    },
    input: {
      fontSize: 18,
      padding: 10,
      textAlignVertical: 'center',
      color: colors.text,
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderRadius: 15,
    },
    focusedInput: {
      color: colors.inputFocusTint,
      padding: 8,
      borderWidth: 2,
      borderColor: colors.inputFocusTint,
    },
    labelStyle: {
      marginHorizontal: 10,
    },
    passwordIcon: {
      color: colors.secondary,
    },
    passwordIconContainer: {
      backgroundColor: colors.inputBackground,
      padding: 10,
      borderRadius: 15,
    },
    errorText: {
      color: colors.error,
      marginHorizontal: 10,
    },
    errorOutline: {
      borderColor: colors.error,
      borderWidth: 2,
      padding: 8,
    },
  }));
