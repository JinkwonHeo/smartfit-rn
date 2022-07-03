import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import Trainers from '../screens/Trainers';
import EtcScreen from '../screens/EtcScreen';
import FaceDetect from '../screens/FaceDetect';
import RecordScreen from '../screens/RecordScreen';

const Tab = createBottomTabNavigator();

// Home: 하단 네비게이션 바
export default function MainNav() {
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: '#ffffff' }}
      initialRouteName="home"
      shifting={false}
      screenOptions={{
        tabBarActiveTintColor: '#33ABEF',
        headerShown: false,
      }}
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
        component={RecordScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="video" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FaceDetect"
        component={FaceDetect}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="face" size={24} color={color} />
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
