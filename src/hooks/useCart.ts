// src/hooks/useCart.ts
import { useState, useCallback } from "react";
import { Product, CartItem } from "../types";
import { useStock } from "./useStock";
import "../styles/index.css";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stockError, setStockError] = useState<string | null>(null);
  const { checkProductStock } = useStock();

  const addToCart = useCallback(
    async (product: Product, quantity: number = 1): Promise<boolean> => {
      setStockError(null);

      const isStockAvailable = await checkProductStock(product.id, quantity);
      if (!isStockAvailable) {
        setStockError(`Stock insuffisant pour ${product.name}`);
        return false;
      }

      setCart((currentCart) => {
        const existingItem = currentCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          return currentCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [...currentCart, { product, quantity }];
      });

      return true;
    },
    [checkProductStock]
  );

  const updateQuantity = useCallback(
    async (productId: number, newQuantity: number): Promise<boolean> => {
      const isStockAvailable = await checkProductStock(productId, newQuantity);
      if (!isStockAvailable) {
        setStockError("Stock insuffisant");
        return false;
      }

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      return true;
    },
    [checkProductStock]
  );

  const removeFromCart = useCallback((productId: number): void => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  const clearCart = useCallback((): void => {
    setCart([]);
  }, []);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    stockError,
  };
}
