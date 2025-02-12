// src/hooks/useOrder.ts
import { useState } from 'react';
import { OrderRequest, api } from '../services/api';
import { useCart } from './useCart';

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, clearCart } = useCart();

  const createOrder = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const orderRequest: OrderRequest = {
        customerEmail: email,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };

      await api.createOrder(orderRequest);
      clearCart();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la commande');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
}
