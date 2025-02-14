import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useError } from '../../contexts/ErrorContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CheckoutForm from './CheckoutForm';
import '../../styles/index.css';

const Cart: React.FC = () => {
    const { 
        cart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        getCartTotal 
    } = useCart();
    const { setError } = useError();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const total = getCartTotal();

    const handleUpdateQuantity = useCallback(async (id: number, quantity: number) => {
        setIsProcessing(true);
        try {
            if (quantity < 1) {
                setError("La quantité doit être supérieure à 0", "warning");
                return;
            }
            const success = await updateQuantity(id, quantity);
            if (!success) {
                setError("Impossible de mettre à jour la quantité", "error");
            }
        } catch (err) {
            setError("Erreur lors de la mise à jour de la quantité", "error");
        } finally {
            setIsProcessing(false);
        }
    }, [updateQuantity, setError]);

    const handleRemoveFromCart = useCallback(async (id: number) => {
        setIsProcessing(true);
        try {
            removeFromCart(id);
        } catch (err) {
            setError("Erreur lors de la suppression du produit", "error");
        } finally {
            setIsProcessing(false);
        }
    }, [removeFromCart, setError]);

    const handleClearCart = useCallback(async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
            return;
        }
        
        setIsProcessing(true);
        try {
            clearCart();
        } catch (err) {
            setError("Erreur lors du vidage du panier", "error");
        } finally {
            setIsProcessing(false);
        }
    }, [clearCart, setError]);

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
            
            <div className="cart-content">
                <div className="cart-items">
                    {cart.map((item) => (
                        <CartItem 
                            key={item.product.id}
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveFromCart}
                            disabled={isProcessing}
                        />
                    ))}
                </div>

                <CartSummary 
                    total={total}
                    onClearCart={handleClearCart}
                    onCheckout={() => setShowCheckout(true)}
                    disabled={isProcessing}
                />
            </div>

            {showCheckout && (
                <CheckoutForm 
                    onClose={() => setShowCheckout(false)}
                    disabled={isProcessing}
                />
            )}
        </div>
    );
};

export default Cart;
