// src/components/orders/OrderList.tsx
import React from 'react';
import { Order, OrderListProps } from '../../types';
import { formatPrice } from '../../utils/formatters';
import '../../styles/index.css';

export const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOrderTotal = (order: Order): number => {
    if (!order.items?.length) return 0;
    return order.items.reduce((total, item) => {
      if (item.product && item.price) {
        return total + (item.quantity * item.price);
      }
      return total;
    }, 0);
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'processing': 'En traitement',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  return (
    <div className="order-list" data-testid="order-list">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Aucune commande à afficher</p>
        </div>
      ) : (
        orders.map((order) => (
          <div 
            key={order.id} 
            className="order-item"
            onClick={() => onOrderSelect && onOrderSelect(order)}
            role="button"
            tabIndex={0}
          >
            <div className="order-header">
              <span className="order-number">Commande #{order.id}</span>
              <span className={`status status-${order.status.toLowerCase()}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            
            <div className="order-details">
              <div className="order-info">
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(order.date)}
                </p>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="order-items">
                  <h4>Articles</h4>
                  <div className="items-list">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item-detail">
                        <span className="item-name">
                          {item.product?.name || `Produit #${item.product_id}`}
                        </span>
                        <span className="item-quantity">
                          Quantité: {item.quantity}
                        </span>
                        {item.price && (
                          <span className="item-price">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="order-total">
                <strong>Total:</strong> {formatPrice(calculateOrderTotal(order))}
              </div>

              {order.shippingAddress && (
                <div className="shipping-details">
                  <h4>Adresse de livraison</h4>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
