import React, { useContext, useState, createContext } from 'react';

const PermissionContext = createContext();

export function PermissionContextProvider({ children }) {
  const [permissionStatus, setPermissionStatus] = useState('');

  return (
    <PermissionContext.Provider
      value={{ permissionStatus, setPermissionStatus }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export const PermissionState = () => {
  return useContext(PermissionContext);
};
