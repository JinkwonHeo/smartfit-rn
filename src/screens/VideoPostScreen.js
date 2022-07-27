import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { uploadImage, uploadVideo } from '../utils/utils';

import { LoadingState } from '../context/LoadingContext';
import LoadingCircle from '../components/LoadingCircle';
import { SERVER_URL } from '@env';
import { theme } from '../../theme';

const colors = theme.colors;

export default function VideoPostScreen({ route, navigation }) {
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const { loading, setLoading } = LoadingState();
  const { uri, thumbNail } = route.params;

  const handlePost = async () => {
    if (exerciseTitle === '') {
      setTitleError('Exercise name required.');

      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    const user = auth.currentUser;
    let videoURL;
    let videoFileName;
    let thumbnailURL;

    if (uri) {
      const { uploadedURL, fileName } = await uploadVideo(
        uri,
        `videos/${user.uid}`,
        `${exerciseTitle}`
      );
      const { url } = await uploadImage(
        thumbNail,
        `images/${user.uid}`,
        `${exerciseTitle}`
      );
      videoURL = uploadedURL;
      videoFileName = fileName;
      thumbnailURL = url;

      if (url) {
        ToastAndroid.show(
          'Upload success! \n ...tensorflow processing...',
          ToastAndroid.LONG
        );
      }
    }

    const uploadToFireStore = async () => {
      const result = await axios.post(`${SERVER_URL}/api/tensorflows/posenet`, {
        user: auth.currentUser.uid,
        url: videoURL,
        fileName: videoFileName,
        thumbnail: thumbnailURL,
      });

      if (result) {
        const videoData = {
          videos: arrayUnion(...[result.data]),
        };

        await updateDoc(doc(db, 'users', user.uid), { ...videoData });

        ToastAndroid.showWithGravityAndOffset(
          'Video analyze complete!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    };

    uploadToFireStore();

    setLoading(false);
    navigation.navigate('mainNav');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Upload Video</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri }} style={styles.mediaPreview} />
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.textInput}
          maxLength={20}
          placeholder="Exercise name"
          onChangeText={setExerciseTitle}
        />
        <Text style={styles.titleErrorText}>{titleError}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePost}>
          {loading ? (
            <View style={styles.loadingCircle}>
              <LoadingCircle />
            </View>
          ) : (
            <AntDesign name="cloudupload" style={styles.uploadIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: colors.white,
  },
  header: {
    marginTop: 20,
    height: '10%',
    flexDirection: 'row',
  },
  backButton: {
    flex: 1,
    marginLeft: 10,
  },
  pageTitle: {
    flex: 5,
    fontSize: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  mediaPreview: {
    aspectRatio: 9 / 16,
    backgroundColor: colors.black,
    borderRadius: 15,
    width: '40%',
  },
  textInput: {
    width: '100%',
    height: 50,
    marginBottom: 5,
    marginTop: 30,
    borderBottomWidth: 2,
  },
  infoContainer: {
    margin: 20,
    flex: 1,
    flexDirection: 'column',
    marginRight: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    right: 5,
    top: 40,
    position: 'absolute',
  },
  uploadIcon: {
    marginTop: 20,
    fontSize: 38,
    color: colors.foreground,
  },
  loadingCircle: {
    marginTop: 20,
    fontSize: 38,
  },
  titleErrorText: {
    color: colors.red,
  },
});
