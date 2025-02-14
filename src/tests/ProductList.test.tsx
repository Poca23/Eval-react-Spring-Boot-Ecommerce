// src/tests/ProductList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ErrorProvider } from '../contexts/ErrorContext';
import ProductList from '../components/products/ProductList';
import { fetchProducts } from '../services/api';

// Mock du service API
jest.mock('../services/api');

describe('ProductList Component', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 24',
      price: 2999.99,
      stock: 50,
      description: 'Description test',
      image_url: 'test.jpg'
    }
  ];

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
  });

  test('affiche le chargement puis les produits', async () => {
    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

    render(
      <ErrorProvider>
        <ProductList />
      </ErrorProvider>
    );

    // Vérifie l'état de chargement
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // Attend que les produits soient chargés
    await waitFor(() => {
      expect(screen.getByText('iPhone 24')).toBeInTheDocument();
    });
  });

  test('gère les erreurs de chargement', async () => {
    (fetchProducts as jest.Mock).mockRejectedValue(new Error('Erreur API'));

    render(
      <ErrorProvider>
        <ProductList />
      </ErrorProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });
});
