import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../theme';
import { StatusBar } from 'expo-status-bar';

const colors = theme.colors;
const WINDOW_SIZE = Dimensions.get('window');

function TrainerSpecificModal({
  isModal,
  setIsModal,
  modalData,
  likeTrainers,
  moveToTrainerExerciseList,
  setLikeTrainers,
  trainersData,
  setTrainersData,
  isLikeChanged,
  setIsLikeChanged,
}) {
  const [likeTouchedCount, setLikeTouchedCount] = useState(0);
  const user = auth.currentUser;

  const handleLikeTouched = async () => {
    setLikeTrainers((prev) => prev.concat(modalData.email));
    setIsLikeChanged(true);
    setLikeTouchedCount(likeTouchedCount + 1);
  };

  const handleDisLikeTouched = async () => {
    setLikeTrainers((prev) =>
      prev.filter((element) => element !== modalData.email)
    );
    setIsLikeChanged(true);
    setLikeTouchedCount(likeTouchedCount + 1);
  };

  useEffect(async () => {
    if (!isModal && isLikeChanged && likeTouchedCount % 2 === 1) {
      const likeTrainersRef = doc(db, 'users', user.uid);
      const otherUsersRef = doc(db, 'users', modalData.uid);
      const modifiedTrainersData = trainersData;

      if (likeTrainers.includes(modalData.email)) {
        modifiedTrainersData.forEach((element) => {
          if (element.email === modalData.email) {
            element.liked++;
          }
        });
        setTrainersData(modifiedTrainersData);

        await updateDoc(likeTrainersRef, {
          likeTrainers: arrayUnion(modalData.email),
        });
        await updateDoc(otherUsersRef, {
          liked: increment(1),
        });
      } else {
        modifiedTrainersData.forEach((element) => {
          if (element.email === modalData.email) {
            element.liked--;
          }
        });
        setTrainersData(modifiedTrainersData);

        await updateDoc(likeTrainersRef, {
          likeTrainers: arrayRemove(modalData.email),
        });
        await updateDoc(otherUsersRef, {
          liked: increment(-1),
        });
      }

      setIsLikeChanged(false);
    }

    setLikeTouchedCount(0);
  }, [isModal]);

  return (
    <Modal animationType="fade" transparent={true} visible={isModal}>
      <StatusBar backgroundColor={'rgba(0, 0, 0, 0.7)'} animated={true} />
      <Pressable
        style={{ flex: 1, backgroundColor: colors.white }}
        onPress={() => setIsModal(!isModal)}
      />
      <View style={styles.centeredView}>
        <ImageBackground
          source={{ uri: modalData.photoURL }}
          style={styles.trainerSpecificPhoto}
        >
          <LinearGradient
            colors={['#00000000', '#00000000', colors.white]}
            style={{ height: '100%', width: '100%' }}
          ></LinearGradient>
        </ImageBackground>
        <View style={styles.likeButtonContainer}>
          <TouchableOpacity>
            {likeTrainers.includes(modalData.email) ? (
              <AntDesign
                name="star"
                size={40}
                color={colors.yellow}
                onPress={handleDisLikeTouched}
              />
            ) : (
              <AntDesign
                name="staro"
                size={40}
                color={colors.yellow}
                onPress={handleLikeTouched}
              />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.trainerSpecificName}>{modalData.displayName}</Text>
        <Text style={styles.trainerDescription}>{modalData.description}</Text>
        <View style={styles.modalView}>
          <TouchableHighlight
            style={{
              ...styles.openButton,
              backgroundColor: colors.foreground,
            }}
            onPress={() => {
              moveToTrainerExerciseList(modalData);
            }}
          >
            <Text style={styles.textStyle}>운동리스트 보기</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              ...styles.openButton,
              backgroundColor: colors.foreground,
            }}
            onPress={() => {
              setIsModal(!isModal);
            }}
          >
            <Text style={styles.textStyle}>돌아가기</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalView: {
    alignItems: 'center',
    top: 100,
    margin: 20,
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: colors.white,
    elevation: 10,
  },
  trainerSpecificPhoto: {
    position: 'absolute',
    top: 0,
    width: WINDOW_SIZE.width,
    height: 400,
  },
  trainerSpecificName: {
    position: 'absolute',
    top: 250,
    left: 30,
    fontSize: 35,
    fontWeight: 'bold',
    textShadowColor: colors.textShadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  trainerDescription: {
    position: 'absolute',
    top: 300,
    left: 30,
    fontSize: 25,
    fontWeight: 'bold',
    textShadowColor: colors.textShadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  likeButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  openButton: {
    width: 150,
    padding: 10,
    margin: 5,
    borderRadius: 15,
    backgroundColor: '#f194ff',
  },
  textStyle: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TrainerSpecificModal;
