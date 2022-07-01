import React from 'react';
import { StyleSheet, Text } from 'react-native';

function ErrorMessage({ message }) {
  if (message.length > 1) {
    return <Text style={styles.container}>{message}</Text>;
  }

  if (message.length <= 1) {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: '100%',
    height: 20,
    marginBottom: 10,
    lineHeight: 20,
    color: 'red',
  },
});

export default ErrorMessage;
