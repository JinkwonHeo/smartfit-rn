import React, { createRef, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseNet from '@tensorflow-models/posenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

import { renderPose, poseSimilarity } from '../utils/poseUtils';
import { CAMERA_SIZE } from '../constants/size';
import { theme } from '../../theme';

const colors = theme.colors;
const TensorCamera = cameraWithTensors(Camera);

function TrainerExerciseModePoseDetect({ poseData, setPoseScore }) {
  const [initSetting, setInitSetting] = useState({
    isTfReady: false,
    poseNetModel: null,
  });
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [pose, setPose] = useState(null);
  const [similarity, setSimilarity] = useState(0.3);
  const tensorCameraRef = createRef();
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
      tf.env().set('WEBGL_PACK_DEPTHWISECONV', false);
      await tf.ready();
      tf.getBackend();

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

          if (poseData && _predictions.score > 0.75) {
            const cosineDistance = poseSimilarity(
              poseData[index],
              _predictions
            );

            if (1 - cosineDistance < 0.55) {
              setSimilarity((1 - cosineDistance) * 0.9);
            } else if (1 - cosineDistance > 0.5) {
              setSimilarity(1 - cosineDistance + 0.2);
            }

            if (1 - cosineDistance > 0.5) {
              index++;

              if (index >= poseData.length) {
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
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modelResults}>
              {renderPose(pose, Math.floor(similarity * 100))}
            </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  camera: {
    position: 'absolute',
    width: CAMERA_SIZE.width,
    height: CAMERA_SIZE.height,
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
