import React from 'react';
import { View, Button } from 'react-native';
import { theme } from '../../theme';

const colors = theme.colors;

function RecordScreen({ navigation }) {
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
        title="Record start"
        onPress={() => navigation.navigate('record')}
        color={colors.secondary}
      />
    </View>
  );
}

export default RecordScreen;
