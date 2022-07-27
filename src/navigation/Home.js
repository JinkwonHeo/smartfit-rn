import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/Profile';
import ExerciseScreen from '../screens/ExerciseScreen';
import MainNav from './MainNav';
import Pose from '../components/Pose';
import RecordResultScreen from '../screens/RecordResultScreen';
import Record from '../components/Record';
import VideoPostScreen from '../screens/VideoPostScreen';
import TrainerExerciseListScreen from '../screens/TrainerExerciseListScreen';
import TrainerExerciseScreen from '../screens/TrainerExerciseScreen';
import MyExerciseListScreen from '../screens/MyExerciseListScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

import { theme } from '../../theme';

const colors = theme.colors;
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
            <Stack.Screen
              name="trainerExerciseList"
              component={TrainerExerciseListScreen}
              options={({ route }) => ({
                title: `${route.params.item.displayName}'s exercises`,
                headerStyle: { backgroundColor: colors.foreground },
                headerTitleStyle: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  textShadowColor: colors.textShadow,
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 5,
                  color: colors.white,
                },
              })}
            />
            <Stack.Screen
              name="trainerExerciseScreen"
              component={TrainerExerciseScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="editProfileScreen"
              component={EditProfileScreen}
              options={{
                title: 'Edit profile',
                headerStyle: { backgroundColor: colors.foreground },
                headerTitleStyle: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  textShadowColor: colors.textShadow,
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 5,
                  color: colors.white,
                },
              }}
            />
            <Stack.Screen
              name="myExerciseListScreen"
              component={MyExerciseListScreen}
              options={{
                title: 'My Exercise',
                headerStyle: { backgroundColor: colors.foreground },
                headerTitleStyle: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  textShadowColor: colors.textShadow,
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 5,
                  color: colors.white,
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}
