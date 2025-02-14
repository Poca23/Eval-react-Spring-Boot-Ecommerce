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
  const fallbackImage = 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc';

  const handleImageError = () => {
    console.error(`Erreur de chargement de l'image pour ${product.name}:`, {
      url: product.image_url,
      product: product
    });
    setImageError(true);
    setImageLoading(false);
  };

  console.log('Rendering ProductCard for:', product.name, 'with image:', product.image_url);

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
            src={imageError ? fallbackImage : product.image_url}
            alt={`${product.name}`}
            onError={handleImageError}
            onLoad={() => {
              console.log(`Image loaded successfully for ${product.name}`);
              setImageLoading(false);
            }}
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
