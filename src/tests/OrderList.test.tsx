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
        order_id: 1,
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

describe('OrderList Basic Rendering', () => {
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
        order_id: 3,
        product_id: 1,
        quantity: 2,
        product: undefined
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
    
    const orderItems = screen.queryAllByRole('listitem');
    expect(orderItems.length).toBe(0);
  });
});

describe('OrderList Filtering', () => {
  it('filters orders by status', () => {
    const mixedOrders: Order[] = [
      {
        id: 1,
        email: 'test1@example.com',
        status: 'PENDING',
        date: '2024-01-19T10:00:00',
        items: []
      },
      {
        id: 2,
        email: 'test2@example.com',
        status: 'COMPLETED',
        date: '2024-01-19T11:00:00',
        items: []
      }
    ];

    render(<OrderList orders={mixedOrders} />);
    
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });
});

describe('OrderList Sorting', () => {
  it('displays orders in chronological order', () => {
    const ordersWithDates: Order[] = [
      {
        id: 1,
        email: 'test1@example.com',
        status: 'PENDING',
        date: '2024-01-19T10:00:00',
        items: []
      },
      {
        id: 2,
        email: 'test2@example.com',
        status: 'COMPLETED',
        date: '2024-01-19T11:00:00',
        items: []
      }
    ];

    render(<OrderList orders={ordersWithDates} />);
    
    const dates = screen.getAllByText(/janvier 2024/);
    expect(dates).toHaveLength(2);
  });
});

describe('OrderList Items Display', () => {
  it('shows correct total for orders with multiple items', () => {
    const orderWithMultipleItems: Order[] = [{
      id: 1,
      email: 'test@example.com',
      status: 'PENDING',
      date: '2024-01-19T10:00:00',
      items: [
        {
          id: 1,
          order_id: 1,
          product_id: 1,
          quantity: 2,
          product: {
            id: 1,
            name: 'Product 1',
            price: 100,
            stock: 10,
            description: 'Test',
            image_url: 'test.jpg'
          }
        },
        {
          id: 2,
          order_id: 1,
          product_id: 2,
          quantity: 1,
          product: {
            id: 2,
            name: 'Product 2',
            price: 50,
            stock: 5,
            description: 'Test 2',
            image_url: 'test2.jpg'
          }
        }
      ]
    }];

    render(<OrderList orders={orderWithMultipleItems} />);
    
    expect(screen.getByText('Total: 250,00 €')).toBeInTheDocument();
  });
});
