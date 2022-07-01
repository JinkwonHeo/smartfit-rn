import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserAuth } from '../context/AuthContext';
import { LoadingState } from '../context/LoadingContext';
import Auth from './Auth';
import Home from './Home';
import LoadingCircle from '../components/LoadingCircle';

function NavigationIndex() {
  const { currUser } = UserAuth();
  const { loading } = LoadingState();

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingCircle />
      </View>
    );
  }

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
