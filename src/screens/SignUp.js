import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { signUp } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { UserAuth } from '../context/AuthContext';
import { theme } from '../../theme';
import { validateEmail } from '../utils/utils';
import ErrorMessage from '../components/ErrorMessage';

const colors = theme.colors;

export default function SignIn() {
  const { setCurrUser } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const refPassword = useRef();
  const refPasswordConfirm = useRef();
  const refDidMount = useRef(null);

  useEffect(() => {
    setIsDisabled(!(email && password && passwordConfirm && !errorMessage));
  }, [email, password, passwordConfirm, errorMessage]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (refDidMount.current) {
      let error = '';

      if (!email) {
        error = 'Please type your email';
      } else if (!validateEmail(email)) {
        error = 'Invalid email form';
      } else if (password.length < 6) {
        error = 'Password must longer than 6';
      } else if (password !== passwordConfirm) {
        error = 'Password is not identical';
      }

      setErrorMessage(error);
    } else {
      refDidMount.current = true;
    }
  }, [email, password, passwordConfirm]);

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
    } catch (e) {
      Alert.alert('Signup Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signUpText}>Sign Up</Text>
      <View style={styles.viewMargin}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => refPassword.current.focus()}
          style={styles.emailInputText}
        />
        <TextInput
          ref={refPassword}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={() => refPasswordConfirm.current.focus()}
          style={styles.passwordInputText}
        />
        <TextInput
          ref={refPasswordConfirm}
          placeholder="PasswordConfirm"
          secureTextEntry
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          style={styles.passwordInputText}
        />
        <ErrorMessage message={errorMessage} />
        <View style={styles.viewMargin}>
          <TouchableOpacity>
            <Button
              title="signUp"
              disabled={isDisabled}
              color={colors.secondary}
              onPress={handleSignUp}
            />
          </TouchableOpacity>
        </View>
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
  signUpText: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
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
});
