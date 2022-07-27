import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { pickImage, askForPermission, uploadImage } from '../utils/utils';
import { auth, db } from '../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { PermissionState } from '../context/PermissionContext';
import { LoadingState } from '../context/LoadingContext';
import LoadingCircle from '../components/LoadingCircle';
import { theme } from '../../theme';

const colors = theme.colors;

export default function EditProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user.displayName);
  const [originalDescription, setOriginalDescription] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(user.photoURL);
  const { loading, setLoading } = LoadingState();
  const { permissionStatus, setPermissionStatus } = PermissionState();

  useEffect(async () => {
    setLoading(false);
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDescription(docSnap.data().description);
      setOriginalDescription(docSnap.data().description);
    }
  }, []);

  const handlePress = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const user = auth.currentUser;
    const userData = {};
    let photoURL;

    if (selectedImage !== user.photoURL) {
      const { url } = await uploadImage(
        selectedImage,
        `images/${user.uid}`,
        'profilePicture'
      );
      photoURL = url;
      userData.photoURL = photoURL;
    }

    if (
      description !== originalDescription ||
      displayName !== user.displayName
    ) {
      userData.displayName = displayName;
      userData.description = description;

      await Promise.all([
        updateProfile(user, userData),
        updateDoc(doc(db, 'users', user.uid), {
          ...userData,
        }),
      ]).then(() => {
        ToastAndroid.showWithGravityAndOffset(
          '수정되었습니다.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      });
    }

    navigation.goBack();
    setLoading(false);
  };

  const handleProfilePicture = async () => {
    const result = await pickImage();
    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  if (!permissionStatus) {
    return (
      <View>
        <LoadingCircle />
      </View>
    );
  }

  if (permissionStatus !== 'granted') {
    return <Text>You need to allow this permission</Text>;
  }

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleProfilePicture}
          style={styles.imageWrapper}
        >
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={colors.iconGray}
              size={45}
            />
          ) : (
            <>
              <Image source={{ uri: selectedImage }} style={styles.image} />
              <MaterialCommunityIcons
                name="swap-horizontal-circle"
                style={styles.exchangeIcon}
                color={colors.iconGray}
                size={45}
              />
            </>
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Type your name"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.textInput}
        />
        <TextInput
          placeholder="한 줄 소개"
          value={description}
          onChangeText={setDescription}
          style={styles.textInput}
        />
        {loading && <LoadingCircle />}
        <View style={styles.buttonWrapper}>
          <Button
            title="Done"
            color={colors.secondary}
            onPress={handlePress}
            disabled={!displayName}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: Constants.statusBarHeight + 20,
  },
  profileInfoText: {
    fontSize: 22,
    color: colors.foreground,
  },
  profileSubtext: {
    marginTop: 20,
    fontSize: 14,
    color: colors.text,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    marginTop: 30,
    borderRadius: 120,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
  },
  exchangeIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
  },
  textInput: {
    width: '90%',
    marginTop: 40,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  buttonWrapper: {
    width: 80,
    marginTop: 'auto',
  },
});
