import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { auth, signIn, signInWithGoogle } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Asset } from 'expo-asset';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { SCREEN_SIZE } from '../constants/size';
import { UserAuth } from '../context/AuthContext';
import { theme } from '../../theme';
import { validateEmail, removeWhitespace } from '../utils/utils';
import ErrorMessage from '../components/ErrorMessage';
import { CLIENT_ID } from '@env';

const colors = theme.colors;
WebBrowser.maybeCompleteAuthSession();

export default function SignIn({ navigation }) {
  const { setCurrUser } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const googleButtonImage = Asset.fromModule(
    require('../../assets/google-button.png')
  );

  const refPassword = useRef();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: CLIENT_ID,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(async () => {
    signInWithGoogle(response);
  }, [response]);

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
        source={require('../../assets/smartfit-removebg_upscale_cut.png')}
        style={styles.logoImage}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../assets/titleImage.jpg')}
        style={styles.titleImage}
      ></ImageBackground>
      <View style={styles.loginComponents}>
        <View style={styles.viewMargin}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="white"
            value={email}
            onChangeText={handleEmailChange}
            onSubmitEditing={() => refPassword.current.focus()}
            style={styles.emailInputText}
          />
          <ErrorMessage message={errorMessage} />
          <TextInput
            ref={refPassword}
            placeholder="Password"
            placeholderTextColor="white"
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
          <View style={styles.viewMargin}>
            <TouchableOpacity
              onPress={() => {
                promptAsync();
              }}
            >
              <Image
                source={googleButtonImage}
                style={styles.googleButtonImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.viewMargin}></View>
          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={handleSignUpPress}
          >
            <Text style={styles.signupText}>
              Don't have an account? Join us!
            </Text>
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
  loginComponents: {
    marginTop: 320,
  },
  logoImage: {
    position: 'absolute',
    top: SCREEN_SIZE.height / 16,
    left: SCREEN_SIZE.width / 100,
    width: 120,
    height: 120,
    zIndex: 1,
  },
  titleImage: {
    position: 'absolute',
    right: 0,
    width: SCREEN_SIZE.width + 50,
    height: SCREEN_SIZE.height + 100,
    resizeMode: 'cover',
    backgroundColor: 'black',
  },
  viewMargin: {
    marginTop: 20,
  },
  googleButtonImage: {
    width: 220,
  },
  emailInputText: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    width: 220,
  },
  passwordInputText: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    width: 220,
    marginTop: 10,
  },
  signupText: {
    color: colors.white,
  },
});
