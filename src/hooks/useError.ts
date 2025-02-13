// src/hooks/useError.ts
import { useState, useCallback } from "react";
import '../../styles/index.css';


export const useError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError(fallbackMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
