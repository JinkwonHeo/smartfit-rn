import { useState, useEffect } from 'react';
import { getAngle } from '../utils/poseUtils';

function useBasicExercise(poseData, exerciseName) {
  const [rep, setRep] = useState(0);
  const [isRepCounted, setIsRepCounted] = useState(false);

  switch (exerciseName) {
    case 'squat':
      useEffect(() => {
        if (poseData) {
          if (
            getAngle(poseData, 'rightKnee') < 100 &&
            poseData.keypoints[12].position.y + 20 >
              poseData.keypoints[14].position.y &&
            !isRepCounted
          ) {
            setRep((prev) => prev + 1);
            setIsRepCounted(true);
          }

          if (getAngle(poseData, 'rightKnee') > 160) {
            setIsRepCounted(false);
          }
        }
      }, [poseData]);
      break;
    case 'pushUp':
      useEffect(() => {
        if (poseData) {
          if (
            getAngle(poseData, 'rightElbow') < 110 &&
            poseData.keypoints[0].position.y + 20 >
              poseData.keypoints[6].position.y &&
            !isRepCounted
          ) {
            setRep((prev) => prev + 1);
            setIsRepCounted(true);
          }

          if (getAngle(poseData, 'rightElbow') > 160) {
            setIsRepCounted(false);
          }
        }
      }, [poseData]);
    case 'lunge':
      useEffect(() => {
        if (poseData) {
          if (
            getAngle(poseData, 'rightKnee') < 100 &&
            getAngle(poseData, 'leftKnee') < 100 &&
            poseData.keypoints[6].position.x -
              poseData.keypoints[12].position.x <
              20 &&
            !isRepCounted
          ) {
            setRep((prev) => prev + 1);
            setIsRepCounted(true);
          }

          if (
            getAngle(poseData, 'rightKnee') > 160 &&
            getAngle(poseData, 'leftKnee') > 160
          ) {
            setIsRepCounted(false);
          }
        }
      }, [poseData]);
    case 'dumbbellCurl':
      useEffect(() => {
        if (poseData) {
          if (
            getAngle(poseData, 'rightElbow') < 45 &&
            poseData.keypoints[8].position.x -
              poseData.keypoints[6].position.x <
              50 &&
            !isRepCounted
          ) {
            setRep((prev) => prev + 1);
            setIsRepCounted(true);
          }

          if (getAngle(poseData, 'rightElbow') > 160) {
            setIsRepCounted(false);
          }
        }
      }, [poseData]);

      return [rep];
    default:
      return [rep];
  }

  return [rep];
}

export default useBasicExercise;
