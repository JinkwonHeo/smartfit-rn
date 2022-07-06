import React, { createRef, useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, View, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import * as tf from '@tensorflow/tfjs';
import * as poseNet from '@tensorflow-models/posenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import { PermissionState } from '../context/PermissionContext';
import { ExerciseDataState } from '../context/ExerciseDataContext';

import { renderPose, getAngle } from '../utils/poseUtils';
import useBasicExercise from '../hooks/useBasicExercise';
import { CAMERA_SIZE } from '../constants/size';

const TensorCamera = cameraWithTensors(Camera);
const { StorageAccessFramework } = FileSystem;

function Pose({ exerciseName }) {
  const [initSetting, setInitSetting] = useState({
    isTfReady: false,
    poseNetModel: null,
  });
  const [isScreenTouched, setIsScreenTouched] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [pose, setPose] = useState(null);
  const [rep] = useBasicExercise(pose, exerciseName);
  const tensorCameraRef = createRef();
  const { permission } = PermissionState();
  const { exerciseData, setExerciseData } = ExerciseDataState();
  const navigation = useNavigation();

  const textureDims =
    Platform.OS === 'ios'
      ? { height: 1920, width: 1080 }
      : { height: 1200, width: 1600 };

  useEffect(() => {
    (async () => {
      await initialSetting();
    })();
  }, []);

  const initialSetting = async () => {
    let _isTensorReady = false;
    let _poseNet = null;

    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw Error(`[-] Camera permissions are not granted.`);
    }

    try {
      const isBackendMethodReady = await tf.setBackend('rn-webgl');

      if (isBackendMethodReady) {
        console.log('[+] Tensorflow Ready!');
        _isTensorReady = true;
        tf.engine().startScope();
      }
    } catch (error) {
      throw Error(`[-] Tensorflow Ready Error: ${error}`);
    }

    try {
      const _poseNetModel = await poseNet.load();

      if (_poseNetModel) {
        _poseNet = _poseNetModel;
      }
    } catch (error) {
      throw Error(`[-] PoseNet Model Load Error: ${error}`);
    }

    setInitSetting({
      isTfReady: _isTensorReady,
      poseNetModel: _poseNet,
    });
  };

  const fn_estimatePoseNet = async (tensorImage) => {
    let _isEstimate = false;

    try {
      if (tensorImage && initSetting.poseNetModel) {
        const _predictions = await initSetting.poseNetModel.estimateSinglePose(
          tensorImage,
          { flipHorizontal: true }
        );

        if (_predictions) {
          setPose(_predictions);

          if (_predictions.score > 0.85) {
            setExerciseData((prev) => prev.concat(_predictions));
          }

          const exerciseFile = JSON.stringify(exerciseData);

          const saveFile = async () => {
            if (permission.granted) {
              const directoryUri = permission.directoryUri;
              const data = exerciseFile;
              await StorageAccessFramework.createFileAsync(
                directoryUri,
                'exercise.json',
                'application/json'
              )
                .then(async (fileUri) => {
                  console.log('file saved');
                  await FileSystem.writeAsStringAsync(fileUri, data, {
                    encoding: FileSystem.EncodingType.UTF8,
                  });
                })
                .catch((e) => {
                  console.log(e);
                });
            } else {
              alert('you must allow permission to save.');
            }
          };

          if (exerciseData.length > 20) {
            // saveFile();
          }

          if (_predictions.score > 0.3) {
            _isEstimate = true;
          }
        }
      }
    } catch (error) {
      tf.engine().endScope();
      throw Error(`poseNet Estimate Error : ${error}`);
    }

    if (!tensorImage) {
      return;
    }

    return _isEstimate;
  };

  const fn_onReadyTensorCamera = (images) => {
    const loop = async () => {
      const _tensorImage = images.next().value;

      await fn_estimatePoseNet(_tensorImage);

      if (_tensorImage === undefined) return;
      _tensorImage.dispose();
      requestAnimationFrame(loop);
    };

    loop();
  };

  const handleExit = () => {
    navigation.goBack();
  };

  const handleScreenTouched = () => {
    setIsScreenTouched(true);
    setTimeout(() => {
      setIsScreenTouched(false);
    }, 5000);
  };

  useEffect(() => {
    return () => clearTimeout();
  }, [isScreenTouched]);

  useEffect(() => {
    if (rep === 10) {
      navigation.goBack();
    }
  }, [rep]);

  return (
    <>
      <View style={styles.container} onTouchEnd={handleScreenTouched}>
        {initSetting.isTfReady && initSetting.poseNetModel && (
          <>
            <TensorCamera
              ref={tensorCameraRef}
              style={styles.camera}
              type={type}
              cameraTextureHeight={textureDims.height}
              cameraTextureWidth={textureDims.width}
              resizeHeight={CAMERA_SIZE.height}
              resizeWidth={CAMERA_SIZE.width}
              resizeDepth={3}
              autorender={true}
              useCustomShadersToResize={false}
              onReady={fn_onReadyTensorCamera}
              ratio={'16:9'}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.front
                      ? Camera.Constants.Type.back
                      : Camera.Constants.Type.front
                  );
                }}
              >
                <MaterialIcons
                  name="flip-camera-android"
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
            {isScreenTouched && (
              <View style={styles.prevButtonWrapper}>
                <Button title="End" onPress={handleExit} color={'#518cad'} />
              </View>
            )}

            <View style={styles.modelResults}>{renderPose(pose, rep)}</View>
            {pose && (
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText} key={`item-0`}>
                  {getAngle(pose, 'rightElbow')}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
}

export default Pose;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    position: 'absolute',
    width: CAMERA_SIZE.width,
    height: CAMERA_SIZE.height,
  },
  prevButtonWrapper: {
    flex: 0.1,
    zIndex: 13,
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    zIndex: 13,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
  },
  modelResults: {
    position: 'absolute',
    width: CAMERA_SIZE.width,
    height: CAMERA_SIZE.height,
    zIndex: 12,
  },
  scoreTextContainer: {
    zIndex: 11,
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  scoreText: {
    paddingVertical: 2,
    fontSize: 90,
  },
});
