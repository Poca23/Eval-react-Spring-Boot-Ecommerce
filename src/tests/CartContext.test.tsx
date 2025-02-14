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

const TestComponent = () => {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  return (
    <div>
      <button onClick={() => addToCart(mockProduct, 1)}>Add to Cart</button>
      <button onClick={() => removeFromCart(mockProduct.id)}>Remove from Cart</button>
      <button onClick={() => updateQuantity(mockProduct.id, 2)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
      <div data-testid="cart-count">{items.length}</div>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('adds product to cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add to Cart');
    await userEvent.click(addButton);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  test('removes product from cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add to Cart');
    await userEvent.click(addButton);

    const removeButton = screen.getByText('Remove from Cart');
    await userEvent.click(removeButton);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  test('updates quantity in cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add to Cart');
    await userEvent.click(addButton);

    const updateButton = screen.getByText('Update Quantity');
    await userEvent.click(updateButton);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  test('clears cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add to Cart');
    await userEvent.click(addButton);

    const clearButton = screen.getByText('Clear Cart');
    await userEvent.click(clearButton);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });
});
