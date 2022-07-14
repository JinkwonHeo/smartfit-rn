import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, Text } from 'react-native';
import { LoadingState } from '../context/LoadingContext';
import LoadingCircle from '../components/LoadingCircle';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Asset } from 'expo-asset';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation }) {
  const videos = [
    {
      idx: '0',
      src: require('../../assets/videos/1.mp4'),
    },
    {
      idx: '1',
      src: require('../../assets/videos/2.mp4'),
    },
    {
      idx: '2',
      src: require('../../assets/videos/3.mp4'),
    },
    {
      idx: '3',
      src: require('../../assets/videos/4.mp4'),
    },
  ];
  const exerciseList = ['squat', 'pushUp', 'lunge', 'dumbbellCurl'];

  const [thumbNails, setThumbNails] = useState([]);
  const { loading, setLoading } = LoadingState();

  useEffect(() => {
    const generateThumbnails = async () => {
      try {
        const thumbNailTemp = [];
        let index = 1;

        videos.forEach(async (element) => {
          const videoURI = Asset.fromModule(element.src);
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            videoURI.uri,
            {
              time: 3000,
            }
          );
          const item = {
            id: index,
            uri: uri,
            videoURI: element.src,
            exercise: exerciseList[index - 1],
          };
          thumbNailTemp.push(item);

          if (thumbNailTemp.length === 4) {
            setThumbNails([...thumbNailTemp]);
          }

          index++;
        });
      } catch (error) {
        console.warn(error);
      }
    };

    generateThumbnails();
  }, []);

  useEffect(() => {
    if (!thumbNails.length) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [thumbNails.length]);

  const renderThumbnail = ({ item }) => (
    <View style={styles.thumbNailItem}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('exerciseScreen', {
            videoURI: item.videoURI,
            exercise: item.exercise,
          })
        }
      >
        <View style={styles.content}>
          <View style={styles.exerciseBox}>
            <Text style={styles.text}>{item.exercise}</Text>
            <Image source={{ uri: item.uri }} style={styles.image} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Exercise Lists</Text>
      </View>
      {loading ? (
        <View style={styles.loadingCircle}>
          <LoadingCircle />
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={thumbNails}
            renderItem={renderThumbnail}
            keyExtractor={(thumbNail) => thumbNail.id}
            numColumns={1}
            style={{ marginTop: 50 }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingCircle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 26,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: 'white',
    zIndex: 1,
  },
  image: {
    width: 380,
    height: 200,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  thumbNailItem: {
    marginBottom: 25,
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
});
