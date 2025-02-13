// src/hooks/useStock.ts
import { useState, useCallback } from "react";
import { stockService } from "../services/stockService";
import "../styles/index.css";

// Définition des types locaux
interface StockItem {
  product_id: number;
  quantity: number;
}

export function useStock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Vérifie si un produit a suffisamment de stock
   */
  const checkProductStock = useCallback(
    async (product_id: number, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const isAvailable = await stockService.checkStock(product_id, quantity);
        return isAvailable;
      } catch (err) {
        setError("Erreur lors de la vérification du stock");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Vérifie les stocks pour plusieurs produits
   */
  const validateCartStocks = useCallback(async (cartItems: StockItem[]) => {
    setLoading(true);
    setError(null);
    try {
      const isValid = await stockService.checkMultipleStocks(cartItems);
      return isValid;
    } catch (err) {
      setError("Erreur lors de la vérification des stocks");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Met à jour le stock d'un produit
   */
  const updateProductStock = useCallback(
    async (product_id: number, newStock: number) => {
      setLoading(true);
      setError(null);
      try {
        const success = await stockService.updateStock(product_id, newStock);
        return success;
      } catch (err) {
        setError("Erreur lors de la mise à jour du stock");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    checkProductStock,
    validateCartStocks,
    updateProductStock,
  };
}
