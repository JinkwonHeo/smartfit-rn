import React, { useContext, useState, createContext } from 'react';

const PermissionContext = createContext();

export function PermissionContextProvider({ children }) {
  const [permission, setPermission] = useState([]);

  return (
    <PermissionContext.Provider value={{ permission, setPermission }}>
      {children}
    </PermissionContext.Provider>
  );
}

export const PermissionState = () => {
  return useContext(PermissionContext);
};
