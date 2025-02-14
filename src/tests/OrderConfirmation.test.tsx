// src/tests/OrderConfirmation.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderConfirmation } from '../components/orders/OrderConfirmation';
import { CartContextType, AuthContextType, Product, User } from '../types';

// Création des contextes pour les tests
const CartContext = React.createContext<CartContextType | undefined>(undefined);
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Mock des produits pour les tests
const mockProduct: Product = {
  id: 1,
  name: "Test Product",
  price: 99.99,
  stock: 10,
  description: "Test Description",
  image_url: "test.jpg"
};

// Mock du user pour les tests
const mockUser: User = {
  id: 1,
  email: "test@example.com",
  role: "USER",
  firstName: "John",
  lastName: "Doe"
};

// Mock des contextes
const mockCartContext: CartContextType = {
  items: [{ product: mockProduct, quantity: 2 }],
  total: 199.98,
  addToCart: jest.fn().mockResolvedValue(true),
  removeFromCart: jest.fn().mockResolvedValue(true),
  updateQuantity: jest.fn().mockResolvedValue(true),
  clearCart: jest.fn().mockResolvedValue(true),
  getTotal: jest.fn(() => 199.98),
  getItemCount: jest.fn(() => 2),
  confirmOrder: jest.fn().mockResolvedValue(true),
  isProcessingOrder: false,
  orderConfirmed: false
};

const mockAuthContext: AuthContextType = {
  user: mockUser,
  login: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn(),
  isAuthenticated: true,
  isAdmin: false
};

// Wrapper pour les contextes
const renderWithContext = (component: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <CartContext.Provider value={mockCartContext}>
        {component}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

describe('OrderConfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le résumé de la commande correctement', () => {
    renderWithContext(<OrderConfirmation />);
    
    expect(screen.getByText('Confirmation de commande')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('x 2')).toBeInTheDocument();
    expect(screen.getByText('199,98 €')).toBeInTheDocument();
  });

  test('désactive le bouton si le panier est vide', () => {
    const emptyCartContext: CartContextType = {
      ...mockCartContext,
      items: [],
      total: 0,
      getTotal: () => 0,
      getItemCount: () => 0
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={emptyCartContext}>
          <OrderConfirmation />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    const confirmButton = screen.getByRole('button', { name: /confirmer la commande/i });
    expect(confirmButton).toBeDisabled();
  });

  test('désactive le bouton si non authentifié', () => {
    const unauthContext: AuthContextType = {
      ...mockAuthContext,
      user: null,
      isAuthenticated: false
    };

    render(
      <AuthContext.Provider value={unauthContext}>
        <CartContext.Provider value={mockCartContext}>
          <OrderConfirmation />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    const confirmButton = screen.getByRole('button', { name: /confirmer la commande/i });
    expect(confirmButton).toBeDisabled();
  });

  test('gère correctement la confirmation de commande', async () => {
    renderWithContext(<OrderConfirmation />);

    const confirmButton = screen.getByRole('button', { name: /confirmer la commande/i });
    fireEvent.click(confirmButton);

    expect(mockCartContext.confirmOrder).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.queryByText(/traitement en cours/i)).not.toBeInTheDocument();
    });
  });

  test('affiche les informations utilisateur', () => {
    renderWithContext(<OrderConfirmation />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  test('affiche le message de confirmation après une commande réussie', async () => {
    const successContext: CartContextType = {
      ...mockCartContext,
      orderConfirmed: true
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={successContext}>
          <OrderConfirmation />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/commande a été confirmée avec succès/i)).toBeInTheDocument();
  });

  test('affiche le message de traitement pendant la confirmation', async () => {
    const processingContext: CartContextType = {
      ...mockCartContext,
      isProcessingOrder: true
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={processingContext}>
          <OrderConfirmation />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/traitement en cours/i)).toBeInTheDocument();
  });
});
