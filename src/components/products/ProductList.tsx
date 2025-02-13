// src/components/products/ProductList.tsx
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';
import '../../styles/index.css';

function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <div className="products-loading">Chargement des produits...</div>;
  }

  if (error) {
    return <div className="products-error">{error}</div>;
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
}

export default ProductList;
