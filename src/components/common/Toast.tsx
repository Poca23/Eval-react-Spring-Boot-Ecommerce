// src/components/common/Toast.tsx
import React from 'react';
import { useError } from '../../contexts/ErrorContext';

export const Toast: React.FC = () => {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="toast error">
      <p>{error}</p>
      <button onClick={clearError} className="toast-close" aria-label="Close">
        ×
      </button>
    </div>
  );
};
