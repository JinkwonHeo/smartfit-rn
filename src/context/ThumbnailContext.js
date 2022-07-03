import React, { useContext, useState, createContext } from 'react';

const ThumbnailContext = createContext();

export function ThumbnailContextProvider({ children }) {
  const [thumbNails, setThumbNails] = useState([]);

  return (
    <ThumbnailContext.Provider value={{ thumbNails, setThumbNails }}>
      {children}
    </ThumbnailContext.Provider>
  );
}

export const ThumbnailState = () => {
  return useContext(ThumbnailContext);
};
