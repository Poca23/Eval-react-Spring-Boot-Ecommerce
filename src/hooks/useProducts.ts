// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { Product, api } from '../services/api';
import '../../styles/index.css';


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
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    const checkStock = async (productId: number, quantity: number): Promise<boolean> => {
      try {
        return await api.checkProductStock(productId, quantity);
      } catch (error) {
        console.error('Erreur lors de la vérification du stock:', error);
        return false;
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, checkStock };
}
