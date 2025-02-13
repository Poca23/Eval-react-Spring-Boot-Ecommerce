// src/components/products/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useStock } from '../../hooks/useStock';
import '../../../index.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { checkProductStock, loading } = useStock();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isAvailable = await checkProductStock(product.id, 1);
    if (isAvailable) {
      addToCart(product);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p className="product-card-description">{product.description}</p>
          <div className="product-card-footer">
            <span className="product-card-price">{product.price.toFixed(2)} €</span>
          </div>
          <div className="product-stock">
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture de stock'}
          </div>
        </div>
      </Link>
      <button 
        onClick={handleAddToCart}
        disabled={loading || product.stock === 0}
        className={`add-to-cart-button ${product.stock === 0 ? 'disabled' : ''}`}
      >
        {loading ? 'Chargement...' : product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
      </button>
    </div>
  );
};

export default ProductCard;
