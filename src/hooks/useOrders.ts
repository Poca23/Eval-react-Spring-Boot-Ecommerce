// src/hooks/useOrders.ts
import { useState, useEffect } from "react";
import { OrderRequest, api } from "../services/api";
import { useCart } from "./useCart";
import { useProducts } from "./useProducts";

export interface Order {
  id: number;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export function useOrders(emailFilter?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, clearCart } = useCart();
  const { checkStock } = useProducts();

  // Fonction pour récupérer les commandes (partie admin)
  useEffect(() => {
    const fetchOrders = async () => {
      if (emailFilter !== undefined) {
        // Ne charge que si emailFilter est défini
        try {
          setLoading(true);
          const response = await api.get(
            `/api/orders${emailFilter ? `?email=${emailFilter}` : ""}`
          );
          setOrders(response.data);
          setError(null);
        } catch (err) {
          setError("Erreur lors du chargement des commandes");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [emailFilter]);

  // Validation des stocks avant création de commande
  const validateStocks = async (items: CartItem[]): Promise<boolean> => {
    for (const item of items) {
      const isAvailable = await checkStock(item.id, item.quantity);
      if (!isAvailable) {
        setError(`Stock insuffisant pour ${item.name}`);
        return false;
      }
    }
    return true;
  };

  // Création d'une nouvelle commande
  const createOrder = async (email: string) => {
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
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };

      await api.createOrder(orderRequest);
      clearCart();
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
  };

  return { orders, createOrder, loading, error };
}
