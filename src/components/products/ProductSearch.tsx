// src/components/products/ProductSearch.tsx
import React from 'react';
import '../../styles/index.css';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onPriceFilterChange: (min: number, max: number) => void;
  onStockFilterChange: (inStock: boolean) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  onPriceFilterChange,
  onStockFilterChange,
}) => {
  const [minPrice, setMinPrice] = React.useState<string>('');
  const [maxPrice, setMaxPrice] = React.useState<string>('');

  const handlePriceChange = () => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    onPriceFilterChange(min, max);
  };

  return (
    <div className="search-container">
      <div className="search-content">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-controls">
          <div className="price-filter">
            <input
              type="number"
              placeholder="Prix min"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                handlePriceChange();
              }}
              className="price-input"
            />
            <input
              type="number"
              placeholder="Prix max"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                handlePriceChange();
              }}
              className="price-input"
            />
          </div>
          <div className="stock-filter">
            <label>
              <input
                type="checkbox"
                onChange={(e) => onStockFilterChange(e.target.checked)}
              />
              <span>En stock uniquement</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
