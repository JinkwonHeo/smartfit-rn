import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../../theme';

const colors = theme.colors;

function ErrorMessage({ message }) {
  if (message.length > 1) {
    return <Text style={styles.container}>{message}</Text>;
  }

  if (message.length <= 1) {
    return <Text testID="noMessage"></Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: '100%',
    height: 20,
    marginBottom: 10,
    lineHeight: 20,
    color: colors.red,
  },
});

export default ErrorMessage;
