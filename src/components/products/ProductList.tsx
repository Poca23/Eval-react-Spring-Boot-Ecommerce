import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types';

// Données temporaires pour le test
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 99.99,
    description: "This is product 1",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Product 2",
    price: 149.99,
    description: "This is product 2",
    image: "https://via.placeholder.com/150",
  },
  // Ajoutez d'autres produits ici
];

const ProductList: React.FC = () => {
  const handleAddToCart = (product: Product) => {
    // À implémenter plus tard avec le context
    console.log('Added to cart:', product);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
