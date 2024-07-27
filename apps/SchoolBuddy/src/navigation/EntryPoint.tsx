import React from 'react';
import { StackNavigation } from './stack/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { EntryWrapper } from './wrapper';

export const EntryPoint = () => {
  return (
    <EntryWrapper>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </EntryWrapper>
  );
};
