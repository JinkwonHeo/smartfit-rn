import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { theme } from '../../theme';

const colors = theme.colors;

function RecordScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Record</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          title="Record start"
          onPress={() => navigation.navigate('record')}
          color={colors.secondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerBox: {
    top: '4%',
    padding: 15,
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

export default RecordScreen;
