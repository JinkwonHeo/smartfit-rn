import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/Profile';
import ExerciseScreen from '../screens/ExerciseScreen';
import MainNav from './MainNav';
import Face from '../components/Face';
import Pose from '../components/Pose';
import RecordResultScreen from '../screens/RecordResultScreen';
import Record from '../components/Record';
import VideoPostScreen from '../screens/VideoPostScreen';

const Stack = createStackNavigator();

export default function Home() {
  const { currUser } = UserAuth();

  return (
    <>
      <Stack.Navigator>
        {currUser.displayName === null ? (
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="mainNav"
              component={MainNav}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="face"
              component={Face}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="pose"
              component={Pose}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="record"
              component={Record}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="recordResult"
              component={RecordResultScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="videoPost"
              component={VideoPostScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="exerciseScreen"
              component={ExerciseScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}
