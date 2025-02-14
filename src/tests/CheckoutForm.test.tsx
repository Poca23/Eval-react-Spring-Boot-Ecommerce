// src/tests/CheckoutForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/cart/CheckoutForm';
import { CartProvider } from '../contexts/CartContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import * as useOrders from '../hooks/useOrders';
import * as useCart from '../hooks/useCart';
import * as useStock from '../hooks/useStock';

// Mocks
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../hooks/useOrders', () => ({
  useOrders: jest.fn()
}));

jest.mock('../hooks/useCart', () => ({
  useCart: jest.fn()
}));

jest.mock('../hooks/useStock', () => ({
  useStock: jest.fn()
}));

const mockCartItems = [
  {
    product: {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      stock: 10,
      description: 'Test description',
      image_url: 'test.jpg'
    },
    quantity: 2
  }
];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </ErrorProvider>
);

describe('CheckoutForm', () => {
  const navigate = jest.fn();
  const createOrder = jest.fn();
  const clearCart = jest.fn();
  const validateCartStocks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (useOrders.useOrders as jest.Mock).mockReturnValue({ createOrder });
    (useCart.useCart as jest.Mock).mockReturnValue({ 
      cart: mockCartItems,
      clearCart 
    });
    (useStock.useStock as jest.Mock).mockReturnValue({ validateCartStocks });
    validateCartStocks.mockResolvedValue(true);
  });

  it('renders the form correctly', () => {
    render(<CheckoutForm />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmer la commande/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<CheckoutForm />, { wrapper: Wrapper });
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    await waitFor(() => {
      expect(emailInput).toHaveClass('invalid');
    });
  });

  it('handles successful order submission', async () => {
    createOrder.mockResolvedValueOnce({ id: 1, email: 'test@example.com', status: 'PENDING' });
    
    render(<CheckoutForm />, { wrapper: Wrapper });
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByText(/confirmer la commande/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledWith({
        email: 'test@example.com',
        items: expect.any(Array),
        totalAmount: expect.any(Number)
      });
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/order-confirmation', expect.any(Object));
    });
  });

  it('handles stock validation failure', async () => {
    validateCartStocks.mockResolvedValueOnce(false);
    
    render(<CheckoutForm />, { wrapper: Wrapper });
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByText(/confirmer la commande/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(validateCartStocks).toHaveBeenCalled();
    });
  });

  it('shows loading state during submission', async () => {
    createOrder.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CheckoutForm />, { wrapper: Wrapper });
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByText(/confirmer la commande/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/traitement en cours/i)).toBeInTheDocument();
    });
  });
});
