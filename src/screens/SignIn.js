import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { signIn } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { UserAuth } from '../context/AuthContext';
import { theme } from '../../theme';
import { validateEmail, removeWhitespace } from '../utils/utils';
import ErrorMessage from '../components/ErrorMessage';

const colors = theme.colors;

export default function SignIn({ navigation }) {
  const { setCurrUser } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const refPassword = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (e) {
      Alert.alert('Signin Error', e.message);
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate('signUp');
  };

  const handleEmailChange = (email) => {
    const changedEmail = removeWhitespace(email);
    setEmail(changedEmail);
    setErrorMessage(
      validateEmail(changedEmail) ? '' : 'Please check email form'
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/smartfit.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.viewMargin}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          onSubmitEditing={() => refPassword.current.focus()}
          style={styles.emailInputText}
        />
        <ErrorMessage message={errorMessage} />
        <TextInput
          ref={refPassword}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInputText}
        />
        <View style={styles.viewMargin}>
          <TouchableOpacity>
            <Button
              title="signIn"
              disabled={!password || !email}
              color={colors.secondary}
              onPress={handleSignIn}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ marginTop: 15 }} onPress={handleSignUpPress}>
          <Text style={styles.signupText}>Don't have an account? Join us!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.white,
  },
  signInText: {
    color: colors.foreground,
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 220,
    height: 220,
  },
  viewMargin: {
    marginTop: 20,
  },
  emailInputText: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    width: 200,
  },
  passwordInputText: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    width: 200,
    marginTop: 20,
  },
  signupText: {
    color: colors.secondaryText,
  },
});
