// src/contexts/ErrorContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import '../../styles/index.css';


interface ErrorContextType {
  error: string | null;
  setError: (message: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = useCallback((message: string) => {
    setErrorState(message);
    // Auto-clear après 5 secondes
    setTimeout(() => setErrorState(null), 5000);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
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
