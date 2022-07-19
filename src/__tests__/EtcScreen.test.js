import React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import EtcScreen from '../screens/EtcScreen';
import { AuthContextProvider } from '../context/AuthContext';
describe('Etc Screen Test', () => {
  afterEach(() => {
    cleanup();
  });

  it('test', () => {
    const { getByText } = render(
      <AuthContextProvider>
        <EtcScreen />
      </AuthContextProvider>
    );

    const status = getByText('My List');
    expect(status).toBeTruthy();
  });
});
