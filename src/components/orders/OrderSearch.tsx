// src/components/orders/OrderSearch.tsx
import React from 'react';

interface OrderSearchProps {
  onSearch: (query: string) => void;
}

export const OrderSearch: React.FC<OrderSearchProps> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Rechercher une commande..."
      onChange={(e) => onSearch(e.target.value)}
      className="search-input"
    />
  );
};

export default OrderSearch;