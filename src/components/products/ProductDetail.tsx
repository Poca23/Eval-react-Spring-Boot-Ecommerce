// src/components/products/ProductDetail.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useError } from '../../hooks/useError';
import { ERROR_MESSAGES } from '../../utils/errorMessages';
import '../../styles/index.css';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { handleError } = useError();

  const fallbackImage = 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=500&auto=format';

  const getProductImage = (productName: string): string => {
    const imageMap: { [key: string]: string } = {
      'iPhone 24': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format',
      'Samsung Galaxy S48': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format',
      'MacBook Pro Plus Plus': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format',
      'AirPods super Pro 8': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format'
    };
    return imageMap[productName] || fallbackImage;
  };

  const product = products.find(p => p.id === parseInt(id || '0'));

  if (loading) {
    return <div className="product-detail-loading">Chargement...</div>;
  }

  if (error) {
    return <div className="product-detail-error">
      {ERROR_MESSAGES.PRODUCTS.FETCH_ERROR}
    </div>;
  }

  if (!product) {
    return <div className="product-detail-error">
      {ERROR_MESSAGES.PRODUCTS.NOT_FOUND}
    </div>;
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product, 1);
    } catch (error) {
      handleError(error, ERROR_MESSAGES.CART.ADD_ERROR);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        <img 
          src={getProductImage(product.name)}
          alt={product.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
      </div>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="product-detail-description">{product.description}</p>
        <div className="product-detail-price">
          {new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR' 
          }).format(product.price)}
        </div>
        <div className="product-detail-stock">
          Stock: {product.stock} unités
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="add-to-cart-button"
        >
          {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
