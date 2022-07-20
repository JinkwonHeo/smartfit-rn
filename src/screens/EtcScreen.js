import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { UserAuth } from '../context/AuthContext';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { theme } from '../../theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const colors = theme.colors;
const WINDOW_SIZE = Dimensions.get('window');

export default function EtcScreen({ navigation }) {
  const [photoURL, setPhotoURL] = useState(auth.currentUser.photoURL);
  const { setCurrUser } = UserAuth();
  const { displayName } = auth.currentUser;
  const isFocused = useIsFocused();

  const handleMyList = () => {
    navigation.navigate('myExerciseListScreen');
  };

  const handleEditProfile = () => {
    navigation.navigate('editProfileScreen');
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrUser(null);
  };

  useEffect(() => {
    if (isFocused) {
      setPhotoURL(auth.currentUser.photoURL);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.userInformation}>
        <Image style={styles.profileImage} source={{ uri: photoURL }} />
        <Text style={styles.userName}>{displayName}</Text>
      </View>
      <View style={styles.etcMenuWrapper}>
        <TouchableOpacity
          onPress={handleMyList}
          style={{ ...styles.etcMenuList, borderTopWidth: 5 }}
        >
          <Text style={styles.etcMenuListText}>My exercise list</Text>
          <Entypo
            name="chevron-right"
            size={30}
            color={colors.foreground}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleEditProfile}
          style={styles.etcMenuList}
        >
          <Text style={styles.etcMenuListText}>Edit profile</Text>
          <Entypo
            name="chevron-right"
            size={30}
            color={colors.foreground}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.etcMenuList}>
          <Text style={styles.etcMenuListText}>Sign out</Text>
          <Entypo
            name="chevron-right"
            size={30}
            color={colors.foreground}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  etcMenuWrapper: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  etcMenuList: {
    justifyContent: 'center',
    width: WINDOW_SIZE.width,
    height: 60,
    borderColor: 'rgba(0, 0, 0, 0.07)',
    borderTopWidth: 1,
    paddingLeft: 40,
  },
  etcMenuListText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightIcon: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  userInformation: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    marginTop: 120,
    borderRadius: 60,
  },
  userName: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: 'bold',
  },
});
