import { View, ActivityIndicator } from 'react-native';
import React from 'react';

function LoadingCircle() {
  return (
    <View>
      <ActivityIndicator size="large" color="#33ABEF" />
    </View>
  );
}

export default LoadingCircle;
