import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { AuthContextProvider } from './src/context/AuthContext';
import { LoadingContextProvider } from './src/context/LoadingContext';
import { theme } from './theme';
import NavigationIndex from './src/navigation/index';

LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted from react-native core and will be removed in a future release.',
]);

function App() {
  return (
    <AuthContextProvider>
      <LoadingContextProvider>
        <StatusBar backgroundColor={theme.colors.foreground} />
        <NavigationIndex />
      </LoadingContextProvider>
    </AuthContextProvider>
  );
}

export default App;
