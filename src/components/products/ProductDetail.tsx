// src/components/products/ProductDetail.tsx
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import '../../../index.css';

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProducts();
  const product = products.find(p => p.id === parseInt(id as string));
   const { addToCart } = useCart();

  if (loading) {
    return <div className="product-detail-loading">Chargement...</div>;
  }

  if (error) {
    return <div className="product-detail-error">{error}</div>;
  }

  if (!product) {
    return <div className="product-detail-error">Produit non trouvé</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        <img src={product.imageUrl} alt={product.name} />
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
}

export default ProductDetail;
