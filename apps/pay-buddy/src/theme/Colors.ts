import { ResourceType } from '@zustand';

export const STATIC_COLORS = {
  error: '#ff3b30',
  googleBlue: '#007AFF',
  success: '#4cd964',
};

export const ColorResource: ResourceType = {
  light: {
    primary: '#FFFFFF',
    secondary: '#000000',
    tint: '#3572EF',
    text: '#000000',
    dividerColor: '#F6F6F7',
    inputBackground: '#EEEEEE',
    inputFocusTint: '#3572EF',
    inputPlaceHolder: '#888888',
    cardBackgroundColor: '#FFFFFF',
    completedCardBackground: '#DAE6FB',
    modalBackgroundColor: '#000000AA',

    ...STATIC_COLORS,
  },
  dark: {
    primary: '#000000',
    secondary: '#FFFFFF',
    tint: '#83B4FF',
    text: '#FFFFFF',
    dividerColor: '#333333',
    inputBackground: '#333333',
    inputFocusTint: '#83B4FF',
    inputPlaceHolder: '#777777',
    cardBackgroundColor: '#222222',
    completedCardBackground: '#22223F',
    modalBackgroundColor: '#000000AA',

    ...STATIC_COLORS,
  },
};
