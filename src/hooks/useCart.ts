import { useState, useCallback, useEffect } from "react";
import { Product, CartItem } from "../types";
import { useStock } from "./useStock";
import { useError } from "../contexts/ErrorContext";

const CART_STORAGE_KEY = "shopping_cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { setError } = useError();
  const { checkProductStock } = useStock();

  // Persistance du panier
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    async (product: Product, quantity: number = 1): Promise<boolean> => {
      try {
        const isStockAvailable = await checkProductStock(product.id, quantity);

        if (!isStockAvailable) {
          setError(`Stock insuffisant pour ${product.name}`, "warning");
          return false;
        }

        setCart((currentCart) => {
          const existingItem = currentCart.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (!checkProductStock(product.id, newQuantity)) {
              setError(`Stock insuffisant pour ${product.name}`, "warning");
              return currentCart;
            }

            return currentCart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            );
          }

          return [...currentCart, { product, quantity }];
        });

        setError("Produit ajouté au panier", "success");
        return true;
      } catch (err) {
        setError("Erreur lors de l'ajout au panier", "error");
        return false;
      }
    },
    [checkProductStock, setError]
  );

  const updateQuantity = useCallback(
    async (productId: number, newQuantity: number): Promise<boolean> => {
      try {
        const isStockAvailable = await checkProductStock(
          productId,
          newQuantity
        );

        if (!isStockAvailable) {
          setError("Stock insuffisant", "warning");
          return false;
        }

        setCart((currentCart) =>
          currentCart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );

        setError("Quantité mise à jour", "success");
        return true;
      } catch (err) {
        setError("Erreur lors de la mise à jour de la quantité", "error");
        return false;
      }
    },
    [checkProductStock, setError]
  );

  const removeFromCart = useCallback(
    (productId: number): void => {
      setCart((currentCart) =>
        currentCart.filter((item) => item.product.id !== productId)
      );
      setError("Produit retiré du panier", "success");
    },
    [setError]
  );

  const clearCart = useCallback((): void => {
    setCart([]);
    setError("Panier vidé", "success");
  }, [setError]);

  const getCartTotal = useCallback((): number => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  const getCartItemsCount = useCallback((): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
}
