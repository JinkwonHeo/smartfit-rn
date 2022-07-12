import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Trainers({ navigation }) {
  const [trainersData, setTrainersData] = useState([]);
  const user = auth.currentUser;

  const getTrainersData = async () => {
    const videoRegisteredUser = [];

    const q = query(collection(db, 'users'), where('videos', '!=', null));
    const querySnapShot = await getDocs(q);

    querySnapShot.forEach((doc) => {
      if (doc.data().uid !== user.uid) {
        videoRegisteredUser.push(doc.data());
      }
    });

    setTrainersData(videoRegisteredUser);
  };

  useEffect(() => {
    setTrainersData([]);
    getTrainersData();
  }, []);

  const renderTrainer = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('trainerExerciseList', {
          item,
        })
      }
    >
      <View style={styles.content}>
        <View style={styles.trainerBox}>
          <Text style={styles.trainerName}>{item.displayName}</Text>
          <Image source={{ uri: item.photoURL }} style={styles.profile} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trainersData}
        renderItem={renderTrainer}
        keyExtractor={(trainer) => trainer.email}
        numColumns={1}
        style={{ marginTop: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  trainerBox: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderRadius: 20,
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  trainerName: {
    paddingLeft: 10,
  },
});
