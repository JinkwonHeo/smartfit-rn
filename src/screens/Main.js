import { View, StyleSheet, Text } from 'react-native';
import React from 'react';

export default function Main() {
  return (
    <View style={styles.container}>
      <Text>this is main screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
});
