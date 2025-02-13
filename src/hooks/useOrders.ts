// src/hooks/useOrders.ts
import { useState, useEffect, useCallback } from "react";
import { Order } from "../services/api"; // Import depuis api.ts
import { api } from "../services/api";
import { useCart } from "./useCart";
import { stockService } from "../services/stockService";
import { CartItem } from "../types";

interface CreateOrderDTO {
  email: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export function useOrders(emailFilter?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, clearCart } = useCart();

  const fetchOrders = useCallback(async () => {
    if (emailFilter === undefined) return;

    try {
      setLoading(true);
      const fetchedOrders = await api.getOrders(emailFilter);
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }, [emailFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const validateStocks = useCallback(
    async (items: CartItem[]): Promise<boolean> => {
      for (const item of items) {
        const isAvailable = await stockService.checkStock(
          item.product.id,
          item.quantity
        );
        if (!isAvailable) {
          setError(`Stock insuffisant pour ${item.product.name}`);
          return false;
        }
      }
      return true;
    },
    []
  );

  const createOrder = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const stocksValid = await validateStocks(cart);
        if (!stocksValid) return false;

        const orderData: CreateOrderDTO = {
          email,
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        };

        await api.createOrder(orderData);
        clearCart();
        await fetchOrders();
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la commande"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart, clearCart, fetchOrders, validateStocks]
  );

  return {
    orders,
    createOrder,
    loading,
    error,
    refreshOrders: fetchOrders,
  };
}
