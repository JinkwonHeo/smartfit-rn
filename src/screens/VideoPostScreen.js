import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { uploadVideo } from '../utils/utils';

import { LoadingState } from '../context/LoadingContext';
import LoadingCircle from '../components/LoadingCircle';

export default function VideoPostScreen({ route, navigation }) {
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const { loading, setLoading } = LoadingState();
  const { uri, thumbnail, token } = route.params;

  const handlePost = async () => {
    if (exerciseTitle === '') {
      setTitleError('Exercise name required.');
      return;
    }

    setLoading(true);
    const user = auth.currentUser;
    let videoURL;

    if (uri) {
      const { uploadedURL, fileName } = await uploadVideo(
        uri,
        `videos/${user.uid}`,
        `${exerciseTitle}`
      );
      videoURL = uploadedURL;
    }

    const videoData = {
      videos: arrayUnion(...[{ title: exerciseTitle, url: videoURL }]),
    };

    await Promise.all([
      updateDoc(doc(db, 'users', user.uid), { ...videoData }),
    ]);

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
          style={styles.title}
          maxLength={50}
          placeholder="Exercise name"
          onChangeText={setExerciseTitle}
        />
        <Text style={styles.titleErrorText}>{titleError}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePost}>
          {loading ? (
            <LoadingCircle />
          ) : (
            <AntDesign name="check" style={styles.uploadIcon} />
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
    backgroundColor: 'white',
  },
  header: {
    height: '9%',
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
    backgroundColor: 'black',
    borderRadius: 15,
    width: '40%',
  },
  title: {
    height: 50,
    marginBottom: 10,
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
    fontSize: 38,
    color: '#2196F3',
  },
  titleErrorText: {
    color: 'red',
  },
});
