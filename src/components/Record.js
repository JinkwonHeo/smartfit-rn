import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

const colors = theme.colors;

function Record({ navigation }) {
  const cameraRef = useRef(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isRecording, setIsRecording] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setIsRecording(true);
    (async () => {
      const cameraPermissionStatus =
        await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermissionStatus.status === 'granted');

      const audioPermissionStatus =
        await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioPermissionStatus.status === 'granted');

      if (
        cameraPermissionStatus.status !== 'granted' &&
        audioPermissionStatus.status !== 'granted'
      ) {
        navigation.navigate('Home');
      }
    })();
  }, []);

  const recordVideo = async () => {
    setIsRecording((prev) => !prev);
    if (cameraRef) {
      if (isRecording) {
        const options = {
          maxDuration: 30,
          maxFileSize: 10 * 1024 * 1024,
          quality: Camera.Constants.VideoQuality['4:3'],
        };

        const videoRecordPromise = cameraRef.current.recordAsync(options);

        if (videoRecordPromise) {
          const recordedVideo = await videoRecordPromise;

          navigation.navigate('recordResult', {
            recordedVideo,
            setIsRecording,
          });
        }
      } else {
        cameraRef.current.stopRecording();
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={isRecording ? colors.foreground : colors.red}
          translucent
        />
        {isFocused ? (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            ratio={'4:3'}
            type={cameraType}
            onCameraReady={() => setIsCameraReady(true)}
          />
        ) : null}
        <View style={{ flex: 1, backgroundColor: colors.black }}></View>
      </View>
      <View style={styles.sideBarContainer}>
        {!isRecording ? null : (
          <TouchableOpacity
            style={styles.sideBarButton}
            onPress={() =>
              setCameraType(
                cameraType === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }
          >
            <Feather name="refresh-ccw" size={24} color={colors.white} />
            <Text style={styles.iconText}>Flip</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottomBarContainer}>
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity
            disabled={!isCameraReady}
            onPress={recordVideo}
            style={styles.recordButton}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 5,
    top: 90,
    backgroundColor: colors.black,
  },
  bottomBarContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    marginBottom: 30,
  },
  recordButtonContainer: {
    flex: 1,
    marginHorizontal: 30,
  },
  recordButton: {
    borderWidth: 8,
    borderColor: colors.iconRed,
    backgroundColor: colors.iconRed,
    borderRadius: 100,
    height: 80,
    width: 80,
    alignSelf: 'center',
  },
  sideBarContainer: {
    top: 60,
    left: 0,
    position: 'absolute',
  },
  iconText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 5,
  },
  sideBarButton: {
    alignItems: 'center',
    marginBottom: 25,
  },
  flexContainer: {
    flex: 1,
  },
});

export default Record;
