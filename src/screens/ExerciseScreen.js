import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';

export default function ExerciseScreen({ route }) {
  const [permissionStatus, setPermissionStatus] = useState('');
  const [type, setType] = useState('front');

  console.log(route);

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
      <Video
        style={styles.video}
        resizeMode="contain"
        useNativeControls
        isLooping
        source={route.params.videoURI}
      />
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(type === 'back' ? 'front' : 'back');
            }}
          >
            <Text style={styles.text}> Flip </Text>
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
    flex: 0.9,
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
    alignSelf: 'auto',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.15,
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
});
