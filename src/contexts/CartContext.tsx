// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => Promise<boolean>;
    updateQuantity: (productId: number, newQuantity: number) => Promise<boolean>;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    stockError: string | null;
    total: number;
  }
  
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
        calculateTotal();
    }, [items]);

    const calculateTotal = () => {
        const newTotal = items.reduce((sum, item) => 
            sum + (item.product.price * item.quantity), 0);
        setTotal(newTotal);
    };

    const addToCart = (product: Product, quantity: number) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(
                item => item.product.id === product.id
            );

            if (existingItem) {
                return currentItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...currentItems, { product, quantity }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems(currentItems => 
            currentItems.filter(item => item.product.id !== productId)
        );
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            total
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
