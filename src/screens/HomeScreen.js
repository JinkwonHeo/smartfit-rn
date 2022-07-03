import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Asset } from 'expo-asset';
import { ThumbnailState } from '../context/ThumbnailContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

  const { thumbNails, setThumbNails } = ThumbnailState();

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

  const renderThumbnail = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
      }}
    >
      <TouchableOpacity>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: item.uri }}
            style={{
              width: 380,
              height: 200,
              borderRadius: 10,
              borderColor: 'black',
              borderWidth: 1,
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Video
        style={styles.video}
        resizeMode="contain"
        useNativeControls
        isLooping
        source={videos[2].src}
      /> */}
      {/* {thumbNails && (
        <Image source={{ uri: thumbNails }} style={styles.image} />
      )} */}
      <FlatList
        data={thumbNails}
        renderItem={renderThumbnail}
        keyExtractor={(thumbNail) => thumbNail.id}
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
  video: {
    flex: 1,
    alignSelf: 'stretch',
  },
  buttons: {
    margin: 16,
  },
  image: {
    width: 200,
    height: 200,
  },
});
