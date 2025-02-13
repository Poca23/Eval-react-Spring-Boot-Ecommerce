// src/contexts/ErrorContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import '../styles/index.css';

interface ErrorContextType {
  error: string | null;
  setError: (message: string | null) => void;
  clearError: () => void;
  handleError: (error: unknown, fallbackMessage: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = useCallback((message: string | null) => {
    setErrorState(message);
    if (message) {
      // Auto-clear après 5 secondes seulement si un message est défini
      setTimeout(() => setErrorState(null), 5000);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    setError(errorMessage);
  }, [setError]);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError, handleError }}>
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
