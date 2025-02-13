// src/components/orders/OrderList.tsx
import React from 'react';
import { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <p>Email: {order.customerEmail}</p>
          <p>Total: {order.totalAmount}€</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;