import { useState, useEffect } from "react";
import { Product } from "../types";
import { api } from "../services/api";
import { useError } from "../contexts/ErrorContext";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useError();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [handleError]);

  return { products, loading, error };
};
