/* eslint-disable react/prop-types */
// Context.js
import  { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState('');
  const [dropValue, setDropValue] = useState('');
  const [isNotValidInput, setIsNotValidInput] = useState(false);

  return (
    <AppContext.Provider value={{ inputValue, setInputValue, dropValue, setDropValue,setIsNotValidInput,isNotValidInput }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
