import React, { useRef, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseNet from '@tensorflow-models/posenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import { renderPose } from '../utils/poseUtils';
import useBasicExercise from '../hooks/useBasicExercise';
import { CAMERA_SIZE } from '../constants/size';
import { theme } from '../../theme';

const colors = theme.colors;
const TensorCamera = cameraWithTensors(Camera);

function Pose({ exerciseName, setPoseScore }) {
  const [initSetting, setInitSetting] = useState({
    isTfReady: false,
    poseNetModel: null,
  });
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [pose, setPose] = useState(null);
  const [rep] = useBasicExercise(pose, exerciseName);
  const tensorCameraRef = useRef();
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

  const estimatePoseNet = async (tensorImage) => {
    let _isEstimate = false;

    try {
      if (tensorImage && initSetting.poseNetModel) {
        const _predictions = await initSetting.poseNetModel.estimateSinglePose(
          tensorImage,
          { flipHorizontal: true }
        );

        if (_predictions) {
          setPose(_predictions);
          setPoseScore(_predictions.score);

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

  const onReadyTensorCamera = (images) => {
    const loop = async () => {
      const _tensorImage = images.next().value;

      await estimatePoseNet(_tensorImage);

      if (_tensorImage === undefined) {
        return;
      }

      _tensorImage.dispose();
      requestAnimationFrame(loop);
    };

    loop();
  };

  useEffect(() => {
    if (rep === 10) {
      navigation.goBack();
    }
  }, [rep]);

  return (
    <>
      <View style={styles.container}>
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
              onReady={onReadyTensorCamera}
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
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modelResults}>{renderPose(pose, rep)}</View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  camera: {
    position: 'absolute',
    width: CAMERA_SIZE.width,
    height: CAMERA_SIZE.height,
  },
  prevButtonWrapper: {
    flex: 0.1,
    alignSelf: 'center',
    zIndex: 13,
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    left: 5,
    zIndex: 13,
    margin: 10,
  },
  modelResults: {
    position: 'absolute',
    zIndex: 12,
    width: CAMERA_SIZE.width,
    height: CAMERA_SIZE.height,
  },
});
