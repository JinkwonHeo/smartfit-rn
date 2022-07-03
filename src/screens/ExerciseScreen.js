import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

export default function ExerciseScreen({ route }) {
  const [permissionStatus, setPermissionStatus] = useState('');
  const [type, setType] = useState('front');

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
      <Camera style={styles.camera} type={type} ratio={'1:1'}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(type === 'back' ? 'front' : 'back');
            }}
          >
            <MaterialIcons
              name="flip-camera-android"
              size={30}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
      </Camera>
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
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
});
