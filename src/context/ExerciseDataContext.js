import React, { useContext, useState, createContext } from 'react';

const ExerciseDataContext = createContext();

export function ExerciseDataContextProvider({ children }) {
  const [exerciseData, setExerciseData] = useState([]);

  return (
    <ExerciseDataContext.Provider value={{ exerciseData, setExerciseData }}>
      {children}
    </ExerciseDataContext.Provider>
  );
}

export const ExerciseDataState = () => {
  return useContext(ExerciseDataContext);
};
