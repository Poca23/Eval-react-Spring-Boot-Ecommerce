// src/tests/OrderList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderList } from '../components/orders/OrderList';
import { Order, OrderItem } from '../types';

// Mock des données de test
const mockOrderItem: OrderItem = {
  id: 1,
  order_id: 1,
  product_id: 1,
  quantity: 2,
  price: 99.99,
  product: {
    id: 1,
    name: "Test Product",
    price: 99.99,
    description: "Test Description",
    image_url: "test.jpg",
    stock: 10
  }
};

const mockOrder: Order = {
  id: 1,
  userId: 1,
  status: 'PENDING',
  date: '2023-01-01T12:00:00Z',
  email: 'test@example.com',
  items: [mockOrderItem],
  shippingAddress: {
    fullName: 'John Doe',
    street: '123 Test St',
    city: 'Test City',
    postalCode: '12345',
    country: 'Test Country',
    phone: '123456789',
    email: 'test@example.com'
  }
};

const mockOrders: Order[] = [mockOrder];

describe('OrderList', () => {
  const mockOnOrderSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche correctement la liste des commandes', () => {
    render(<OrderList orders={mockOrders} onOrderSelect={mockOnOrderSelect} />);

    expect(screen.getByText(/Commande #1/i)).toBeInTheDocument();
    expect(screen.getByText(/En attente/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
  });

  test('affiche un message quand il n\'y a pas de commandes', () => {
    render(<OrderList orders={[]} onOrderSelect={mockOnOrderSelect} />);
    
    expect(screen.getByText(/Aucune commande à afficher/i)).toBeInTheDocument();
  });

  test('appelle onOrderSelect lors du clic sur une commande', () => {
    render(<OrderList orders={mockOrders} onOrderSelect={mockOnOrderSelect} />);
    
    const orderItem = screen.getByRole('button');
    fireEvent.click(orderItem);
    
    expect(mockOnOrderSelect).toHaveBeenCalledWith(mockOrder);
  });

  test('affiche correctement les détails de livraison', () => {
    render(<OrderList orders={mockOrders} onOrderSelect={mockOnOrderSelect} />);
    
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Test St/i)).toBeInTheDocument();
    expect(screen.getByText(/Test City, 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Country/i)).toBeInTheDocument();
  });

  test('affiche correctement le total de la commande', () => {
    render(<OrderList orders={mockOrders} onOrderSelect={mockOnOrderSelect} />);
    
    expect(screen.getByText(/199,98 €/i)).toBeInTheDocument();
  });

  test('gère correctement les commandes sans items', () => {
    const orderWithoutItems: Order = {
      ...mockOrder,
      items: []
    };
    
    render(<OrderList orders={[orderWithoutItems]} onOrderSelect={mockOnOrderSelect} />);
    
    expect(screen.getByText(/0,00 €/i)).toBeInTheDocument();
  });

  test('affiche correctement les différents statuts de commande', () => {
    const ordersWithDifferentStatus: Order[] = [
      { ...mockOrder, id: 1, status: 'PENDING' },
      { ...mockOrder, id: 2, status: 'PROCESSING' },
      { ...mockOrder, id: 3, status: 'COMPLETED' },
      { ...mockOrder, id: 4, status: 'CANCELLED' }
    ];
    
    render(<OrderList orders={ordersWithDifferentStatus} onOrderSelect={mockOnOrderSelect} />);

    expect(screen.getByText(/En attente/i)).toBeInTheDocument();
    expect(screen.getByText(/En traitement/i)).toBeInTheDocument();
    expect(screen.getByText(/Terminée/i)).toBeInTheDocument();
    expect(screen.getByText(/Annulée/i)).toBeInTheDocument();
  });

  test('formate correctement la date', () => {
    render(<OrderList orders={mockOrders} onOrderSelect={mockOnOrderSelect} />);
    
    // Le format exact dépendra de la locale, mais nous pouvons vérifier la présence de l'année
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  test('gère la navigation au clavier', () => {
    render(<OrderList orders={mockOrders} onOrderSelect={mockOnOrderSelect} />);
    
    const orderItem = screen.getByRole('button');
    fireEvent.keyPress(orderItem, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnOrderSelect).toHaveBeenCalledWith(mockOrder);
  });

  test('affiche correctement les quantités et prix unitaires', () => {
    render(<OrderList orders={mockOrders} onOrderSelect={mockOnOrderSelect} />);
    
    expect(screen.getByText(/Quantité: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/99,99 €/i)).toBeInTheDocument();
  });
});
