// src/components/cart/Cart.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CheckoutForm from './CheckoutForm';

const Cart: React.FC = () => {
    const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);

    if (items.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Votre panier est vide</h2>
                <button 
                    onClick={() => navigate('/products')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Continuer vos achats
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Votre Panier</h2>
            
            <div className="space-y-4">
                {items.map((item) => (
                    <CartItem 
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                    />
                ))}
            </div>

            <CartSummary 
                total={total}
                onClearCart={clearCart}
                onCheckout={() => setShowCheckout(true)}
            />

            {showCheckout && (
                <CheckoutForm onClose={() => setShowCheckout(false)} />
            )}
        </div>
    );
};

export default Cart;
