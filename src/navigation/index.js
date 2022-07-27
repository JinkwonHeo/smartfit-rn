import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserAuth } from '../context/AuthContext';
import Auth from './Auth';
import Home from './Home';
import LoadingCircle from '../components/LoadingCircle';
import { LoadingState } from '../context/LoadingContext';

function NavigationIndex() {
  const { currUser } = UserAuth();
  const { loading } = LoadingState();

  if (loading) {
    <LoadingCircle />;
  }

  return (
    <NavigationContainer>{!currUser ? <Auth /> : <Home />}</NavigationContainer>
  );
}

export default NavigationIndex;
