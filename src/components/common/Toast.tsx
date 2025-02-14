// src/components/common/Toast.tsx
import React from 'react';
import { useError } from '../../contexts/ErrorContext';
import '../../styles/index.css';

export const Toast: React.FC = () => {
  const { error, severity, clearError } = useError();

  if (!error) return null;

  return (
    <div className={`toast ${severity}`}>
      <p>{error}</p>
      <button onClick={clearError} className="toast-close" aria-label="Close">
        ×
      </button>
    </div>
  );
};
