// src/components/products/ProductCard.tsx
import { Link } from 'react-router-dom';
import { Product } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation lors du clic sur le bouton
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-card-content">
        <h3>{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-card-price">{product.price.toFixed(2)} €</span>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="add-to-cart-button"
          >
            {product.stock === 0 ? 'Rupture' : 'Ajouter'}
          </button>
        </div>
        <div className="product-card-stock">
          {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture de stock'}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
