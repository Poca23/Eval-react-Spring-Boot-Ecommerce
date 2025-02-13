// src/components/products/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useStock } from '../../hooks/useStock';
import '../../styles/index.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { checkProductStock, loading } = useStock();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Empêche la propagation vers le Link parent
    
    try {
      const isAvailable = await checkProductStock(product.id, 1);
      if (isAvailable) {
        addToCart(product);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  const fallbackImage = '/path/to/fallback-image.jpg'; // Image par défaut si l'URL est invalide

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-image">
          <img 
            src={product.image_url || fallbackImage} 
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p className="product-card-description">
            {product.description || 'Aucune description disponible'}
          </p>
          <div className="product-card-footer">
            <span className="product-card-price">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
            </span>
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
        aria-label={`Ajouter ${product.name} au panier`}
      >
        {loading ? 'Chargement...' : product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
      </button>
    </div>
  );
};

export default ProductCard;
