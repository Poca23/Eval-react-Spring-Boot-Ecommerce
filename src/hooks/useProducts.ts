// src/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product } from "../services/api";
import { api } from "../services/api";
import { stockService } from "../services/stockService";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des produits"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const checkStock = async (
    productId: number,
    quantity: number
  ): Promise<boolean> => {
    return await stockService.checkStock(productId, quantity);
  };

  return { products, loading, error, checkStock };
}
