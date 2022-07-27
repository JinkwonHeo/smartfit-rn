import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableHighlight,
  ToastAndroid,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LoadingCircle from '../components/LoadingCircle';
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist';
import { theme } from '../../theme';

const colors = theme.colors;

export default function MyExerciseListScreen() {
  const [exerciseData, setExerciseData] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isListLoaded, setIsListLoaded] = useState(false);
  const user = auth.currentUser;

  const getExerciseData = async () => {
    try {
      if (user && db) {
        setIsListLoaded(true);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        setIsListLoaded(false);

        if (docSnap.exists()) {
          setExerciseData([...docSnap.data().videos]);
        } else {
          alert('No document');
        }
      }
    } catch (e) {
      Alert.alert('Firebase Error. Please try again', e.message);
    }
  };

  const openSettingsModal = (data) => {
    setModalData(data);
    setIsModal(!isModal);
  };

  const handleExerciseDelete = async (videoData) => {
    const modifiedData = exerciseData.filter(
      (data) => data.url !== videoData.url
    );

    const modifiedExerciseDataRef = doc(db, 'users', user.uid);
    await updateDoc(modifiedExerciseDataRef, {
      videos: modifiedData,
    }).then(
      ToastAndroid.showWithGravityAndOffset(
        '삭제되었습니다.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      )
    );

    setExerciseData([...modifiedData]);
    setIsModal(!isModal);
  };

  useEffect(() => {
    getExerciseData();
  }, []);

  const renderMyExercise = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        openSettingsModal(item);
      }}
    >
      <View style={styles.content}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            'rgba(76, 102, 159, 0.7)',
            'rgba(108, 189, 235, 0.6)',
            colors.white,
          ]}
          style={styles.trainerBox}
        >
          <Text style={styles.trainerName}>{item.title}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {isListLoaded ? (
        <View style={styles.loadingCircle}>
          <LoadingCircle />
        </View>
      ) : (
        <View style={styles.container}>
          <Modal animationType="fade" transparent={true} visible={isModal}>
            <Pressable
              style={{ flex: 1, backgroundColor: colors.textShadow }}
              onPress={() => setIsModal(!isModal)}
            />
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.foreground,
                  }}
                  onPress={() => {
                    handleExerciseDelete(modalData);
                  }}
                >
                  <Text style={styles.textStyle}>
                    {modalData.title} 삭제하기
                  </Text>
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
          <FadeInFlatList
            data={exerciseData}
            renderItem={renderMyExercise}
            keyExtractor={(exercise) => exercise.url}
            numColumns={1}
            initialDelay={0}
            durationPerItem={400}
            parallelItems={4}
            itemsToFadeIn={10}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingLeft: 7,
    paddingRight: 7,
  },
  trainerBox: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.4,
    borderRadius: 20,
    borderColor: '#ece5dd',
    margin: 10,
    padding: 15,
    paddingLeft: 40,
    paddingRight: 40,
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  trainerName: {
    fontSize: 21,
    textShadowColor: colors.textShadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: colors.white,
  },
  loadingCircle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  centeredView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 30,
    paddingHorizontal: 50,
    alignItems: 'center',
    elevation: 10,
  },
  openButton: {
    backgroundColor: '#f194ff',
    width: 150,
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  textStyle: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
