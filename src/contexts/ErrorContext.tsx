import React, { createContext, useContext, useState } from 'react';
import { ErrorMessage, ErrorSeverity } from '../types';

interface ErrorContextType {
  error: ErrorMessage;
  severity: ErrorSeverity;
  handleError: (error: unknown, fallbackMessage: string) => void;
  clearError: () => void;
  setError: (message: ErrorMessage, severity?: ErrorSeverity) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorState] = useState<ErrorMessage>(null);
  const [severity, setSeverity] = useState<ErrorSeverity>('info');

  const setError = (message: ErrorMessage, newSeverity: ErrorSeverity = 'error') => {
    setErrorState(message);
    setSeverity(newSeverity);
  };

  const clearError = () => {
    setErrorState(null);
    setSeverity('info');
  };

  const handleError = (error: unknown, fallbackMessage: string) => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    setError(message, 'error');
  };

  return (
    <ErrorContext.Provider value={{ error, severity, setError, clearError, handleError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
