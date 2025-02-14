// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderConfirmation, ShippingAddress, PaymentDetails } from '../types';
import { useError } from '../hooks/useError';
import { validators } from '../utils/validators';
import { api } from '../services/api';
import '../styles/index.css';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<boolean>;
  updateQuantity: (productId: number, newQuantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  total: number;
  getTotal: () => number;
  getItemCount: () => number;
  confirmOrder: (shippingAddress: ShippingAddress, paymentDetails: PaymentDetails) => Promise<boolean>;
  isProcessingOrder: boolean;
  orderConfirmed: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [total, setTotal] = useState<number>(0);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const { handleError } = useError();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    const newTotal = getTotal();
    setTotal(newTotal);
  }, [items]);

  const getTotal = () => {
    return items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    try {
      validators.quantity(quantity, product.stock);
      
      setItems(currentItems => {
        const existingItem = currentItems.find(
          item => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            throw new Error("Quantité demandée supérieure au stock disponible");
          }
          return currentItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...currentItems, { product, quantity }];
      });
      
      return true;
    } catch (error) {
      handleError(error, "Erreur lors de l'ajout au panier");
      return false;
    }
  };

  const removeFromCart = async (productId: number): Promise<boolean> => {
    try {
      setItems(currentItems => 
        currentItems.filter(item => item.product.id !== productId)
      );
      return true;
    } catch (error) {
      handleError(error, "Erreur lors de la suppression du panier");
      return false;
    }
  };

  const updateQuantity = async (productId: number, quantity: number): Promise<boolean> => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      const item = items.find(item => item.product.id === productId);
      if (!item) throw new Error("Produit non trouvé dans le panier");

      validators.quantity(quantity, item.product.stock);

      setItems(currentItems =>
        currentItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
      
      return true;
    } catch (error) {
      handleError(error, "Erreur lors de la mise à jour de la quantité");
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      setItems([]);
      return true;
    } catch (error) {
      handleError(error, "Erreur lors de la suppression du panier");
      return false;
    }
  };

  const confirmOrder = async (
    shippingAddress: ShippingAddress,
    paymentDetails: PaymentDetails
  ): Promise<boolean> => {
    try {
      setIsProcessingOrder(true);
      
      const orderData: OrderConfirmation = {
        cartItems: items,
        shippingAddress,
        paymentDetails,
        userId: 'user-id'
      };

      await api.confirmOrder(orderData);
      
      setOrderConfirmed(true);
      await clearCart();
      return true;
    } catch (error) {
      handleError(error, "Erreur lors de la confirmation de la commande");
      return false;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      getTotal,
      getItemCount,
      confirmOrder,
      isProcessingOrder,
      orderConfirmed
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
