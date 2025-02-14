// src/components/products/ProductList.tsx
import { useProducts } from '../../hooks/useProducts';
import { useError } from '../../contexts/ErrorContext';
import ProductCard from './ProductCard';
import '../../styles/index.css';

function ProductList() {
  const { products, loading, error } = useProducts();
  const { setError } = useError();

  // Gestion du chargement
  if (loading) {
    setError('Chargement des produits...', 'info');
    return <div className="products-loading">Chargement des produits...</div>;
  }

  // Gestion des erreurs
  if (error) {
    setError(`Erreur lors du chargement des produits: ${error}`, 'error');
    return <div className="products-error">{error}</div>;
  }

  // Gestion liste vide
  if (products.length === 0) {
    setError('Aucun produit disponible', 'warning');
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
}

export default ProductList;
