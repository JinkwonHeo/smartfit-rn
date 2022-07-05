import React, { createRef, useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, View } from 'react-native';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import * as tf from '@tensorflow/tfjs';
import * as poseNet from '@tensorflow-models/posenet';

import { renderPose } from '../../poseUtils';

const CAMERA_SIZE = { height: 400, width: 400 };
const TensorCamera = cameraWithTensors(Camera);

function Pose() {
  const [initSetting, setInitSetting] = useState({
    isTfReady: false,
    poseNetModel: null,
  });
  const [isScreenTouched, setIsScreenTouched] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [pose, setPose] = useState(null);
  const navigation = useNavigation();
  const tensorCameraRef = createRef();

  const textureDims =
    Platform.OS === 'ios'
      ? { height: 1920, width: 1080 }
      : { height: 1200, width: 1600 };

  useEffect(() => {
    (async () => {
      await fn_initSetting();
    })();
  }, []);

  const fn_initSetting = async () => {
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
          // console.log(_predictions.keypoints);
          setPose(_predictions);

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
              ratio={'1:1'}
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
            <View style={styles.modelResults}>{renderPose(pose)}</View>
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
    width: '100%',
    height: '100%',
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
    width: '100%',
    height: '100%',
    zIndex: 12,
  },
});
