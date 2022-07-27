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
          strokeWidth="2"
          fill="white"
          fontSize="45"
          fontWeight="bold"
          x="200"
          y="58"
          textAnchor="middle"
        >
          {rep < 30 ? `Rep: ${rep}` : `Similarity: ${rep}`}
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

export const poseSimilarity = (pose1, pose2) => {
  const poseVector1 = getPoseVector(pose1);
  const poseVector2 = getPoseVector(pose2);

  return cosineDistanceMatching(poseVector1, poseVector2);
};

function getPoseVector(pose) {
  const vector = [];

  const xPos = pose.keypoints.map((k) => k.position.x);
  const yPos = pose.keypoints.map((k) => k.position.y);

  let minX = Math.min(...xPos);
  let minY = Math.min(...yPos);

  for (let i = 0; i < xPos.length; i++) {
    vector.push(xPos[i]);
    vector.push(yPos[i]);
  }

  return vector;
}

function cosineDistanceMatching(poseVector1, poseVector2) {
  const cosineSimilarity = calculateSimilarity(poseVector1, poseVector2);
  const distance = 2 * (1 - cosineSimilarity);

  return Math.sqrt(distance);
}

function calculateSimilarity(poseVector1, poseVector2) {
  let dotProduct = 0;
  let subPoseVector1 = 0;
  let subPoseVector2 = 0;

  for (let i = 0; i < poseVector1.length; i++) {
    dotProduct += poseVector1[i] * poseVector2[i];
    subPoseVector1 += poseVector1[i] * poseVector1[i];
    subPoseVector2 += poseVector2[i] * poseVector2[i];
  }

  subPoseVector1 = Math.sqrt(subPoseVector1);
  subPoseVector2 = Math.sqrt(subPoseVector2);

  const similarity = dotProduct / (subPoseVector1 * subPoseVector2);

  return similarity;
}
