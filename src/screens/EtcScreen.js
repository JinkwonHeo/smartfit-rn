import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { theme } from '../../theme';

const colors = theme.colors;

export default function EtcScreen() {
  const { setCurrUser } = UserAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrUser(null);
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button
          title="Sign out"
          color={colors.secondary}
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    flex: 1,
    marginTop: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
