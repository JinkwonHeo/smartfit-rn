import { StyleSheet } from 'react-native';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import Trainers from '../screens/Trainers';
import VideoScreen from '../screens/VideoScreen';
import EtcScreen from '../screens/EtcScreen';

const Tab = createMaterialBottomTabNavigator();

// Home: 하단 네비게이션 바
export default function MainNav() {
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: '#ffffff' }}
      initialRouteName="home"
      // shifting={false}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Trainers"
        component={Trainers}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Record"
        component={VideoScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="video" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Etc"
        component={EtcScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="dots-three-horizontal" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
});
