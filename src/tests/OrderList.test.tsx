// src/tests/OrderList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrderList } from '../components/orders/OrderList';
import { Order } from '../types';

// Mock des données de test
const mockOrders: Order[] = [
  {
    id: 1,
    email: 'test@example.com',
    status: 'PENDING',
    date: '2024-01-19T10:00:00',
    items: [
      {
        id: 1,
        order_id: 1, // Ajout de order_id manquant
        product_id: 1,
        quantity: 2,
        product: {
          id: 1,
          name: 'Test Product',
          price: 99.99,
          stock: 10,
          description: 'Test description',
          image_url: 'test.jpg'
        }
      }
    ]
  }
];

describe('OrderList', () => {
  it('renders orders correctly', () => {
    render(<OrderList orders={mockOrders} />);
    
    expect(screen.getByText('Commande #1')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(<OrderList orders={mockOrders} />);
    
    expect(screen.getByText(/19 janvier 2024/i)).toBeInTheDocument();
  });

  it('calculates and displays order total correctly', () => {
    render(<OrderList orders={mockOrders} />);
    
    expect(screen.getByText('Total: 199,98 €')).toBeInTheDocument();
  });

  it('handles orders without items', () => {
    const ordersWithoutItems: Order[] = [{
      id: 2,
      email: 'test@example.com',
      status: 'PENDING',
      date: '2024-01-19T10:00:00',
      items: []
    }];

    render(<OrderList orders={ordersWithoutItems} />);
    
    expect(screen.getByText('Total: 0,00 €')).toBeInTheDocument();
  });

  it('handles missing product information', () => {
    const ordersWithMissingProduct: Order[] = [{
      id: 3,
      email: 'test@example.com',
      status: 'PENDING',
      date: '2024-01-19T10:00:00',
      items: [{
        id: 1,
        order_id: 3, // Ajout de order_id
        product_id: 1,
        quantity: 2,
        product: undefined // Changement de null à undefined
      }]
    }];

    render(<OrderList orders={ordersWithMissingProduct} />);
    
    expect(screen.getByText('Produit #1')).toBeInTheDocument();
  });

  it('applies correct status class', () => {
    render(<OrderList orders={mockOrders} />);
    
    const statusElement = screen.getByText('PENDING');
    expect(statusElement).toHaveClass('status-pending');
  });

  it('displays order items details correctly', () => {
    render(<OrderList orders={mockOrders} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Quantité: 2')).toBeInTheDocument();
    expect(screen.getByText('199,98 €')).toBeInTheDocument();
  });

  it('renders empty list when no orders provided', () => {
    render(<OrderList orders={[]} />);
    
    // Correction de getByClassName en utilisant un sélecteur CSS valide
    const orderItems = screen.queryAllByRole('listitem');
    expect(orderItems.length).toBe(0);
  });
});
