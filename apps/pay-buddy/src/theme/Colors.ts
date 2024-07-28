import { ResourceType } from '@zustand';

export const STATIC_COLORS = {
  error: '#ff3b30',
  googleBlue: '#007AFF',
};

export const ColorResource: ResourceType = {
  light: {
    primary: '#FFFFFF',
    secondary: '#000000',
    tint: '#3572EF',

    text: '#000000',

    inputBackground: '#EEEEEE',
    inputFocusTint: '#3572EF',
    inputPlaceHolder: '#888888',

    ...STATIC_COLORS,
  },
  dark: {
    primary: '#000000',
    secondary: '#FFFFFF',
    tint: '#83B4FF',

    text: '#FFFFFF',

    inputBackground: '#333333',
    inputFocusTint: '#83B4FF',
    inputPlaceHolder: '#777777',

    ...STATIC_COLORS,
  },
};
