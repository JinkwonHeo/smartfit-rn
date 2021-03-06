import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Asset } from 'expo-asset';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { pickImage, askForPermission, uploadImage } from '../utils/utils';
import { auth, db } from '../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { PermissionState } from '../context/PermissionContext';
import { LoadingState } from '../context/LoadingContext';
import LoadingCircle from '../components/LoadingCircle';
import { theme } from '../../theme';

const colors = theme.colors;
const DEFAULT_PHOTO = Asset.fromModule(require('../../assets/face.png')).uri;

export default function Profile() {
  const [displayName, setDisplayName] = useState('');
  const [selectedImage, setSelectedImage] = useState(DEFAULT_PHOTO);
  const { loading, setLoading } = LoadingState();
  const { permissionStatus, setPermissionStatus } = PermissionState();

  useEffect(() => {
    setLoading(false);
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);

  const handlePress = async () => {
    setLoading(true);
    const user = auth.currentUser;
    let photoURL;

    if (selectedImage) {
      const { url } = await uploadImage(
        selectedImage,
        `images/${user.uid}`,
        'profilePicture'
      );
      photoURL = url;
    }

    const userData = {
      displayName,
      email: user.email,
    };

    if (photoURL) {
      userData.photoURL = photoURL;
    }

    await Promise.all([
      updateProfile(user, userData),
      setDoc(doc(db, 'users', user.uid), {
        ...userData,
        uid: user.uid,
        liked: 0,
        likeTrainers: [],
        videos: [],
      }),
    ]);

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
        <Text style={{ fontSize: 22, color: colors.foreground }}>
          Profile Info
        </Text>
        <Text style={styles.profileSubtext}>
          Please provide your name and an optional profile photo
        </Text>
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
                name="camera-plus"
                style={styles.cameraIcon}
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
          style={styles.namePlaceholder}
        />
        {loading && <LoadingCircle />}
        <View style={styles.buttonWrapper}>
          <Button
            title="Next"
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
  cameraIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
  },
  namePlaceholder: {
    width: '100%',
    marginTop: 40,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  buttonWrapper: {
    width: 80,
    marginTop: 'auto',
  },
});
