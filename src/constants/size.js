import { Dimensions } from 'react-native';

const WINDOW_SIZE = Dimensions.get('window');

const getWindowWidth = (windowSize) => {
  let size;

  if (Math.floor(windowSize.width % 4)) {
    size = Math.floor(windowSize.width) + 4 - Math.floor(windowSize.width % 4);
  }

  return size;
};

export const CAMERA_SIZE = {
  height: getWindowWidth(WINDOW_SIZE),
  width: getWindowWidth(WINDOW_SIZE),
};

export const SCREEN_SIZE = {
  height: WINDOW_SIZE.height,
  width: WINDOW_SIZE.width,
};
