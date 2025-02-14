// src/components/products/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Image de fallback en cas d'erreur
  const fallbackImage = 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=500&auto=format';

  // Fonction pour récupérer l'URL de l'image selon le nom du produit
  const getProductImage = (productName: string): string => {
    const imageMap: { [key: string]: string } = {
      'iPhone 24': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format',
      'Samsung Galaxy S48': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format',
      'MacBook Pro Plus Plus': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format',
      'AirPods super Pro 8': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format'
    };
    return imageMap[productName] || fallbackImage;
  };

  const handleImageError = () => {
    console.error(`Erreur de chargement de l'image pour ${product.name}`);
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-image">
          {imageLoading && (
            <div className="image-skeleton">
              Chargement...
            </div>
          )}
          <img 
            src={imageError ? fallbackImage : getProductImage(product.name)}
            alt={`${product.name}`}
            onError={handleImageError}
            onLoad={() => setImageLoading(false)}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        </div>
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p className="product-card-description">
            {product.description || 'Aucune description disponible'}
          </p>
          <div className="product-card-footer">
            <span className="product-card-price">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'EUR' 
              }).format(product.price)}
            </span>
          </div>
          <div className="product-stock">
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture de stock'}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
