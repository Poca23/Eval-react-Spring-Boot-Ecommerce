// src/components/orders/OrderList.tsx
import React from 'react';
import { Order, OrderListProps } from '../../types';
import { formatPrice } from '../../utils/formatters';
import '../../styles/index.css';

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
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
    if (!order.items) return 0;
    return order.items.reduce((total, item) => {
      if (item.product) {
        return total + (item.quantity * item.product.price);
      }
      return total;
    }, 0);
  };

  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <div className="order-header">
            <span>Commande #{order.id}</span>
            <span className={`status-${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
          
          <div className="order-details">
            <p>Email: {order.email}</p>
            <p>Date: {formatDate(order.date)}</p>
            
            {order.items && (
              <div className="order-items">
                <h4>Articles</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-detail">
                    <span>{item.product?.name || `Produit #${item.product_id}`}</span>
                    <span>Quantité: {item.quantity}</span>
                    {item.product && (
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <p className="order-total">
              Total: {formatPrice(calculateOrderTotal(order))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
