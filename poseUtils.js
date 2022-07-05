import React from 'react';
import * as posenet from '@tensorflow-models/posenet';
import * as svgComponents from 'react-native-svg';

const CAMERA_SIZE = { height: 400, width: 400 };

export const renderPose = (pose) => {
  const MIN_KEYPOINT_SCORE = 0.6;

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
            strokeWidth="2"
            fill="white"
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
          strokeWidth="0.5"
          fill="white"
          fontSize="30"
          fontWeight="bold"
          x="80"
          y="30"
          textAnchor="middle"
        >
          {100}
        </svgComponents.Text>
      </svgComponents.Svg>
    );
  } else {
    return null;
  }
};
