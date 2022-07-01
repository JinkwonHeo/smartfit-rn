import { View, Text } from 'react-native';
import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import Main from '../screens/Main';

const Stack = createStackNavigator();

export default function Home() {
  const { currUser } = UserAuth();

  return (
    <>
      <Stack.Navigator>
        {!currUser.displayName && (
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name="home"
          component={Main}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}
