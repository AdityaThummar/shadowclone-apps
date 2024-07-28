import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from './StackNavigator';
import { EntryWrapper, ThemeWrapper } from '@components';
import { ColorResource } from '../theme';
import { AppWrapper } from '../helper';

export const EntryPoint = () => {
  return (
    <ThemeWrapper resources={ColorResource}>
      <AppWrapper>
        <EntryWrapper>
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </EntryWrapper>
      </AppWrapper>
    </ThemeWrapper>
  );
};
