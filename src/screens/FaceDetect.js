import { View, Button } from 'react-native';
import React from 'react';
import { theme } from '../../theme';

const colors = theme.colors;

export default function FaceDetect({ navigation }) {
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
        title="Face detect"
        onPress={() => navigation.navigate('face')}
        color={colors.secondary}
      />
      <Button
        title="Pose detect"
        onPress={() => navigation.navigate('pose')}
        color={colors.secondary}
      />
    </View>
  );
}
