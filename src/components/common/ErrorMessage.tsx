
// src/components/common/ErrorMessage.tsx
import React from 'react';
import '../../styles/index.css';

interface ErrorMessageProps {
  message: string | null;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="error-close"
          aria-label="Fermer"
        >
          ×
        </button>
      )}
    </div>
  );
};
