import { render, screen, waitFor } from '@testing-library/react';
import ProductList from '../components/products/ProductList';
import { CartProvider } from '../contexts/CartContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import { api } from '../services/api';

// Mock du service API
jest.mock('../services/api', () => ({
  api: {
    getAllProducts: jest.fn()
  }
}));

describe('ProductList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 24',
      price: 2999.99,
      stock: 50,
      description: 'Test description',
      image_url: 'test-url'
    }
  ];

  it('affiche la liste des produits', async () => {
    (api.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

    render(
      <ErrorProvider>
        <CartProvider>
          <ProductList />
        </CartProvider>
      </ErrorProvider>
    );

    expect(screen.getByText('Chargement des produits...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('iPhone 24')).toBeInTheDocument();
    });
  });

  it('affiche un message quand aucun produit n\'est disponible', async () => {
    (api.getAllProducts as jest.Mock).mockResolvedValue([]);

    render(
      <ErrorProvider>
        <CartProvider>
          <ProductList />
        </CartProvider>
      </ErrorProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Aucun produit disponible')).toBeInTheDocument();
    });
  });

  it('gère les erreurs de chargement', async () => {
    (api.getAllProducts as jest.Mock).mockRejectedValue(new Error('Erreur de chargement'));

    render(
      <ErrorProvider>
        <CartProvider>
          <ProductList />
        </CartProvider>
      </ErrorProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Une erreur est survenue/)).toBeInTheDocument();
    });
  });
});
