import React, { useContext, useState, createContext } from 'react';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [currUser, setCurrUser] = useState(null);

  return (
    <AuthContext.Provider value={{ currUser, setCurrUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
