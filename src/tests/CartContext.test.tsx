// src/tests/CartContext.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../contexts/CartContext';
import { Product } from '../types';

const mockProduct: Product = {
  id: 1,
  name: "Test Product",
  price: 99.99,
  stock: 10,
  description: "Test description",
  image_url: "test.jpg"
};

const mockProduct2: Product = {
  id: 2,
  name: "Test Product 2",
  price: 49.99,
  stock: 5,
  description: "Test description 2",
  image_url: "test2.jpg"
};

const TestComponent = () => {
  const { 
    items, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotal,
    getItemCount 
  } = useCart();
  
  return (
    <div>
      <button onClick={() => addToCart(mockProduct, 1)}>Add to Cart</button>
      <button onClick={() => addToCart(mockProduct2, 1)}>Add Product 2</button>
      <button onClick={() => removeFromCart(mockProduct.id)}>Remove from Cart</button>
      <button onClick={() => updateQuantity(mockProduct.id, 2)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
      <div data-testid="cart-count">{getItemCount()}</div>
      <div data-testid="cart-total">{getTotal()}</div>
      <div data-testid="item-quantity">
        {items.find(item => item.product.id === mockProduct.id)?.quantity || 0}
      </div>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Tests existants...

  test('calculates correct total', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Ajouter deux produits différents
    await userEvent.click(screen.getByText('Add to Cart'));
    await userEvent.click(screen.getByText('Add Product 2'));

    // 99.99 + 49.99 = 149.98
    expect(screen.getByTestId('cart-total')).toHaveTextContent('149.98');
  });

  test('persists cart in localStorage', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await userEvent.click(screen.getByText('Add to Cart'));
    
    // Vérifier le localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(storedCart).toHaveLength(1);
    expect(storedCart[0].product.id).toBe(mockProduct.id);
  });

  test('prevents adding more than stock quantity', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Tenter d'ajouter plus que le stock disponible
    for(let i = 0; i < 12; i++) {
      await userEvent.click(screen.getByText('Add to Cart'));
    }

    // Vérifier que la quantité est limitée au stock disponible
    expect(screen.getByTestId('item-quantity')).toHaveTextContent('10');
  });

  test('updates total when quantity changes', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await userEvent.click(screen.getByText('Add to Cart'));
    await userEvent.click(screen.getByText('Update Quantity')); // Met à 2

    // 99.99 * 2 = 199.98
    expect(screen.getByTestId('cart-total')).toHaveTextContent('199.98');
  });

  test('maintains cart state between renders', () => {
    const { rerender } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    userEvent.click(screen.getByText('Add to Cart'));
    
    // Re-render avec le même état
    rerender(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  test('handles invalid quantity updates', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await userEvent.click(screen.getByText('Add to Cart'));
    
    // Tenter de mettre à jour avec une quantité négative
    // Cela dépend de votre implémentation, mais généralement
    // soit ça devrait être ignoré, soit ça devrait supprimer l'item
    const { updateQuantity } = useCart();
    updateQuantity(mockProduct.id, -1);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });
});
