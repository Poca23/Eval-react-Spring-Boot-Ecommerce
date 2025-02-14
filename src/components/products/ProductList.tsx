import { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useError } from '../../hooks/useError';
import ProductCard from './ProductCard';
import '../../styles/index.css';

const ProductList = () => {
  const { products, loading, error } = useProducts();
  const { setError } = useError();

  useEffect(() => {
    if (error) {
      setError('Une erreur est survenue lors du chargement des produits', 'error');
    }
  }, [error, setError]);

  if (loading) {
    return <div className="products-loading">Chargement des produits...</div>;
  }

  if (products.length === 0) {
    return <div className="products-empty">Aucun produit disponible</div>;
  }

  return (
    <div className="products-container">
      <h1>Nos Produits</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
