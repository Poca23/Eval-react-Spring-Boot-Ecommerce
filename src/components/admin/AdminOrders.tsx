// src/components/admin/AdminOrders.tsx
import React, { useState, useCallback } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useError } from '../../contexts/ErrorContext';
import { handleApiError } from '../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../utils/errorMessages';
import '../../styles/index.css';

export const AdminOrders: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const { setError, clearError } = useError();
  const { orders, loading, error: ordersError } = useOrders(searchEmail);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      clearError();
      const email = e.target.value;
      
      // Validation basique de l'email si non vide
      if (email && !email.includes('@')) {
        setError(ERROR_MESSAGES.ORDER.INVALID_EMAIL);
        return;
      }

      setSearchEmail(email);
    } catch (err) {
      setError(handleApiError(err));
    }
  }, [setError, clearError]);

  // Gestion des erreurs du hook useOrders
  React.useEffect(() => {
    if (ordersError) {
      setError(handleApiError(ordersError));
    }
  }, [ordersError, setError]);

  const formatDate = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      setError(handleApiError(err));
      return dateString;
    }
  }, [setError]);

  const formatPrice = useCallback((price: number): string => {
    try {
      return `${price.toFixed(2)}€`;
    } catch (err) {
      setError(handleApiError(err));
      return `${price}€`;
    }
  }, [setError]);

  return (
    <div className="admin-orders">
      <h1>Gestion des Commandes</h1>
      
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
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-email">
                    <strong>Email:</strong> {order.email}
                  </div>
                  <div className="order-date">
                    <strong>Date:</strong> {formatDate(order.createdAt)}
                  </div>
                </div>
                
                <div className="order-items">
                  <strong>Articles:</strong>
                  {order.items.map((item) => (
                    <div key={item.productId} className="order-item">
                      <span className="item-name">{item.productName}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <strong>Total:</strong> {formatPrice(order.total)}
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
