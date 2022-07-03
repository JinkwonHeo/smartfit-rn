import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { theme } from '../../theme';

const colors = theme.colors;

export default function FaceDetect() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Button
        title="go to detect"
        onPress={() => navigation.navigate('face')}
        color={colors.secondary}
      />
    </View>
  );
}
