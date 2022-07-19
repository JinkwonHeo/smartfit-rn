import React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import HomeScreen from '../screens/HomeScreen';
import { LoadingContextProvider } from '../context/LoadingContext';

describe('Home Screen Test', () => {
  afterEach(() => {
    cleanup();
  });

  it('Should render Exercise Lists header title', () => {
    const { getByText } = render(
      <LoadingContextProvider>
        <HomeScreen />
      </LoadingContextProvider>
    );

    const status = getByText('Exercise Lists');
    expect(status).toBeTruthy();
  });
});
