import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
  Pressable,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import {
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  where,
  query,
} from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import LoadingCircle from '../components/LoadingCircle';
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist';
import { theme } from '../../theme';
import { StatusBar } from 'expo-status-bar';

const colors = theme.colors;
const WINDOW_SIZE = Dimensions.get('window');

export default function Trainers({ navigation }) {
  const [trainersData, setTrainersData] = useState([]);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [likeTrainers, setLikeTrainers] = useState([]);
  const [isLikeChanged, setIsLikeChanged] = useState(false);
  const [likeTouchedCount, setLikeTouchedCount] = useState(0);
  const user = auth.currentUser;
  const isFocused = useIsFocused();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(300).then(() => setRefreshing(false));
  }, []);

  const getTrainersData = async () => {
    const users = [];

    try {
      if (user && db) {
        const q = query(collection(db, 'users'), where('videos', '!=', null));
        const querySnapShot = await getDocs(q);

        querySnapShot.forEach((doc) => {
          if (doc.data().uid !== user.uid) {
            users.push(doc.data());
          }
        });

        users.sort((prev, next) => {
          return next.liked - prev.liked;
        });
        setTrainersData(users.filter((user) => user.videos.length !== 0));
      }
    } catch (e) {
      Alert.alert('Firebase Error. Please try again', e.message);
    }
  };

  const openSettingsModal = (data) => {
    setModalData(data);
    setIsModal(!isModal);
  };

  const handleMoveToTrainerExerciseList = (item) => {
    setIsModal(!isModal);
    navigation.navigate('trainerExerciseList', {
      item,
    });
  };

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

  useEffect(async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLikeTrainers([...docSnap.data().likeTrainers]);
    }
  }, []);

  useEffect(() => {
    if (isFocused && !trainersData.length) {
      setTrainersData([]);
      getTrainersData();
    }

    if (refreshing) {
      setTrainersData([]);
      getTrainersData();
    }
  }, [isFocused, refreshing]);

  useEffect(() => {
    if (!trainersData.length) {
      setIsListLoaded(true);
    } else {
      setIsListLoaded(false);
    }
  }, [trainersData.length]);

  const renderTrainer = ({ item }) => (
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
            '#ffffff',
          ]}
          style={styles.trainerBox}
        >
          <AntDesign
            name="star"
            size={22}
            color={'yellow'}
            onPress={handleDisLikeTouched}
            style={styles.likedCountIcon}
          />
          <Text style={styles.likedCountText}>{item.liked}</Text>
          <Text style={styles.trainerName}>{item.displayName}</Text>
          <Image source={{ uri: item.photoURL }} style={styles.profile} />
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Trainer Lists</Text>
      </View>
      {isListLoaded ? (
        <View style={styles.loadingCircle}>
          <LoadingCircle />
        </View>
      ) : (
        <View style={styles.container}>
          <Modal animationType="fade" transparent={true} visible={isModal}>
            <StatusBar backgroundColor={'rgba(0, 0, 0, 0.7)'} animated={true} />
            <Pressable
              style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 1)' }}
              onPress={() => setIsModal(!isModal)}
            />
            <View style={styles.centeredView}>
              <ImageBackground
                source={{ uri: modalData.photoURL }}
                style={styles.trainerSpecificPhoto}
              >
                <LinearGradient
                  colors={['#00000000', '#00000000', 'rgba(255, 255, 255, 1)']}
                  style={{ height: '100%', width: '100%' }}
                ></LinearGradient>
              </ImageBackground>
              <View style={styles.likeButtonContainer}>
                <TouchableOpacity>
                  {likeTrainers.includes(modalData.email) ? (
                    <AntDesign
                      name="star"
                      size={40}
                      color={'yellow'}
                      onPress={handleDisLikeTouched}
                    />
                  ) : (
                    <AntDesign
                      name="staro"
                      size={40}
                      color={'yellow'}
                      onPress={handleLikeTouched}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.trainerSpecificName}>
                {modalData.displayName}
              </Text>
              <Text style={styles.trainerDescription}>
                {modalData.description}
              </Text>
              <View style={styles.modalView}>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.foreground,
                  }}
                  onPress={() => {
                    handleMoveToTrainerExerciseList(modalData);
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
          <FadeInFlatList
            data={trainersData}
            renderItem={renderTrainer}
            keyExtractor={(trainer) => trainer.email}
            numColumns={1}
            style={{ marginTop: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
    backgroundColor: 'white',
  },
  headerBox: {
    top: '5%',
    padding: 12,
    backgroundColor: '#33ABEF',
    zIndex: 3,
  },
  headerText: {
    fontSize: 25,
    left: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: 'white',
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
  likedCountIcon: {
    position: 'absolute',
    top: 10,
    left: 35,
  },
  likedCountText: {
    position: 'absolute',
    top: 9,
    left: 65,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'yellow',
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  trainerName: {
    fontSize: 21,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: 'white',
  },
  loadingCircle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
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
    top: 100,
    borderRadius: 20,
    padding: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
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
  },
  trainerDescription: {
    position: 'absolute',
    top: 300,
    left: 30,
    fontSize: 25,
    fontWeight: 'bold',
  },
  likeButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
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
