// src/components/products/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';
import { Product } from '../../types';
import '../../styles/index.css';

const ProductList: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  useEffect(() => {
    let result = [...products];

    // Filtre par recherche
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par prix
    result = result.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filtre par stock
    if (showInStockOnly) {
      result = result.filter(product => product.stock > 0);
    }

    setFilteredProducts(result);
  }, [products, searchQuery, priceRange, showInStockOnly]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Erreur de chargement des produits</div>;

  return (
    <div className="products-container">
      <ProductSearch
        onSearch={(query) => setSearchQuery(query)}
        onPriceFilterChange={(min, max) => setPriceRange({ min, max })}
        onStockFilterChange={(inStock) => setShowInStockOnly(inStock)}
      />
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-results">Aucun produit ne correspond à votre recherche</div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
