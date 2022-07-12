import React from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function TrainerExerciseListScreen({ route, navigation }) {
  const { videos } = route.params.item;

  const renderTrainerExercise = ({ item }) => (
    <View style={styles.thumbNailItem}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('trainerExerciseScreen', {
            exerciseData: item,
          })
        }
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: item.thumbnail,
            }}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderTrainerExercise}
        keyExtractor={(data) => data.title}
        numColumns={1}
        style={{ marginTop: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 380,
    height: 200,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  thumbNailItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
});
