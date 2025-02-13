// src/components/admin/AdminOrders.tsx
import React, { useState, useCallback } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useError } from '../../hooks/useError';
import { formatDate, formatPrice } from '../../utils/formatters';
import { validators } from '../../utils/validators';
import { ERROR_MESSAGES } from '../../utils/errorMessages';
import { Order, OrderItem } from '../../types';
import '../../styles/index.css';

interface OrderItemDisplay extends OrderItem {
  name: string;
  price: number;
}

interface OrderDisplay extends Omit<Order, 'items'> {
  items: OrderItemDisplay[];
}

export const AdminOrders: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const { handleError, clearError } = useError();
  const { orders, loading, error: ordersError, refreshOrders } = useOrders(searchEmail);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    clearError();
    
    try {
      if (email) {
        validators.email(email);
      }
      setSearchEmail(email);
    } catch (error) {
      handleError(error, ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
    }
  }, [handleError, clearError]);

  React.useEffect(() => {
    if (ordersError) {
      handleError(ordersError, ERROR_MESSAGES.ORDER.FETCH_ERROR);
    }
  }, [ordersError, handleError]);

  const handleRefresh = useCallback(() => {
    clearError();
    refreshOrders().catch(error => {
      handleError(error, ERROR_MESSAGES.ORDER.FETCH_ERROR);
    });
  }, [refreshOrders, handleError, clearError]);

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1>Gestion des Commandes</h1>
        <button 
          onClick={handleRefresh}
          className="refresh-button"
          disabled={loading}
        >
          Rafraîchir
        </button>
      </div>
      
      <div className="search-bar">
        <input
          type="email"
          placeholder="Rechercher par email..."
          value={searchEmail}
          onChange={handleSearch}
          className="search-input"
          aria-label="Rechercher des commandes par email"
        />
      </div>

      {loading ? (
        <div className="loading-state">Chargement des commandes...</div>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="no-orders">
              {searchEmail 
                ? "Aucune commande trouvée pour cet email"
                : "Aucune commande disponible"}
            </div>
          ) : (
            orders.map((order: OrderDisplay) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Commande #{order.id}</span>
                    <span className="order-email">{order.email}</span>
                    <span className="order-date">{formatDate(order.date)}</span>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="order-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: OrderItemDisplay) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
