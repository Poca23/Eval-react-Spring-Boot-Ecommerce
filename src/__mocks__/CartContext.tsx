// src/__mocks__/CartContext.tsx
export const useCart = () => ({
    addToCart: jest.fn(),
    cart: [],
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    updateQuantity: jest.fn()
  });
  