import React, { useContext, useState, createContext } from 'react';

const LoadingContext = createContext();

export function LoadingContextProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const LoadingState = () => {
  return useContext(LoadingContext);
};
