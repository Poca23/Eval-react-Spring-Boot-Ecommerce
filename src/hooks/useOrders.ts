// src/hooks/useOrders.ts
import { useState, useEffect, useCallback } from "react";
import { Order, OrderRequest, OrderItem } from "../types"; 
import { api } from "../services/api";
import { useCart } from "./useCart";
import { useProducts } from "./useProducts";
import { CartItem } from "../types";
import '../../styles/index.css';


export function useOrders(emailFilter?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, clearCart } = useCart();
  const { checkStock } = useProducts();

  // Fonction pour récupérer les commandes avec useCallback
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

  // Validation des stocks avec useCallback
  const validateStocks = useCallback(
    async (items: CartItem[]): Promise<boolean> => {
      for (const item of items) {
        try {
          const isAvailable = await checkStock(item.product.id, item.quantity);
          if (!isAvailable) {
            setError(`Stock insuffisant pour ${item.product.name}`);
            return false;
          }
        } catch (err) {
          setError("Erreur lors de la vérification des stocks");
          return false;
        }
      }
      return true;
    },
    [checkStock]
  );

  // Création d'une nouvelle commande avec useCallback
  const createOrder = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const stocksValid = await validateStocks(cart);
        if (!stocksValid) {
          return false;
        }

        const orderRequest: OrderRequest = {
          customerEmail: email,
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount: cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
        };

        await api.createOrder(orderRequest);
        clearCart();
        // Rafraîchir la liste des commandes après création
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
    refreshOrders: fetchOrders, // Exposer la fonction de rafraîchissement
  };
}
