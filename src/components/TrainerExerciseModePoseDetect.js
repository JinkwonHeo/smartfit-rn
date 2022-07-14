import React, { createRef, useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseNet from '@tensorflow-models/posenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import { renderPose, poseSimilarity } from '../utils/poseUtils';
import { CAMERA_SIZE } from '../constants/size';

const TensorCamera = cameraWithTensors(Camera);

function TrainerExerciseModePoseDetect({ poseData, setPoseScore }) {
  const [initSetting, setInitSetting] = useState({
    isTfReady: false,
    poseNetModel: null,
  });
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [pose, setPose] = useState(null);
  const [rep, setRep] = useState(0);
  const tensorCameraRef = createRef();
  const navigation = useNavigation();
  let index = 0;

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

          if (poseData && _predictions.score > 0.75) {
            const cosineDistance = poseSimilarity(
              poseData[index],
              _predictions
            );

            console.log('index: ', index);
            console.log('cosineDistance: ', cosineDistance);
            console.log('정확도: ', 1 - cosineDistance);

            if (cosineDistance < 0.52) {
              index++;

              if (index >= poseData.length) {
                setRep((prev) => prev + 1);
                index = 0;
              }
            }
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
                  size={35}
                  color={'white'}
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

export default TrainerExerciseModePoseDetect;

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
    position: 'absolute',
    top: 20,
    left: 5,
    margin: 10,
    zIndex: 13,
  },
  modelResults: {
    position: 'absolute',
    width: CAMERA_SIZE.width,
    height: CAMERA_SIZE.height,
    zIndex: 12,
  },
});
