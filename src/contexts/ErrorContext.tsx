// src/contexts/ErrorContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { ErrorContextType, ErrorMessage, ErrorSeverity } from '../types';

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorMessage] = useState<ErrorMessage>(null);
  const [severity, setSeverity] = useState<ErrorSeverity>('error');

  const setError = (message: ErrorMessage, newSeverity: ErrorSeverity = 'error') => {
    setErrorMessage(message);
    setSeverity(newSeverity);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return (
    <ErrorContext.Provider value={{ error, severity, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
