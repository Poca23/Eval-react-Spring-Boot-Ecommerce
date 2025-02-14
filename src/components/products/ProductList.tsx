import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import { API_CONFIG } from '../../config/api.config';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products received:', data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error details:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error'
        });
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1>Nos Produits</h1>
      {products.length === 0 ? (
        <div className="no-products">
          <p>Aucun produit n'est disponible pour le moment.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;