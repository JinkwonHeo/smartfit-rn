import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { PermissionState } from '../context/PermissionContext';
import { theme } from '../../theme';

const colors = theme.colors;

export default function FaceDetect() {
  const { permission, setPermission } = PermissionState();
  const { StorageAccessFramework } = FileSystem;
  const navigation = useNavigation();

  useEffect(async () => {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    setPermission(permissions);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Button
        title="Face detect"
        onPress={() => navigation.navigate('face')}
        color={colors.secondary}
      />
      <Button
        title="Pose detect"
        onPress={() => navigation.navigate('pose')}
        color={colors.secondary}
      />
    </View>
  );
}
