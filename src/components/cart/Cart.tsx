// src/components/cart/Cart.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useError } from '../../contexts/ErrorContext';
import { handleApiError } from '../../utils/errorHandler';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CheckoutForm from './CheckoutForm';
import '../../styles/index.css';

const Cart: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { setError } = useError();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);

    const total = React.useMemo(() => 
        cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        [cart]
    );

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        try {
            await updateQuantity(id, quantity);
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const handleRemoveFromCart = async (id: number) => {
        try {
            await removeFromCart(id);
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Votre panier est vide</h2>
                <button 
                    onClick={() => navigate('/products')}
                    className="continue-shopping"
                >
                    Continuer vos achats
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Votre Panier</h2>
            
            <div className="cart-items">
                {cart.map((item) => (
                    <CartItem 
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveFromCart}
                    />
                ))}
            </div>

            <CartSummary 
                total={total}
                onClearCart={handleClearCart}
                onCheckout={() => setShowCheckout(true)}
            />

            {showCheckout && (
                <CheckoutForm onClose={() => setShowCheckout(false)} />
            )}
        </div>
    );
};

export default Cart;
