import React, { useEffect } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { LoadingState } from '../context/LoadingContext';
import LoadingCircle from '../components/LoadingCircle';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Asset } from 'expo-asset';
import { ThumbnailState } from '../context/ThumbnailContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
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

  const { loading, setLoading } = LoadingState();
  const { thumbNails, setThumbNails } = ThumbnailState();
  const navigation = useNavigation();

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
          navigation.navigate('exerciseScreen', { videoURI: item.videoURI })
        }
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {loading ? (
        <View style={styles.container}>
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
