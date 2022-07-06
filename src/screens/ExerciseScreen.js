import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import Pose from '../components/Pose';

export default function ExerciseScreen({ route }) {
  const [permissionStatus, setPermissionStatus] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermissionStatus(status === 'granted');
    })();
  }, []);

  if (permissionStatus === '') {
    return <View />;
  }

  if (permissionStatus === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Video
        style={styles.video}
        resizeMode="contain"
        useNativeControls
        isLooping
        source={route.params.videoURI}
      />
      <View style={styles.camera}>
        <Pose exerciseName={route.params.exercise} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 0.989,
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
