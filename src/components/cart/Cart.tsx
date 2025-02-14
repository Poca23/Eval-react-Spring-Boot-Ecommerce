// src/components/cart/Cart.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useError } from '../../contexts/ErrorContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CheckoutForm from './CheckoutForm';
import '../../styles/index.css';

const Cart: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { setError } = useError();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calcul du total avec mémoization
    const total = React.useMemo(() => 
        cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        [cart]
    );
    

    // Gestionnaire de quantité
    const handleUpdateQuantity = useCallback(async (id: number, quantity: number) => {
        setIsProcessing(true);
        try {
            if (quantity < 1) {
                setError("La quantité doit être supérieure à 0", "warning");
                return;
            }
            await updateQuantity(id, quantity);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erreur lors de la mise à jour de la quantité",
                "error"
            );
        } finally {
            setIsProcessing(false);
        }
    }, [updateQuantity, setError]);

    // Gestionnaire de suppression
    const handleRemoveFromCart = useCallback(async (id: number) => {
        setIsProcessing(true);
        try {
            await removeFromCart(id);
            setError("Produit retiré du panier", "success");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erreur lors de la suppression du produit",
                "error"
            );
        } finally {
            setIsProcessing(false);
        }
    }, [removeFromCart, setError]);

    // Gestionnaire de vidage du panier
    const handleClearCart = useCallback(async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
            return;
        }
        
        setIsProcessing(true);
        try {
            await clearCart();
            setError("Panier vidé avec succès", "success");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erreur lors du vidage du panier",
                "error"
            );
        } finally {
            setIsProcessing(false);
        }
    }, [clearCart, setError]);

    // Affichage du panier vide
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
