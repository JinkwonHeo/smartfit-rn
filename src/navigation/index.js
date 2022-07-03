import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserAuth } from '../context/AuthContext';
import Auth from './Auth';
import Home from './Home';

function NavigationIndex() {
  const { currUser } = UserAuth();

  return (
    <NavigationContainer>{!currUser ? <Auth /> : <Home />}</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
});

export default NavigationIndex;
