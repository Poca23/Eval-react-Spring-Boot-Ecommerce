// src/tests/ErrorContext.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ErrorProvider, useError } from '../contexts/ErrorContext';
import { ErrorSeverity } from '../types';

// Composant de test pour utiliser le contexte
const TestComponent = () => {
  const { error, severity, setError, clearError, handleError } = useError();
  
  return (
    <div>
      {error && (
        <div data-testid="error-message" className={`error-${severity}`}>
          {error}
        </div>
      )}
      <button onClick={() => setError('Test error', 'error')}>Set Error</button>
      <button onClick={() => handleError(new Error('Test handled error'), 'Something went wrong')}>Handle Error</button>
      <button onClick={clearError}>Clear Error</button>
      {/* Boutons pour tester différentes sévérités */}
      {(['error', 'warning', 'success', 'info'] as ErrorSeverity[]).map((sev) => (
        <button key={sev} onClick={() => setError(`Test ${sev}`, sev)}>
          Set {sev}
        </button>
      ))}
    </div>
  );
};

describe('ErrorContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should set and display an error message', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const setErrorButton = screen.getByText('Set Error');
    fireEvent.click(setErrorButton);

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveTextContent('Test error');
    expect(errorMessage).toHaveClass('error-error');
  });

  it('should clear error message when clearError is called', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    // Set error first
    const setErrorButton = screen.getByText('Set Error');
    fireEvent.click(setErrorButton);
    
    // Clear error
    const clearErrorButton = screen.getByText('Clear Error');
    fireEvent.click(clearErrorButton);

    // Error message should not be present
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('should auto-clear error after timeout', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const setErrorButton = screen.getByText('Set Error');
    fireEvent.click(setErrorButton);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();

    // Avance le temps de 5 secondes (durée du timeout)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('should handle different error severities', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const severities: ErrorSeverity[] = ['error', 'warning', 'success', 'info'];

    severities.forEach((severity) => {
      const button = screen.getByText(`Set ${severity}`);
      fireEvent.click(button);

      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toHaveTextContent(`Test ${severity}`);
      expect(errorMessage).toHaveClass(`error-${severity}`);
    });
  });

  it('should handle errors properly with handleError', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const handleErrorButton = screen.getByText('Handle Error');
    fireEvent.click(handleErrorButton);

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveTextContent('Test handled error');
    expect(errorMessage).toHaveClass('error-error');
  });

  it('should use fallback message when error is not an Error instance', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const { handleError } = useError();
    act(() => {
      handleError('string error', 'Fallback message');
    });

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveTextContent('Fallback message');
  });
});
