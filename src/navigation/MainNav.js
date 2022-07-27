import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import Trainers from '../screens/Trainers';
import EtcScreen from '../screens/EtcScreen';
import RecordScreen from '../screens/RecordScreen';
import { theme } from '../../theme';

const colors = theme.colors;
const Tab = createBottomTabNavigator();

export default function MainNav() {
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: colors.white }}
      initialRouteName="home"
      shifting={false}
      screenOptions={{
        tabBarActiveTintColor: colors.foreground,
        headerShown: false,
        tabBarStyle: { height: 65 },
        tabBarLabelStyle: { height: 25, fontSize: 12 },
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
