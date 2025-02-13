// src/components/products/ProductDetail.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useError } from '../../hooks/useError';
import { Product, CartItem } from '../../types';
import { ERROR_MESSAGES } from '../../utils/errorMessages';
import '../../styles/index.css';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { handleError } = useError();

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
      const cartItem: CartItem = {
        product: product,
        quantity: 1
      };
      
      await addToCart(cartItem);
    } catch (error) {
      handleError(error, ERROR_MESSAGES.CART.ADD_ERROR);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        <img 
          src={product.image_url} 
          alt={product.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg'; // Assurez-vous d'avoir une image par défaut
          }}
        />
      </div>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="product-detail-description">{product.description}</p>
        <div className="product-detail-price">
          {product.price.toFixed(2)} €
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
