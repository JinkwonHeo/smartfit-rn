import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { PermissionState } from '../context/PermissionContext';
import TrainerExerciseModePoseDetect from '../components/TrainerExerciseModePoseDetect';

export default function TrainerExerciseScreen({ route }) {
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
        source={{
          uri: route.params.exerciseData.url,
        }}
      />
      <View style={styles.camera}>
        <TrainerExerciseModePoseDetect
          poseData={route.params.exerciseData.poseData}
          setPoseScore={setPoseScore}
        />
      </View>
      {!isUserReady && poseScore < 0.9 && (
        <Overlay
          onBackdropPress={toggleOverlay}
          overlayStyle={styles.overlay}
          backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          <Text style={styles.informText}>전신이 나오도록 서주세요!</Text>
          <Text style={styles.informText}>
            카메라 앞에 서면 운동이 시작됩니다!
          </Text>
        </Overlay>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  opacity: {
    opacity: 0.5,
  },
  overlay: {
    borderRadius: 30,
    position: 'absolute',
    top: 200,
    padding: 20,
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  informText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 3,
  },
});
