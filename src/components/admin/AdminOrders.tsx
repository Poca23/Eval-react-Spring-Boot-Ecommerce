// src/components/admin/AdminOrders.tsx
import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';

export const AdminOrders = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const { orders, loading, error } = useOrders(searchEmail);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="admin-orders">
      <h1>Gestion des Commandes</h1>
      
      <div className="search-bar">
        <input
          type="email"
          placeholder="Rechercher par email..."
          value={searchEmail}
          onChange={handleSearch}
        />
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div>Email: {order.email}</div>
            <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
            <div>Total: {order.total}€</div>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.productId} className="order-item">
                  {item.productName} x{item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
