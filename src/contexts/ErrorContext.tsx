// src/contexts/ErrorContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ErrorContextType, ErrorMessage, ErrorSeverity } from '../types';

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorMessage] = useState<ErrorMessage>(null);
  const [severity, setSeverity] = useState<ErrorSeverity>('error');

  const setError = useCallback((message: ErrorMessage, newSeverity: ErrorSeverity = 'error') => {
    setErrorMessage(message);
    setSeverity(newSeverity);
    
    // Auto-clear pour les messages info et success
    if (newSeverity === 'info' || newSeverity === 'success') {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleError = useCallback((error: unknown, defaultMessage = 'Une erreur est survenue') => {
    if (error instanceof Error) {
      setError(error.message, 'error');
    } else if (typeof error === 'string') {
      setError(error, 'error');
    } else {
      setError(defaultMessage, 'error');
    }
  }, [setError]);

  return (
    <ErrorContext.Provider value={{ error, severity, setError, clearError, handleError }}>
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
