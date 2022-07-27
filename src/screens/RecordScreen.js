import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { Asset } from 'expo-asset';
import { useIsFocused } from '@react-navigation/native';
import useGyro from '../hooks/useGyro';
import { SCREEN_SIZE } from '../constants/size';
import { theme } from '../../theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const colors = theme.colors;

function RecordScreen({ navigation }) {
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageURI, setImageURI] = useState('');
  const [data] = useGyro();
  const isFocused = useIsFocused();
  const images = [
    require('../../assets/image_1.jpg'),
    require('../../assets/image_2.jpg'),
    require('../../assets/image_3.jpg'),
    require('../../assets/image_4.jpg'),
    require('../../assets/image_5.jpg'),
  ];

  useEffect(() => {
    setImagePosition({
      x: imagePosition.x + data.x * 1.6,
      y: imagePosition.y + data.y * 0.8,
    });
  }, [data.x, data.y]);

  useEffect(() => {
    if (isFocused) {
      setImageURI(Asset.fromModule(images[Math.floor(Math.random() * 5)]));
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ImageBackground
          source={{ uri: imageURI.uri }}
          style={{
            ...styles.image,
            position: 'relative',
            top: imagePosition.x,
            right: imagePosition.y,
          }}
        >
          <View style={{ flex: 1, backgroundColor: colors.textShadow }}></View>
        </ImageBackground>
        <Text style={styles.recordDescription}>
          SmartFit에서는 누구나 트레이너가 될 수 있습니다
        </Text>
        <Text
          style={{
            ...styles.recordDescription,
            fontSize: 18,
            bottom: SCREEN_SIZE.height / 3,
          }}
        >
          동영상을 업로드하고 {'\n'}피트니스 인플루언서가 되어보세요!
        </Text>
        <Text
          style={{
            ...styles.recordDescription,
            top: SCREEN_SIZE.height - 280,
            fontStyle: 'italic',
            fontSize: 14,
          }}
        >
          주의: SmartFit에 부적절한 동영상을 업로드할 시 예고없이 삭제되고
          제재를 받을 수 있습니다.
        </Text>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('record')}
            style={styles.recordStartButton}
          >
            <Text style={styles.buttonText}>녹화 시작</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  image: {
    width: SCREEN_SIZE.width + 100,
    height: SCREEN_SIZE.height + 100,
    resizeMode: 'cover',
    backgroundColor: colors.black,
  },
  buttonWrapper: {
    position: 'absolute',
    top: SCREEN_SIZE.height - 350,
  },
  recordStartButton: {
    backgroundColor: colors.white,
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  recordDescription: {
    position: 'absolute',
    height: 200,
    width: '85%',
    bottom: SCREEN_SIZE.height / 2.3,
    color: colors.white,
    fontSize: 31.8,
    fontWeight: 'bold',
    textShadowColor: colors.textShadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  headerBox: {
    top: '4%',
    padding: 15,
    backgroundColor: colors.foreground,
    zIndex: 3,
  },
  headerText: {
    fontSize: 25,
    left: 15,
    fontWeight: 'bold',
    textShadowColor: colors.textShadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: colors.white,
  },
});

export default RecordScreen;
