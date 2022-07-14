import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { AuthContextProvider } from './src/context/AuthContext';
import { LoadingContextProvider } from './src/context/LoadingContext';
import { PermissionContextProvider } from './src/context/PermissionContext';
import { theme } from './theme';
import NavigationIndex from './src/navigation/index';

LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted from react-native core and will be removed in a future release.',
  'Non-serializable values were found in the navigation state',
]);

function App() {
  return (
    <AuthContextProvider>
      <LoadingContextProvider>
        <PermissionContextProvider>
          <StatusBar backgroundColor={theme.colors.foreground} style="light" />
          <NavigationIndex />
        </PermissionContextProvider>
      </LoadingContextProvider>
    </AuthContextProvider>
  );
}

export default App;
