import React from 'react';
import * as posenet from '@tensorflow-models/posenet';
import * as svgComponents from 'react-native-svg';
import { Dimensions } from 'react-native';
import { degreeTargets } from '../constants/degreeTargets';

const WINDOW_SIZE = Dimensions.get('window');

export const getWindowWidth = (windowSize) => {
  let size;

  if (Math.floor(windowSize.width % 4)) {
    size = Math.floor(windowSize.width) + 4 - Math.floor(windowSize.width % 4);
  }

  return size;
};

const CAMERA_SIZE = {
  height: getWindowWidth(WINDOW_SIZE),
  width: getWindowWidth(WINDOW_SIZE),
};

export const renderPose = (pose, rep) => {
  const MIN_KEYPOINT_SCORE = 0.5;

  if (pose) {
    const keypoints = pose.keypoints
      .filter((k) => k.score > MIN_KEYPOINT_SCORE)
      .map((k, i) => {
        return (
          <svgComponents.Circle
            key={`keypoints_${i}`}
            cx={k.position.x}
            cy={k.position.y}
            r="6"
            stroke="white"
            strokeWidth="2"
            fill="blue"
          />
        );
      });

    const adjanctKeypoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.7);

    const skeleton = adjanctKeypoints.map(([from, to], i) => {
      return (
        <svgComponents.Line
          key={`skeleton_${i}`}
          x1={from.position.x}
          y1={from.position.y}
          x2={to.position.x}
          y2={to.position.y}
          stroke="magenta"
          strokeWidth="3"
        />
      );
    });

    return (
      <svgComponents.Svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${CAMERA_SIZE.width} ${CAMERA_SIZE.height}`}
      >
        {skeleton}
        {keypoints}
        <svgComponents.Text
          stroke="black"
          strokeWidth="1"
          fill="black"
          fontSize="40"
          fontWeight="bold"
          x="80"
          y="30"
          textAnchor="middle"
        >
          Rep:{rep}
        </svgComponents.Text>
      </svgComponents.Svg>
    );
  } else {
    return null;
  }
};

export const getAngle = (poseData, targetName) => {
  if (poseData) {
    if (poseData.keypoints[degreeTargets[targetName][1]].score > 0.3) {
      const rad =
        Math.atan2(
          poseData.keypoints[degreeTargets[targetName][0]].position.y -
            poseData.keypoints[degreeTargets[targetName][1]].position.y,
          poseData.keypoints[degreeTargets[targetName][0]].position.x -
            poseData.keypoints[degreeTargets[targetName][1]].position.x
        ) -
        Math.atan2(
          poseData.keypoints[degreeTargets[targetName][2]].position.y -
            poseData.keypoints[degreeTargets[targetName][1]].position.y,
          poseData.keypoints[degreeTargets[targetName][2]].position.x -
            poseData.keypoints[degreeTargets[targetName][1]].position.x
        );

      const degree = Math.floor(Math.abs(rad * (180 / Math.PI)));

      return degree > 190 ? Math.abs(degree - 360) : degree;
    } else {
      return 'keypoints score is low';
    }
  } else {
    return;
  }
};

export const saveFile = async () => {
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

export const keypoints = () => {};
