import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import {
  doc,
  collection,
  getDoc,
  getDocs,
  where,
  query,
} from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import LoadingCircle from '../components/LoadingCircle';
import TrainerSpecificModal from '../components/TrainerSpecificModal';
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist';
import { theme } from '../../theme';

const colors = theme.colors;

export default function Trainers({ navigation }) {
  const [trainersData, setTrainersData] = useState([]);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [likeTrainers, setLikeTrainers] = useState([]);
  const [isLikeChanged, setIsLikeChanged] = useState(false);
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
          colors={['rgba(102, 153, 255, 0.7)', colors.white]}
          style={styles.trainerBox}
        >
          <AntDesign
            name="star"
            size={22}
            color={colors.yellow}
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
        <Text style={styles.headerText}>Trainers</Text>
      </View>
      {isListLoaded ? (
        <View style={styles.loadingCircle}>
          <LoadingCircle />
        </View>
      ) : (
        <View style={styles.container}>
          <TrainerSpecificModal
            isModal={isModal}
            setIsModal={setIsModal}
            modalData={modalData}
            likeTrainers={likeTrainers}
            moveToTrainerExerciseList={handleMoveToTrainerExerciseList}
            setLikeTrainers={setLikeTrainers}
            trainersData={trainersData}
            setTrainersData={setTrainersData}
            isLikeChanged={isLikeChanged}
            setIsLikeChanged={setIsLikeChanged}
          />
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
    backgroundColor: colors.white,
  },
  headerBox: {
    top: '4%',
    zIndex: 3,
    padding: 15,
    backgroundColor: colors.foreground,
  },
  headerText: {
    left: 15,
    fontSize: 25,
    fontWeight: 'bold',
    textShadowColor: colors.textShadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingLeft: 7,
    paddingRight: 7,
  },
  trainerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    margin: 10,
    padding: 15,
    paddingLeft: 40,
    paddingRight: 40,
    borderWidth: 0.4,
    borderRadius: 20,
    borderColor: '#ece5dd',
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
    color: colors.yellow,
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  trainerName: {
    fontSize: 21,
    fontWeight: 'bold',
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
});
