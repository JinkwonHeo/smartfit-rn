import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import Pose from '../components/Pose';
import { PermissionState } from '../context/PermissionContext';

export default function ExerciseScreen({ route }) {
  const { permissionStatus, setPermissionStatus } = PermissionState();
  const [poseScore, setPoseScore] = useState(0);
  const [isUserReady, setIsUserReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermissionStatus(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (poseScore > 0.5) {
      videoRef.current.playAsync();
      setIsUserReady(true);
    }
  }, [poseScore]);

  if (permissionStatus === '') {
    return <View />;
  }

  if (permissionStatus === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleOverlay = () => {
    setIsUserReady(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Video
        ref={videoRef}
        style={styles.video}
        resizeMode="contain"
        useNativeControls
        isLooping
        source={route.params.videoURI}
      />
      <View style={styles.camera}>
        <Pose
          exerciseName={route.params.exercise}
          setPoseScore={setPoseScore}
        />
      </View>
      {!isUserReady && (
        <Overlay onBackdropPress={toggleOverlay}>
          <Text>카메라 앞에 서면 운동이 시작됩니다!</Text>
        </Overlay>
      )}
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
