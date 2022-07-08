import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const pickImage = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.3,
  });

  return result;
};

export const askForPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  return status;
};

export const uploadImage = async (uri, path, fName) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const fileName = fName || nanoid();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);

  const snapshot = await uploadBytes(imageRef, blob, {
    contentType: 'image/jpeg',
  });

  blob.close();

  const url = await getDownloadURL(snapshot.ref);

  return { url, fileName };
};

export const uploadVideo = async (uri, path, fName) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const fileName = fName || nanoid();
  const videoRef = ref(storage, `${path}/${fileName}.mp4`);

  const snapshot = await uploadBytes(videoRef, blob);

  blob.close();

  const uploadedURL = await getDownloadURL(snapshot.ref);

  return { uploadedURL, fileName };
};

export const validateEmail = (email) => {
  const emailValidation =
    /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;
  return emailValidation.test(email);
};

export const removeWhitespace = (text) => {
  const t1 = text.replace(/\n/g, '');
  const t2 = t1.replace(/\r/g, '');
  const t3 = t2.replace(/\s*/g, '');
  return t3;
};
