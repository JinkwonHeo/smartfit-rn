import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { auth } from '../utils/firebase';
import { theme } from '../../theme';

const colors = theme.colors;

export default function RecordResultScreen({ route, navigation }) {
  const videoRef = useRef(null);
  const [token, setToken] = useState(null);
  const { recordedVideo, setIsRecording } = route.params;
  const uri = recordedVideo.uri;
  const isFocused = useIsFocused();

  useState(async () => {
    const userToken = await auth.currentUser.getIdToken(true);
    setIsRecording(true);
    setToken(userToken);
  }, []);

  const generateThumbnail = async (videoUrl) => {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time: 4000,
    });

    return uri;
  };

  const postVideo = async () => {
    videoRef.current.pauseAsync();

    if (token) {
      try {
        const thumbNail = await generateThumbnail(uri);

        navigation.navigate('videoPost', { uri, thumbNail, token });
      } catch (error) {
        navigation.goBack();
      }
    } else {
      navigation.navigate('signIn');
    }
  };

  useEffect(() => {
    if (isFocused) {
      videoRef.current.playAsync();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri }}
        isLooping
        useNativeControls
        resizeMode="contain"
        shouldPlay
      />
      <View style={styles.headerContainer}>
        <View style={styles.buttonBox}>
          <TouchableOpacity onPress={postVideo} style={styles.button}>
            <Text style={styles.next}>confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    width: '100%',
    marginTop: 50,
    paddingHorizontal: 10,
  },
  button: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  next: {
    fontSize: 15,
    color: colors.black,
  },
});
