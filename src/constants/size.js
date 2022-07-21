import { Dimensions } from 'react-native';
import { getWindowWidth } from '../utils/poseUtils';

const WINDOW_SIZE = Dimensions.get('window');

export const CAMERA_SIZE = {
  height: getWindowWidth(WINDOW_SIZE),
  width: getWindowWidth(WINDOW_SIZE),
};

export const SCREEN_SIZE = {
  height: WINDOW_SIZE.height,
  width: WINDOW_SIZE.width,
};
