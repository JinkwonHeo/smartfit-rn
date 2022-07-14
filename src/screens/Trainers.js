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
import { collection, getDocs, where, query } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import LoadingCircle from '../components/LoadingCircle';
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist';

export default function Trainers({ navigation }) {
  const [trainersData, setTrainersData] = useState([]);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
    const videoRegisteredUser = [];

    try {
      if (user && db) {
        const q = query(collection(db, 'users'), where('videos', '!=', null));
        const querySnapShot = await getDocs(q);

        querySnapShot.forEach((doc) => {
          if (doc.data().uid !== user.uid) {
            videoRegisteredUser.push(doc.data());
          }
        });

        setTrainersData(videoRegisteredUser);
      }
    } catch (e) {
      Alert.alert('Firebase Error. Please try again', e.message);
    }
  };

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
      onPress={() =>
        navigation.navigate('trainerExerciseList', {
          item,
        })
      }
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
});
